function Interface() {

}

Interface.prototype.notify = function(message, type, timeout) {
    var cls_type;
    switch (type) {
        case 'error':
            cls_type = 'alert-error';
            break;
        case 'success':
            cls_type = 'alert-success';
            break;
        case 'info':
            cls_type = 'alert-info';
            break;
        default:
            cls_type = 'alert-error';
            break;
    }

    var html = '<div class="alert fade in ' + cls_type + '">';
    html += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    html += message;
    html += '</div>';
    var newmsg = $(html);
    //$('.messagecontainer > .alert').alert('close');
    $('.messagecontainer').empty();
    $('.messagecontainer').append(newmsg);

    if (timeout) {
        setTimeout(function(){
            $('.messagecontainer > .alert').alert('close');
        }, timeout);
    }
};