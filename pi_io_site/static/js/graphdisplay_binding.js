// Display object has to be named lower case of python model class name
// constructor always takes the id
function graphdisplay(id, key, wsclient) {
    this.domobj = $('#' + id + ' > div');
    this.data_counter = 0;
    // buffer stored in ms
    this.time_len = 10000;
    this.update_interval = 40;
    this.data = [];
    this.data_len = parseInt(this.time_len / this.update_interval);
    this.last_data_point = 0;

    this.no_data = true;

    this.stop_timer = false;

    var options = {
        series: { shadowSize: 0 }, // drawing is faster without shadows
        //yaxis: { min: 0, max: 100 },
        xaxis: {
            mode: 'time',
            timeformat: '%M:%S'
        },
        colors: ['#049cdb']
    };
    this.plot = $.plot(this.domobj, [], options);
}

graphdisplay.prototype.timer = function() {
    if (this.stop_timer)
    {
        clearInterval(this.interval);
        return;
    }

    var t = Date.now();

    if (this.data.length >= this.data_len)
        this.data = this.data.slice(1);

    this.data.push([t, this.last_data_point]);
    this.plot.setData([this.data]);
    this.plot.setupGrid();
    this.plot.draw();
};

graphdisplay.prototype.update = function(value) {
    this.last_data_point = value;
    var self = this;

    if (this.no_data) {
        this.no_data = false;
        this.timer();
        this.interval = setInterval(function(){
            self.timer();
        }, this.update_interval);
    }
};

graphdisplay.prototype.close = function() {
    // this doesn't seem to work...
    // function is called but Flot later throws an exception
    this.stop_timer = true;
    this.plot.shutdown();
};