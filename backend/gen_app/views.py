# from urllib import request
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
# from django.conf import settings

from .models import Call
from .serializers import CallSerializer, UnexecSerializer, RemarkSerializer

from rest_framework import viewsets
# from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from pymongo import MongoClient

# from pywebpush import webpush

import json

import re


# Declare pymongo variable, working with mongodb
client = MongoClient("mongodb+srv://PdjtUn:123pdj34@red-nord.lhwnm.mongodb.net/?retryWrites=true&w=majority")
db_gen = client.General

# Create json of offices for making an endpoint that contains offices
offices = []

for office in db_gen.oficii.find():
    offices.append(office)

offices = sorted(offices, key=lambda k: k['name'])
offices = json.dumps(offices)

def office(request):
    return HttpResponse(offices)

# Get abreviation of the office name uppercase and lowercase
def office_abr_up(office_long):
    for office in db_gen.oficii.find():
        if office['name'] == office_long:
            return office['abr']

def office_abr_low(office_long):
    output = office_abr_up(office_long).lower()

    return output

# Get location based on office retrieving data from  pt_office mongodb
# database: General
@csrf_exempt
def get_cities(request):
    office_dict = json.loads(request.body)
    pt = 'pt_' + office_abr_low(office_dict['office'])

    cities = []
    
    for i in db_gen[pt].find():
        if i['localitatea'] != None:
            if i['localitatea'].strip() not in cities:
                cities.append(i['localitatea'].strip())
        
    cities_new = []
    for city in cities:
        if 's.' in city:
            city = city.strip('s.')
        elif 'or.' in city:
            city = city.strip('or.')

        cities_new.append(city)

    cities_new.sort()
    str_cities = str(cities_new)

    return HttpResponse([str_cities])


# Get sector based on pt
@csrf_exempt
def get_sector(request):
    data = json.loads(request.body)

    pt = 'pt_' + office_abr_low(data['office'])

    for i in db_gen[pt].find():
        if i['pt'] == data['pt']:
            output = i['sector']
            break

    return HttpResponse(output)


# Get pt based on location and account
@csrf_exempt
def get_pt(request):
    data = json.loads(request.body)

    pt = 'pt_' + office_abr_low(data['office'])

    if pt != 'pt_un':
        if len(data['account']) == 6:
            pt_num = data['account'][0:2]
            feader_num = data['account'][2]
        elif len(data['account']) > 6:
            pt_num = data['account'][0:3]
            feader_num = data['account'][3]

        for i in db_gen[pt].find():
            if re.match(f'PT{pt_num}[A-Z][A-Z]', i['pt']):
                pt_den = i['pt']
                break
            

        output = {
            'pt': pt_den,
            'feader': feader_num,
        }

        output = json.dumps(output)
    
    else:
        output = []

        for i in db_gen[pt].find():
            if data['city'] in str(i['localitatea']):
                output.append(i['pt'])

        output.sort()
        output = str(output)

    return HttpResponse(output)

# Get damages from mongodb
@csrf_exempt
def damages(request):
    output = db_gen.nomenclator.find_one({'name': 'deranjament'})
    output = output['lista']
    output.sort()
    output = str(output)
    
    return HttpResponse(output)


# Create views for serializers
class CallViewSet(viewsets.ModelViewSet):
    # queryset = Call.objects.all()
    serializer_class = CallSerializer


    def get_queryset(self):
        queryset = Call.objects.all().order_by('id')

        office = self.request.query_params.get('office')
        id = self.request.query_params.get('id')

        if office:
            if office == 'undefined':
                queryset = Call.objects.all().order_by('id')
            else:
                queryset = Call.objects.filter(office=office).order_by('id')
        elif id:
            queryset = Call.objects.filter(id=id)

        return queryset


# Modifying "Neexecutat" and "Remarca"
# class UnexecViewSet(viewsets.ModelViewSet):
#     queryset = Call.objects.all()
#     serializer_class = UnexecSerializer

#     def update(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()

#             # Checking if remark is false or not,
#             # if not then update it
#             if request.data.get('remark') != 'false':
#                 new_remark = request.data.get('remark')

#                 instance.remark = new_remark

