from django.db import models


class SubscriptionObject(models.Model):
    user = models.CharField(max_length=64, unique=True)
    object = models.JSONField()