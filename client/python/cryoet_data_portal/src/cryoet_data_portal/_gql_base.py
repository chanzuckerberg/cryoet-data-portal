import functools
from datetime import datetime, timezone
from importlib import import_module
from typing import Any, Dict, Iterable, Optional

from ._client import Client


class GQLExpression:
    def __init__(self, field: "GQLField", operator, value: Optional[Any]):
        self.field = field
        self.operator = operator
        self.value = value

    def to_gql(self) -> Dict[str, Any]:
        fieldname = self.field.to_gql()
        gql = {}
        if isinstance(fieldname, list):
            for item in fieldname[::-1]:
                if not gql:
                    gql = {item: {self.operator: self.value}}
                    continue
                gql = {item: gql}
            return gql
        return {fieldname: {self.operator: self.value}}


class GQLField:
    def __init__(self):
        pass

    def __eq__(self, value) -> GQLExpression:
        return GQLExpression(self, "_eq", value)

    def __ne__(self, value) -> GQLExpression:
        return GQLExpression(self, "_neq", value)

    def __gt__(self, value) -> GQLExpression:
        return GQLExpression(self, "_gt", value)

    def __ge__(self, value) -> GQLExpression:
        return GQLExpression(self, "_gte", value)

    def __lt__(self, value) -> GQLExpression:
        return GQLExpression(self, "_lt", value)

    def __le__(self, value) -> GQLExpression:
        return GQLExpression(self, "_lte", value)

    def is_null(self, value: bool = True) -> GQLExpression:
        return GQLExpression(self, "_is_null", value)

    def ilike(self, value: str) -> GQLExpression:
        return GQLExpression(self, "_ilike", value)

    def like(self, value: str) -> GQLExpression:
        return GQLExpression(self, "_like", value)

    def _in(self, value) -> GQLExpression:
        return GQLExpression(self, "_in", value)

    def configure(self, cls, name):
        self._cls = cls
        self._name = name

    def to_gql(self):
        return self._name


class BaseField(GQLField):
    def __init__(self, cls: Optional[type] = None, name: Optional[str] = None):
        self._cls = cls
        self._name = name

    def convert(self, value):
        return value


class StringField(BaseField):
    ...


class IntField(BaseField):
    ...


class DateField(BaseField):
    def convert(self, value):
        if value:
            return datetime.date(
                datetime.strptime(value, "%Y-%m-%d").astimezone(timezone.utc),
            )


class BooleanField(BaseField):
    ...


class FloatField(BaseField):
    ...


class QueryChain(GQLField):
    def __init__(self, relationship, attr):
        self.__current_query = getattr(relationship.related_class, attr)
        self.__name = [relationship._name, attr]

    def __getattr__(self, attr):
        self.__current_query = getattr(self.__current_query, attr)
        self.__name.append(attr)
        return self

    def to_gql(self):
        return self.__name


class Relationship(GQLField):
    descriptor_class: type

    def __init__(
        self,
        related_class,
        source_field,
        dest_field,
        cls: Optional[type] = None,
        name: Optional[str] = None,
    ):
        self.related_class = related_class
        self.source_field = source_field
        self.dest_field = dest_field

        # Helpers for resolving GQL field names.
        self._cls = cls
        self._name = name

    def resolve_class(self):
        if type(self.related_class) is not type:
            module = import_module(f"{__package__}._models")
            self.related_class = getattr(module, self.related_class)

    # If we're trying to chain fields when generating a query, let's hand that
    # functionality off to QueryChain to handle
    def __getattr__(self, attr):
        return QueryChain(self, attr)


class ItemRelationship(Relationship):
    def __get__(self, obj, obj_class=None):
        if obj is None:
            return self
        for item in self.related_class.find(
            obj._client,
            [
                getattr(self.related_class, self.dest_field)
                == getattr(obj, self.source_field),
            ],
        ):
            return item


class ListRelationship(Relationship):
    def __get__(self, obj, obj_class=None):
        if obj is None:
            return self
        res = self.related_class.find(
            obj._client,
            [
                getattr(self.related_class, self.dest_field)
                == getattr(obj, self.source_field),
            ],
        )
        return res


class Model:
    """The base class that all CryoET Portal Domain Object classes descend from. Documented methods apply to all domain objects."""

    _gql_type: str

    def __init__(self, client: Client, **kwargs):
        self._client = client
        for k in self._get_scalar_fields():
            value = getattr(self, k).convert(kwargs.get(k))
            setattr(self, k, value)

    def to_dict(self) -> Dict[str, Any]:
        """Return a dictionary representation of this object's attributes"""
        return {k: getattr(self, k) for k in self._get_scalar_fields()}

    @classmethod
    @functools.lru_cache(maxsize=32)
    def _get_scalar_fields(cls):
        fields = []
        for k, v in cls.__dict__.items():
            if issubclass(type(v), BaseField):
                fields.append(k)
        return fields

    @classmethod
    @functools.lru_cache(maxsize=32)
    def _get_relationship_fields(cls):
        fields = []
        for k, v in cls.__dict__.items():
            if issubclass(type(v), Relationship):
                fields.append(k)
        return fields

    @classmethod
    def _get_gql_type(cls):
        return cls._gql_type

    @classmethod
    def find(
        cls,
        client: Client,
        query_filters: Optional[Iterable[GQLExpression]] = None,
    ):
        """Find objects based on a set of search filters.

        Search filters are combined with *and* so all results will match all filters.

        Expressions must be in the format:
            ``ModelSubclass.field`` ``{operator}`` ``{value}``

        Supported operators are: ``==``, ``!=``, ``>``, ``>=``, ``<``, ``<=``, ``like``, ``ilike``, ``_in``

        - ``like`` is a partial match, with the `%` character being a wildcard
        - ``ilike`` is similar to ``like`` but case-insensitive
        - ``_in`` accepts a list of values that are acceptable matches.

        Values may be strings or numbers depending on the type of the field being matched, and `_in` supports a list of values of the field's corresponding type.

        ``ModelSubclass.field`` may be an arbitrarily nested path to any field on any related model, such as:
            ``ModelSubclass.related_class_field.related_field.second_related_class_field.second_field``

        Args:
            client:
                A CryoET Portal API Client
            query_filters:
                A set of expressions that narrow down the search results

        Yields:
            Matching Model objects.

        Examples:

            Filter runs by attributes, including attributes in related models:

            >>> runs = Run.find(client, query_filters=[Run.name == "TS_026", Run.dataset.id == 10000])

            Get all results for this type:

            >>> runs = Run.find(client)
        """
        filters = {}
        if query_filters:
            for expression in query_filters:
                filters.update(expression.to_gql())
        return client.find(cls, filters)

    @classmethod
    def get_by_id(cls, client: Client, id: int):
        """Find objects by primary key

        Args:
            client:
                A CryoET Portal API Client
            id:
                Unique identifier for the object

        Returns:
            A matching Model object if found, None otherwise.

        Examples:
            Get a Run by ID:

            >>> run = Run.get_by_id(client, 1)
                print(run.name)
        """
        results = cls.find(client, [cls.id == id])
        for result in results:
            return result

    @classmethod
    def setup(cls):
        for field in cls._get_scalar_fields():
            getattr(cls, field).configure(cls, field)
        for field in cls._get_relationship_fields():
            getattr(cls, field).configure(cls, field)
            getattr(cls, field).resolve_class()
