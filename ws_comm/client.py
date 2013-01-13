from pi_io_site.models import *

read_display_cls = ReadDisplay.__subclasses__()
write_display_cls = WriteDisplay.__subclasses__()

def config_changed_signal(sender, **kwargs):
    # we need to verify that the sender is a subclass of ReadDisplay or WriteDisplay
    if sender in read_display_cls or sender in write_display_cls:
        # send update request for the relevant RPI configs
        print kwargs['instance'].rpi

