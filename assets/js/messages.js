var notificationID_count = 0;

function Notification() {

  this.Message = function(_title, _message) {
    return chrome.notifications.create('firipos_' + notificationID_count++, {
      type: "basic",
      title: _title,
      message: _message,
      iconUrl: "icon-128.png"
    });
  };

  this.alert = function(text) {
    $('#modal-generic-alert .modal-body').html(text);
    $('#modal-generic-alert').modal('show');
  };
}

var messages = new Notification();