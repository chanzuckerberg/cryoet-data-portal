import functools
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
        self.cls = cls
        self.name = name

    def to_gql(self):
        return self.name


class BaseField(GQLField):
    def __init__(self, cls: Optional[type] = None, name: Optional[str] = None):
        self.cls = cls
        self.name = name


class StringField(BaseField):
    ...


class IntField(BaseField):
    ...


class DateField(BaseField):
    ...


class BooleanField(BaseField):
    ...


class FloatField(BaseField):
    ...


class QueryChain(GQLField):
    def __init__(self, relationship, attr):
        self.__current_query = getattr(relationship.related_class, attr)
        self.__name = [relationship.name, attr]

    def __getattr__(self, attr):
        self.__current_query = getattr(self.__current_query, attr)
        self.__name.append(attr)
        return self

    def to_gql(self):
        return self.__name


class Relationship(GQLField):
    descriptor_class: type

    def __init__(self, related_class, source_field, dest_field, cls: Optional[type] = None, name: Optional[str] = None):
        self.related_class = related_class
        self.source_field = source_field
        self.dest_field = dest_field

        # Helpers for resolving GQL field names.
        self.cls = cls
        self.name = name

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
        filters = obj._client.generate_filters(self.related_class, self.dest_field, getattr(obj, self.source_field))
        res = obj._client.find_one(self.related_class, filters)
        return res


class ListRelationship(Relationship):
    def __get__(self, obj, obj_class=None):
        if obj is None:
            return self
        filters = obj._client.generate_filters(self.related_class, self.dest_field, getattr(obj, self.source_field))
        return obj._client.find(self.related_class, filters)


class Model:
    _gql_type: str

    def __init__(self, client: Client, **kwargs):
        self._client = client
        for k in self._get_scalar_fields():
            setattr(self, k, kwargs.get(k))

    def to_dict(self):
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
    def find(cls, client: Client, query_filters: Optional[Iterable[GQLExpression]] = None):
        filters = {}
        if query_filters:
            for expression in query_filters:
                filters.update(expression.to_gql())
        return client.find(cls, filters)

    @classmethod
    def get_by_id(cls, client: Client, id: int):
        filters = {"id": {"_eq": id}}
        return client.find_one(cls, filters)

    @classmethod
    def setup(cls):
        for field in cls._get_scalar_fields():
            getattr(cls, field).configure(cls, field)
        for field in cls._get_relationship_fields():
            getattr(cls, field).configure(cls, field)
            getattr(cls, field).resolve_class()
