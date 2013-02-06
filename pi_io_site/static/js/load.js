var client;

$(document).ready(function() {
    interface.getAjaxMenu();
    client = new WSClient('ws://' + window.location.hostname + ':9000/', false);
    // the interface needs to be aware of the ws client to delegate data write requests
    interface.wsclient = client;

    interface.rpi_menu_click = function(context) {
        client.unregister_rpi();
        interface.getAjaxDisplays(context.data.mac, function(){
            client.request_rpi_stream(context.data.mac);
        });
    };

    client.e_rpi_online = function(rpi_mac) {
        interface.getAjaxMenu();
        interface.notify('A raspberry pi has come online', 'success', 5000);
    };

    client.e_rpi_offline = function(rpi_mac) {
        interface.getAjaxMenu();
        interface.notify('A raspberry pi has gone offline', 'error', 5000);
        // our RPI went offline, cleanup
        if (client.bound_rpi_mac && client.bound_rpi_mac == rpi_mac)
        {
            interface.getAjaxDisplays(rpi_mac, function() {

            });
        }
    };

    client.e_rpi_drop_stream = function(rpi_mac) {
        if (client.bound_rpi_mac && client.bound_rpi_mac == rpi_mac)
        {
            interface.notify('The raspberry pi has been reconfigured', 'info', 5000);
        }
    };

    client.e_rpi_stream = function(rpi_mac) {
        if (client.bound_rpi_mac && client.bound_rpi_mac == rpi_mac)
        {
            interface.getAjaxDisplays(rpi_mac, function() {
                client.request_rpi_stream(rpi_mac);
            });
        }
    };

    client.onerror = function() {
        interface.notify('Error with websocket connection, is the server running?', 'error');
    };
});
