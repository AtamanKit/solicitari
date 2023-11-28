import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Recieve message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        name = text_data_json["name"]
        message = text_data_json["message"]
        email = text_data_json["email"]
        image = text_data_json["image"]
        date = text_data_json["date"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "name": name,
                "message": message,
                "email": email,
                "image": image,
                "date": date,
            }
        )

    # Recieve message from room group
    def chat_message(self, event):
        name = event["name"]
        message = event["message"]
        email = event["email"]
        image = event["image"]
        date = event["date"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            "name": name,
            "message": message,
            "email": email,
            "image": image,
            "date": date,
            })
        )


class NotifChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        id = text_data_json["id"]
        group = text_data_json["group"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": id,
                "group": group,
            }
        )

    def chat_message(self, event):
        id = event["id"]
        group = event["group"]

        self.send(text_data=json.dumps({
                "id": id,
                "group": group,
            })
        )