#             # Checking if state is false or not,
#             # if not then update 'state', 'email_ex', 'name_ex', 'date_ex'
#             if request.data.get('state') != 'false':
#                 if request.data.get('state') == 'Executat':
#                     instance.state = request.data.get('state')
#                     instance.email_ex = request.data.get('email_ex')
#                     instance.name_ex = request.data.get('name_ex')
#                     instance.date_ex = request.data.get('date_ex')

#                 else:
#                     instance.state = request.data.get('state')

#             instance.save()

#             return Response({'message': 'Successfully updated Call model'}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'Error in updating Call model': e}, status=status.HTTP_400_BAD_REQUEST)

############ API for execution calls ###############
@api_view(['PUT'])
def get_executed(request, record):
    try:
        pass
        call = Call.objects.get(pk=record)
        
        data = request.data

        remark = data['remark']
        state = data['state']
        email_ex = data['email_ex']
        name_ex = data['name_ex']
        date_ex = data['date_ex']

############# Checking body request ##################
## and providing response based on 'state' and 'remark'##
        if (remark == False) and \
            (state == False):
            return Response({'message': 'No action in updating'},
                                status=status.HTTP_200_OK
                            )
        elif (remark == False) and \
            (state != False):
            if state == 'Executat':
                return Response({'message': 'Failed updating, provide "remark"'}, 
                                    status=status.HTTP_406_NOT_ACCEPTABLE
                                )
            call.state = state
            call.email_ex = email_ex
            call.name_ex = name_ex
            call.date_ex = date_ex
            call.save()
        elif (remark != False) and \
            (state == False):
            call.remark = remark
            call.save()
        elif (remark != False) and \
            (state != False):
            call.remark = remark
            call.state = state
            call.email_ex = email_ex
            call.name_ex = name_ex
            call.date_ex = date_ex
            call.save()

        return Response({'message': 'Successfully updated record'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': e}, status=status.HTTP_400_BAD_REQUEST)
    


# Modifying "Remarka", "Neexecutat"
# class RemarkViewSet(viewsets.ModelViewSet):
#     queryset = Call.objects.all()
#     serializer_class = RemarkSerializer

#     def update(self, request, *args, **kwargs):

#         return super().update(request, *args, **kwargs)


# Search sectors, cities, pts with damages by office
def office_data(request, office):
    output = {
        'status': 'BAD_REQUEST_400'
    }

    if office != 'Oficiul':
        if office != 'Administratie':
            output = Call.objects.all().filter(office=office_abr_up(office)).order_by('id')
        elif office == 'Administratie':
            output = Call.objects.all().order_by('id')

        sectors = []
        cities = []
        pts = []

        for i in list(output.values()):
            sectors.append(i['sector'])
            cities.append(i['city'])
            pts.append(i['pt'])

        sectors = set(sectors)
        cities = set(cities)
        pts = set(pts)

        output = {
            'sectors': list(sectors),
            'cities': list(cities),
            'pts': list(pts),
        }
    else:
        output = ''
    
    output = json.dumps(output)

    return HttpResponse(output)

# Search cities, pts with damages together by office and sector
def sector_data(request, office, sector):
    output = {
        'status': 'BAD_REQUEST_400'
    }

    if office != 'Administratie' and \
        sector != 'Sector':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector)
    elif office != 'Administratie' and \
        sector == 'Sector':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office))
    elif office == 'Administratie' and \
        sector != 'Sector':
        output = Call.objects.all() \
            .filter(sector=sector)
    elif office == 'Administratie' and \
        sector == 'Sector':
        output = Call.objects.all()
        
    cities = []
    pts = []

    for i in list(output.values()):
        cities.append(i['city'])
        pts.append(i['pt'])

    cities = set(cities)
    pts = set(pts)

    output = {
        'cities': list(cities),
        'pts': list(pts),
    }

    output = json.dumps(output)

    return HttpResponse(output)

# ################## PUSH NOTIFICATIONS SECTIONS ############
# @api_view(['GET'])
# def vapid_public_key(request):
#     try:
#         VAPID_PUBLIC_KEY = settings.WEBPUSH_SETTINGS['VAPID_PUBLIC_KEY']
        
#         return Response({'vapid_public_key': VAPID_PUBLIC_KEY}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'Error': e}, status=status.HTTP_400_BAD_REQUEST)

# def send_web_push(subscription_information, push_body):
#     VAPID_PRIVATE_KEY = settings.WEBPUSH_SETTINGS['VAPID_PRIVATE_KEY']
#     VAPID_CLAIMS = settings.WEBPUSH_SETTINGS['VAPID_CLAIMS']

