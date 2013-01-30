// Display object has to be named lower case of python model class name
// constructor always takes the id
function graphdisplay(id, key) {
    this.domobj = $('#' + id + ' > div');
    this.data_counter = 0;
    this.data_len = 300;
    this.data = [];

    var options = {
        series: { shadowSize: 0 }, // drawing is faster without shadows
        //yaxis: { min: 0, max: 100 },
        xaxis: { show: false }
    };
    this.plot = $.plot(this.domobj, [], options);
}

graphdisplay.prototype.update_buffer = function(value) {
    if (this.data.length >= this.data_len)
        this.data = this.data.slice(1);

    this.data.push([this.data_counter++, value]);
};

graphdisplay.prototype.update = function(value) {
    this.update_buffer(value);
    this.plot.setData([this.data]);
    this.plot.setupGrid();
    this.plot.draw();
};