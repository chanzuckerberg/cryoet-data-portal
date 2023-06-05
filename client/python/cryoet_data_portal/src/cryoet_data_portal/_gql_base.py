import functools
from typing import Any, Dict
from ._client import Client


class BaseField:
    ...


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


class Relationship:
    descriptor_class: type

    def __init__(self, related_class, source_field, dest_field):
        self.related_class = related_class
        self.source_field = source_field
        self.dest_field = dest_field


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
    def _get_gql_type(cls):
        return cls._gql_type

    @classmethod
    def find(cls, client: Client, query_filters=Dict[str, Any]):
        return client.find(cls)

    @classmethod
    def get_by_id(cls, client: Client, id: int):
        filters = client.generate_filters(cls, "id", id)
        return client.find_one(cls, filters)
