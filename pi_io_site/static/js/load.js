var client;
var interface;

$(document).ready(function() {
    interface = new Interface();
    client = new WSClient('wss://localhost:9000/', true);

    client.onerror = function() {
        interface.notify('Error with websocket connection, is the server running?', 'error');
    };
});
