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

    // callback for errors
    this.onerror = undefined;
    // callback for state change
    this.rpiOnlineOffline = undefined;
    // callback for config change
    this.rpi_config_change = undefined;

    this.clientcmds = {
        'CONNECT_RPI':'rpi_connect'
    };
    this.servercmds = {
        'RPI_STATE_CHANGE':'rpi_schange',
        'WRITE_DATA':'write_data'
    };
}

WSClient.prototype.ws_onmessage = function(msg) {
    var parsedMsg = jQuery.parseJSON(msg.data);
    if (this.debug)
        console.log(parsedMsg);

    switch (parsedMsg.cmd) {
        case this.servercmds.RPI_STATE_CHANGE:
            // for now i don't care, just refresh menu
            if (this.rpiOnlineOffline) this.rpiOnlineOffline(parsedMsg.rpi_state);
            // do a new ajax refresh of the displays
            if (this.bound_rpi_mac == parsedMsg.rpi_mac) {
                if (this.rpi_config_change) this.rpi_config_change(parsedMsg.rpi_mac);
            }
            break;
        case this.servercmds.WRITE_DATA:
            for (var key in parsedMsg.data) {
                if (data_bindings && key in data_bindings) {

                    for (var type in data_bindings[key]) {
                        if (data_bindings[key][type].instances) {
                            for (var index in data_bindings[key][type].instances) {
                                data_bindings[key][type].instances[index].update(parsedMsg.data[key]);
                            }
                        }
                    }
                }
            }
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

WSClient.prototype.request_rpi_stream = function(rpi_mac) {
    msg = {
        'cmd':this.clientcmds.CONNECT_RPI,
        'rpi_mac':rpi_mac
    };
    this.ws.send(JSON.stringify(msg));
    this.bound_rpi_mac = rpi_mac;
};