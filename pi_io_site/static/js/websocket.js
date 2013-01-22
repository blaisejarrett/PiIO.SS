function WSClient(url, debug) {
    var self = this;
    this.debug = Boolean(debug);
    this.ws = new WebSocket(url);
    this.ws.onopen = function() {
        self.ws_onopen();
    };
    this.ws.onclose = function() {
        self.ws_onclose();
    };
    this.ws.onmessage = function(msg) {
        self.ws_onmessage(msg);
    };
    this.ws.onerror = function(error) {
        self.ws_onerror(error);
    };

    this.onerror = undefined;
    this.rpiOnlineOffline = undefined;
}

WSClient.prototype.ws_onmessage = function(msg) {
    var parsedMsg = jQuery.parseJSON(msg.data);
    if (this.debug)
        console.log(parsedMsg);

    switch (parsedMsg.cmd) {
        case 'rpi_schange':
            // for now i don't care, just refresh menu
            if (this.rpiOnlineOffline) this.rpiOnlineOffline(parsedMsg.rpi_state);
            break;
        default:
            break;
    }
};

WSClient.prototype.ws_onopen = function() {
    if (this.debug) {
        console.log('WS connected');
    }

    // request connected RPI list
};

WSClient.prototype.ws_onclose = function() {
    if (this.debug) {
        console.log('WS closed');
    }
};

WSClient.prototype.ws_onerror = function(error) {
    if (this.debug) {
        console.log('Error ' + error);
    }

    if (this.onerror) this.onerror();
};