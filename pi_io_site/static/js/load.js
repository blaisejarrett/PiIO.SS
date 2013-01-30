var client;

$(document).ready(function() {
    interface.getAjaxMenu();
    client = new WSClient('ws://192.168.1.207:9000/', false);

    interface.rpi_menu_click = function(context) {
        interface.getAjaxDisplays(context.data.mac, function(){
            client.request_rpi_stream(context.data.mac);
        });
    };

    client.rpiOnlineOffline = function(state) {
        interface.getAjaxMenu();
        switch (state) {
            case 'online':
                interface.notify('A raspberry pi has come online', 'info', 5000);
                break;
            case 'offline':
                interface.notify('A raspberry pi has gone offline', 'info', 5000);
                break;
            case 'default':
                break;
        }
    }

    client.rpi_config_change = function(mac) {
        interface.getAjaxDisplays(mac);
    };

    client.onerror = function() {
        interface.notify('Error with websocket connection, is the server running?', 'error');
    };
});
