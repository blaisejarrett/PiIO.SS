// Display object has to be named lower case of python model class name
// constructor always takes the id
function numericdisplay(id, key, wsclient) {
    this.domobj = $('#' + id + ' > p > span');
}

numericdisplay.prototype.update = function(value) {
    this.domobj.text(value);
};