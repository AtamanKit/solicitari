import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class CallConsumer(WebsocketConsumer):
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
        city = text_data_json["city"]
        pt = text_data_json["pt"]
        content = text_data_json["content"]
        status = text_data_json["status"]
        user = text_data_json["user"]
        date = text_data_json["date"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": id,
                "city": city,
                "pt": pt,
                "content": content,
                "status": status,
                "user": user,
                "date": date,
            }
        )

    def chat_message(self, event):
        id = event["id"]
        city = event["city"]
        pt = event["pt"]
        content = event["content"]
        status = event["status"]
        user = event["user"]
        date = event["date"]

        self.send(text_data=json.dumps({
                "id": id,
                "city": city,
                "pt": pt,
                "content": content,
                "status": status,
                "user": user,
                "date": date,
            })
        )


