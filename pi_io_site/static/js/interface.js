function Interface() {
    this.rpi_menu_click = undefined;
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
    var self = this;
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
                self.rpiClicked(context)
                e.preventDefault();
            });
        })(i, li, data, self);
        li_lst.push(li);
    }

    dropdownul.append(li_lst);
    return li_lst;
};

Interface.prototype.rpiClicked = function(context) {
    // context is {'domli':li, 'data':data[i]}
    if (this.rpi_menu_click) this.rpi_menu_click(context);
}

Interface.prototype.getAjaxMenu = function() {
    var self = this;
    $.getJSON('/user_api/rpis/', function(data){
        self.menu = self.createRpiList(data);
    });
};

Interface.prototype.getAjaxDisplays = function(rpi_mac) {
    var self = this;
    $.get('/displays/' + encodeURIComponent(rpi_mac),
        function(data) {
            $('#displays_container').html(data);

            // construct object instances for data binds
            if (data_bindings) {
                for (var key in data_bindings) {
                    data_bindings[key].instances = [];

                    if (data_bindings[key].type in window) {
                        var ref = window[data_bindings[key].type];

                        for (var id_index in data_bindings[key].ids) {
                            data_bindings[key].instances.push(new ref(data_bindings[key].ids[id_index]));
                        }
                    }
                }
            }
        }
    );
};


var interface = new Interface();
