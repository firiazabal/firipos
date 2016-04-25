function Clock(obj) {
  this.el = $(obj);
  this.timeoutID = null;

  this.pad = function(item) {
    return ((item < 10) ?"0" + item:item);
  }

  this.start = function() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // format numbers to 00
    m = this.pad(m);
    s = this.pad(s);
    this.el.text(h + ":" + m + ":" + s);
    var that = this;
    this.timeoutID = setTimeout(function () {that.start();}, 500);
  }
}
