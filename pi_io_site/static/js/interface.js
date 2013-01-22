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

Interface.prototype.createRpiList = function(data) {
    var dropdownul = $('.nav > .dropdown > ul.dropdown-menu');
    dropdownul.empty();

    var li;
    var li_lst = [];
    if (data.length == 0)
    {
        li = $('<li><a href="#" class="offline_pi">No RPIs</a></li>');
        li_lst.push(li);
        dropdownul.append(li_lst);
        return null
    }

    for (var i in data) {
        li = $('<li><a href="#">' + data[i]['name'] + '</a></li>');
        if (!data[i]['online'])
            $(li).find('a').addClass('offline_pi');
        (function(i, li, data){
            $(li).find('a').click(function(e) {
                var context = {'domli':li, 'data':data[i]};
                if (data[i]['click']) {
                    data[i]['click'].call(context);
                }
                e.preventDefault();
            });
        })(i, li, data);
        li_lst.push(li);
    }

    dropdownul.append(li_lst);
    return li_lst;
};

var interface = new Interface();

function rpiClicked() {
    // context is {'domli':li, 'data':data[i]}
    // if its offline, ignore it
    if (this.data.online)
    {

    }
}

function getAjaxMenu(){
    $.getJSON('/user_api/rpis/', function(data){
        for (var i in data) {
            data[i]['click'] = rpiClicked;
        }
        interface.menu = interface.createRpiList(data);
    });
}

