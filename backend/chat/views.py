from .models import Chat
from .serializers import ChatSerializer

from rest_framework import viewsets

from django.http import HttpResponse

import json


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all().order_by('id')


def get_chat_messages(request, office):
    output = list(Chat.objects.filter(group=office).order_by('id').values())
        
    for i in range(1, len(output)):
        if output[i]['date'] == output[i-1]['date']:
            output[i]['content'] = output[i-1]['content'] + output[i]['content']
            output[i-1] = 'Null'

    output = json.dumps(output)

    return HttpResponse(output)


def get_chat_missing(request, chat_id):
    output = list(Chat.objects.filter(id__gte=int(chat_id) + 1).values())

    output = json.dumps(output)

    return HttpResponse(output)
