from .models import Call

from rest_framework import serializers


class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = [
            'id',
            'office',
            'city',
            'date_reg',
            'sector',
            'pt',
            'feader',
            'account',
            'name',
            'telephone',
            'content',
            'status',
            'remark',
            'state',
            'email_ex',
            'email_reg',
            'name_ex',
            'name_reg',
            'date_ex',
        ]


class UnexecSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = [
            'state',
            'email_ex',
            'name_ex',
            'date_ex',
        ]

class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = [
            'remark',
        ]