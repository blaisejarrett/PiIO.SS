from django.http import HttpResponse
from pi_io_site.models import *
import json

def rpi_list(request):
    rpis = RaspberryPi.objects.all().order_by('-online')

    rpis_json = []
    for rpi in rpis:
        obj_d = {'mac':rpi.mac_address, 'online':rpi.online, 'name':rpi.name}
        rpis_json.append(obj_d)

    return HttpResponse(json.dumps(rpis_json), mimetype='application/json')