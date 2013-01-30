// Display object has to be named lower case of python model class name
// constructor always takes the id
function buttondisplay(id, key) {
    this.domobj = $('#' + id + ' > p > span');
    this.key = key;
    this.button = $('#' + id + ' > button');

    var self = this;
    this.button.click(function(){
        self.click();
    });
}

buttondisplay.prototype.update = function(value) {
    this.domobj.text(value);
    this.current_value = value;
};

buttondisplay.prototype.click = function() {
    alert(this.key);
};