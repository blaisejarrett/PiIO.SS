from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^rpis/$', 'user_api.views.rpi_list'),
)

