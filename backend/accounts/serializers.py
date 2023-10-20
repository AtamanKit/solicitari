from djoser.serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserCreatePasswordRetypeSerializer,
)

from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreatePasswordRetypeSerializer(UserCreatePasswordRetypeSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
            'first_name',
            'last_name',
            'user_from',
        ]


class UserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'user_from',
        ]