#     print('push_body', push_body)
#     print('type', type(push_body))

#     return webpush(
#         subscription_info=subscription_information,
#         data=push_body,
#         vapid_private_key=VAPID_PRIVATE_KEY,
#         vapid_claims=VAPID_CLAIMS
#     )

# @api_view(['POST'])
# def push_notifications(request):
#     if not request.body:
#         return Response({'Response': 'Failed'}, status=status.HTTP_400_BAD_REQUEST)
    
#     data = json.loads(request.body)

#     try:
#         token = json.loads(data['sub_token'])
#         office = data['office']
#         content = data['content']
#         sender = data['sender']

#         push_data = json.dumps({
#                         'message': f'Oficiul: {office}, {content}',
#                         'sender': sender,
#                     })            

#         send_web_push(token, push_data)
#         return Response({'Response': 'Success'}, status=status.HTTP_201_CREATED)
#     except Exception as e:
#         return Response({'Error': e}, status=status.HTTP_404_NOT_FOUND)


# Search pts with damages by office, sector and city
def city_data(request, office, sector, city):

    output = {
        'status': 'BAD_REQUEST_400'
    }

    if office != 'Administratie' and \
        (sector != 'false' and \
        sector != 'Sector') and \
        city != 'Localitate':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city)
    elif office != 'Administratie' and \
        (sector == 'false' or \
        sector == 'Sector') and \
        city != 'Localitate':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office)) \
            .filter(city=city)
    elif office == 'Administratie' and \
        (sector != 'false' and \
        sector != 'Sector') and \
        city != 'Localitate':
        output = Call.objects.all() \
            .filter(sector=sector) \
            .filter(city=city)
    elif office == 'Administratie' and \
        (sector == 'false' or \
        sector == 'Sector') and \
        city != 'Localitate':
        output = Call.objects.all() \
            .filter(city=city)
    elif office != 'Administratie' and \
        (sector != 'false' and \
        sector != 'Sector') and \
        city == 'Localitate':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector)
    elif office != 'Administratie' and \
        (sector == 'false' or \
        sector == 'Sector') and \
        city == 'Localitate':
        output = Call.objects.all() \
            .filter(office=office_abr_up(office))
    elif office == 'Administratie' and \
        (sector != 'false' and \
        sector != 'Sector') and \
        city == 'Localitate':
        output = Call.objects.all() \
            .filter(sector=sector)
    elif office == 'Administratie' and \
        (sector == 'false' or \
        sector == 'Sector') and \
        city == 'Localitate':
        output = Call.objects.all()

    pts = []

    for i in list(output.values()):
        pts.append(i['pt'])

    pts = set(pts)

    output = {
        'pts': list(pts)
    }

    output = json.dumps(output)

    return HttpResponse(output)

# Search after submit button press
def searched_records(request, office, sector, city, pt, status, stare):
    output = json.dumps({
        'status': 'BAD_REQUEST_400'
    })

    if (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(pt=pt) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(city=city) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(status=status) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(pt=pt) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(pt=pt) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(city=city) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(city=city) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(city=city) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(sector=sector) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(status=status) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .filter(pt=pt) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .filter(city=city) \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare != 'Stare' and \
        stare != 'false'):
        output = Call.objects \
            .exclude(state__contains='Executat') \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status != 'Status' and \
        status != 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(status=status) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt != 'PT' and \
        pt != 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(pt=pt) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city != 'Localitate' and \
        city != 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(city=city) \
            .order_by('id')
    elif (office == 'Administratie' or \
        office == 'false') and \
        (sector != 'Sector' and \
        sector != 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(sector=sector) \
            .order_by('id')
    elif (office != 'Administratie' and \
        office != 'false') and \
        (sector == 'Sector' or \
        sector == 'false') and \
        (city == 'Localitate' or \
        city == 'false') and \
        (pt == 'PT' or \
        pt == 'false') and \
        (status == 'Status' or \
        status == 'false') and \
        (stare == 'Stare' or \
        stare == 'false'):
        output = Call.objects \
            .filter(office=office_abr_up(office)) \
            .order_by('id')
    elif office == 'Administratie':
        output = Call.objects.all()

    if list(output.values()) == []:
        output = {
            'status': 'No record'
        }

    output = json.dumps(list(output.values()))

    return HttpResponse(output)
