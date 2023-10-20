from django.db import models


class Chat(models.Model):
    date = models.CharField(max_length=32)
    group = models.CharField(max_length=32)
    content = models.JSONField()