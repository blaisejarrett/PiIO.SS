from django.http import HttpResponse
from django.template import RequestContext, loader
from models import RaspberryPi

def home(request):
    pis = RaspberryPi.objects.all()

    t = loader.get_template('base.html')
    c = RequestContext(request, {
        'RaspberryPis': pis,
        })
    return HttpResponse(t.render(c))
