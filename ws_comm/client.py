from pi_io_site.models import *
from pi_io import settings
import urllib2, urllib
import json

read_display_cls = ReadDisplay.__subclasses__()
write_display_cls = WriteDisplay.__subclasses__()



def push_config(rpi):
    rpi_read_ifaces = RPIReadInterface.objects.filter(rpi=rpi)
    rpi_write_ifaces = RPIWriteInterface.objects.filter(rpi=rpi)

    read_displays = ReadDisplay.objects.filter(interface__in=rpi_read_ifaces)
    write_displays = WriteDisplay.objects.filter(interface__in=rpi_write_ifaces)

    rpi_requirements = {}
    rpi_requirements['mac'] = rpi.mac_address

    def add_req(displays, type):
        rpi_requirements[type] = []
        for display in displays:
            display_configs = {
                'cls_name':display.interface.name,
                'ch_port':display.channel_port,
                'equation':display.equation
            }
            rpi_requirements[type].append(display_configs)

    add_req(read_displays, 'read')
    add_req(write_displays, 'write')

    requirements = [rpi_requirements]

    post_data = {'json':json.dumps(requirements)}
    post_data = urllib.urlencode(post_data)

    if settings.WS_SERVER_HTTP_SSL:
        proto = 'https'
    else:
        proto = 'http'

    post_addr = '%s://%s:%d' % (proto, settings.WS_SERVER_IP, settings.WS_SERVER_HTTP)

    try:
        url = urllib2.Request(post_addr, post_data)
        url_response = urllib2.urlopen(url)
        resp = url_response.read()
        if resp == 'ok':
            return True
    except:
        pass

    return False



def config_changed_signal(sender, **kwargs):
    # we need to verify that the sender is a subclass of ReadDisplay or WriteDisplay
    if sender in read_display_cls or sender in write_display_cls:
        # send update request for the relevant RPI configs
        rpi = kwargs['instance'].rpi
        if rpi.online:
            push_config(rpi)
