from django.contrib import admin
from .models import SubscriptionObject


@admin.register(SubscriptionObject)
class SubscriptionObjectAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user',)

