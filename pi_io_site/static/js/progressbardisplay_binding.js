// Display object has to be named lower case of python model class name
// constructor always takes the id
function progressbardisplay(id, key, wsclient) {
    this.domobj = $('#' + id + ' > div.progress > div.custombar');
}

progressbardisplay.prototype.update = function(value) {
    this.domobj.css('width', parseFloat(value) + '%');
};