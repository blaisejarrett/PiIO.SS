var client;

$(document).ready(function() {
    getAjaxMenu();
    client = new WSClient('ws://localhost:9000/', true);

    client.rpiOnlineOffline = function(state) {
        getAjaxMenu();
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

    client.onerror = function() {
        interface.notify('Error with websocket connection, is the server running?', 'error');
    };
});
