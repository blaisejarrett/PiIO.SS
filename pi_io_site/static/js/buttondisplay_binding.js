// Display object has to be named lower case of python model class name
// constructor always takes the id
function buttondisplay(id, key, wsclient) {
    console.log(wsclient);
    this.wsclient = wsclient;
    this.domobj = $('#' + id + ' > p > span');
    this.key = key;
    this.button = $('#' + id + ' > button');

    var self = this;
    this.button.click(function(){
        self.click();
    });
}

buttondisplay.prototype.update = function(value) {
    // For write displays value is a dict with two keys
    // calculated
    // real
    var text = (value.calculated) ? 'On' : 'Off';
    this.domobj.text(text);
    this.current_value = value;
};

buttondisplay.prototype.click = function() {
    // send the opposite of the current value
    if (this.wsclient)
        this.wsclient.send_write_data(this.key, !this.current_value.real);
};