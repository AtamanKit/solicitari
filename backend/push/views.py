from django.conf import settings
# from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from pywebpush import webpush

from .models import SubscriptionObject

import json

import logging
logger = logging.getLogger(__name__)

################## PUSH NOTIFICATIONS SECTIONS ############
@api_view(['GET'])
def vapid_public_key(request):
    try:
        VAPID_PUBLIC_KEY = settings.WEBPUSH_SETTINGS['VAPID_PUBLIC_KEY']
        
        return Response({'vapid_public_key': VAPID_PUBLIC_KEY}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'Error': e}, status=status.HTTP_400_BAD_REQUEST)

def send_web_push(subscription_information, push_body):
    VAPID_PRIVATE_KEY = settings.WEBPUSH_SETTINGS['VAPID_PRIVATE_KEY']
    VAPID_CLAIMS = settings.WEBPUSH_SETTINGS['VAPID_CLAIMS']

    return webpush(
        subscription_info=subscription_information,
        data=push_body,
        vapid_private_key=VAPID_PRIVATE_KEY,
        vapid_claims=VAPID_CLAIMS
    )

@api_view(['POST'])
def push_notifications(request):
    if not request.body:
        return Response({'Send Push Error': 'Failed in Request Body'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = json.loads(request.body)

    try:
        office = data['office']
        content = data['content']
        sender = data['sender']

        push_data = json.dumps({
                        'message': f'Oficiul: {office}, {content}',
                    })

        queryset = SubscriptionObject.objects.all()

        for subscription in queryset:
            if subscription.user != sender:
                try:
                    send_web_push(subscription.object, push_data)
                except Exception as e:
                    logger.error(f"Failed to send to {subscription.user}: {str(e)}")

        return Response({'Send Push Response': 'Success'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'Send Push Error': e}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST', 'DELETE'])
def update_push_model(request):
    push = SubscriptionObject()

    if not request.body:
            return Response({'Update Push Error': 'Failed in Requesting Body'}, status=status.HTTP_400_BAD_REQUEST)
        
    data = json.loads(request.body)
    sender = data['sender']

    if request.method == 'POST':
        try:
            sub_token = data['sub_token']

            push.user = sender
            push.object = sub_token
            push.save()
            
            return Response({'Update Push Response': 'Successfully Added User'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'Update Push Error': e}, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        try:
            SubscriptionObject.objects.get(user=sender).delete()

            return Response({'Update Push Response': 'Successfully Removed User'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Update Push Response': e}, status=status.HTTP_400_BAD_REQUEST)
