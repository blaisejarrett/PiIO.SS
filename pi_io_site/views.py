from django.http import HttpResponse
from django.template import Context, loader
from models import *
import json

def create_id(counter):
    #return '%s, port:%d, eq:%s' % (db_instance.interface.name, db_instance.channel_port, db_instance.equation)
    return 'i_binding_%d' % (counter,)

def rpi_displays(request, rpi_mac):
    read_display_cls = ReadDisplay.__subclasses__()
    write_display_cls = WriteDisplay.__subclasses__()

    rpi = RaspberryPi.objects.get(pk=rpi_mac)

    rpi_read_ifaces = RPIReadInterface.objects.filter(rpi=rpi)
    rpi_write_ifaces = RPIWriteInterface.objects.filter(rpi=rpi)

    counter = 0

    def get_display_instances(display_cls_lst, display_iface, counter):
        lst_of_cls = []
        for display_cls in display_cls_lst:
            db_instances = display_cls.objects.filter(interface__in=display_iface)
            modified_db_instances = []
            for db_instance in db_instances:
                counter += 1
                modified_db_instances.append({'db':db_instance, 'id':create_id(counter)})
            lst_of_cls.append({'cls':display_cls, 'cls_name':display_cls.__name__, 'instances':modified_db_instances})
        return (lst_of_cls, counter)

    read_displays, counter = get_display_instances(read_display_cls, rpi_read_ifaces, counter)
    write_displays, counter = get_display_instances(write_display_cls, rpi_write_ifaces, counter)

    read_and_write_displays = read_displays + write_displays

    #{'ADC, port:3, eq:whatever':{'id':'1', 'type_fnc':''},}
    data_bindings_json = {}
    for display in read_and_write_displays:
        for instance in display['instances']:
            key = '%s, port:%d, eq:%s' % (instance['db'].interface.name,
                                          instance['db'].channel_port,
                                          instance['db'].equation)
            if key not in data_bindings_json:
                data_bindings_json[key] = {'ids':[instance['id']], 'type':display['cls_name'].lower()}
            else:
                data_bindings_json[key]['ids'].append(instance['id'])

    t = loader.get_template('displays.html')
    c = Context({
        'displays':read_and_write_displays,
        'rpi':rpi,
        'data_bindings_json':json.dumps(data_bindings_json),
    })

    return HttpResponse(t.render(c))

def home(request):
    t = loader.get_template('base.html')
    c = Context({
    })
    return HttpResponse(t.render(c))
