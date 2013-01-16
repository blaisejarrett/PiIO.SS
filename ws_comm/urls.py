from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^register/$', 'ws_comm.views.register'),
    url(r'^disconnect/$', 'ws_comm.views.disconnect'),
)

