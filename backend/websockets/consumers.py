import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class Consumer(WebsocketConsumer):
    def __init__(self, *args):
        self.dict_string = '{'
        
        for arg in args:
            self.arg = arg

            self.dict_string += f'"{arg}": {arg},'

        self.dict_string += '}'

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
        for arg in self.args:
            arg = text_data_json[f"{arg}"]
        # name = text_data_json["name"]
        # message = text_data_json["message"]
        # email = text_data_json["email"]
        # image = text_data_json["image"]
        # date = text_data_json["date"]

        dict = {"type": "chat_message"}
        dict.update(json.loads(self.dict_string))

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            dict
        )

    # Recieve message from room group
    def chat_message(self, event):
        for arg in self.args:
            arg = event[f"{arg}"]
        # name = event["name"]
        # message = event["message"]
        # email = event["email"]
        # image = event["image"]
        # date = event["date"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({
                json.loads(self.dict_string)
            })
        )