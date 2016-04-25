function Modal() {
  this.modal = function(containerID, title, content, type, closeable, buttons, size, istable, extra_header) {
    var modal_type = '';
    if (!istable || istable == null)
      istable = false;

    if (type && type != null) {
      if (type.toUpperCase() == 'WARNING' ) {
        modal_type = ' modal-warning';
        size = 'sm';
      } else if (type.toUpperCase() == 'INFO' ) {
        modal_type = ' modal-info';
        size = 'sm';
      } else if (type.toUpperCase() == 'ERROR' ) {
        modal_type = ' modal-danger';
        size = 'sm';
      } else if (type.toUpperCase() == 'CONFIRM' ) {
        modal_type = ' modal-primary';
        size = 'sm';
      } else if (type.toUpperCase() == 'CONFIRM_DANGER' ) {
        modal_type = ' modal-danger';
        size = 'sm';
      }
    }
    if (!size || size == null)
      size = 'full';
    if (closeable == null)
      closeable = true;

    var html = '<div class="modal' + modal_type + ' fade';
    if (size == 'sm')
      html += ' bs-example-modal-sm';
    else if (size == 'sm-full')
      html += ' bs-example-modal-sm modal-full';
    else if (size == 'lg')
      html += ' bs-example-modal-lg';
    else if (size == 'full') {
      html += ' bs-example-modal-lg modal-full';
    }
    html += '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" id="' + containerID + '">';
    html += '  <div class="modal-dialog';
    if (size == 'sm')
      html += ' modal-sm';
    else if (size == 'lg' || size == 'full')
      html += ' modal-lg';
    html += '">';
    html += '    <div class="modal-content">';
    html += '      <form name="modal-form" action="" method="post" class="form-horizontal">';
    if ((title != null && title.length > 0) || (extra_header && extra_header != null && extra_header.length > 0)) {
      html += '        <div class="modal-header">';
      if (closeable)
        html += '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
      if (title != null && title.length > 0)
        html += '          <h3 class="modal-title text-blue">' + title + '</h3>';
      if (extra_header && extra_header != null && extra_header.length > 0)
        html += extra_header;
      html += '        </div>';
    }
    html += '        <div class="modal-body' + (istable?' table-responsive no-padding sales':'') + '">';
    html += '          ' + content;
    html += '        </div>';
    if (type.toUpperCase() == 'WARNING' || type.toUpperCase() == 'INFO' || type.toUpperCase() == 'ERROR' || type.toUpperCase() == 'CONFIRM' || type.toUpperCase() == 'CONFIRM_DANGER' || (buttons != null && buttons.length > 0)) {
      html += '        <div class="modal-footer" style="text-align: center !important;">';
      if (type.toUpperCase() == 'WARNING' || type.toUpperCase() == 'INFO' || type.toUpperCase() == 'ERROR' ) {
        html += '          <button type="button" class="btn btn-primary btn-lg" data-dismiss="modal">OK</button>';
      } else if (type.toUpperCase() == 'CONFIRM' || type.toUpperCase() == 'CONFIRM_DANGER') {
        html += '          <button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">Cancelar</button>';
        html += '          <button type="submit" class="btn ' + ((type.toUpperCase() == 'CONFIRM_DANGER')?'btn-primary':'btn-success') + ' btn-lg pull-right" id="btn' + containerID + 'OK">Aceptar</button>';
      } else {
        var total = buttons.length;
        for (var i = 0; i < total; i++) {
          html += '          ' + buttons[i];
        }
        /*html += '          <button type="button" class="btn btn-warning btn-lg product-bom-back pull-left">Anterior</button>';
        html += '          <button type="submit" class="btn btn-primary btn-lg product-bom-finalize">Finalizar</button>';*/
      }
      html += '        </div>';
    }
    html += '      </form>';
    html += '    </div><!-- /.modal-content -->';
    html += '  </div><!-- /.modal-dialog -->';
    html += '</div>';

    $(document.body).append($(html));
    if (size == 'full') {
      fixModalFullWindows();
    }
  };

  this.alert = function(id, title, message) {
    this.modal(id, title, message, "WARNING", true, null);
  };

  this.info = function(id, title, message) {
    this.modal(id, title, message, "INFO", true, null);
  };

  this.error = function(id, title, message) {
    this.modal(id, title, message, "ERROR", true, null);
  };

  this.confirm = function(id, title, message) {
    this.modal(id, title, message, "CONFIRM", true, null);
  };

  this.confirmDanger = function(id, title, message) {
    this.modal(id, title, message, "CONFIRM_DANGER", true, null);
  };

  this.general_sm = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'sm', false, extra_header);
  };

  this.general_sm_full = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'sm-full', false, extra_header);
  };

  this.general_lg = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'lg', false, extra_header);
  };

  this.general_full = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'full', false, extra_header);
  };

  this.general_sm_table = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'sm', true, extra_header);
  };

  this.general_sm_full_table = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'sm-full', true, extra_header);
  };

  this.general_full_table = function(id, title, message, closeable, buttons, extra_header) {
    this.modal(id, title, message, "GENERAL", closeable, buttons, 'full', true, extra_header);
  };

  this.kit = function(id, title, message) {
    this.modal(id, title, message, "GENERAL", true, ['<button type="button" class="btn btn-warning btn-lg product-bom-back pull-left">Anterior</button>', '<button type="submit" class="btn btn-primary btn-lg product-bom-finalize pull-right">Finalizar</button>'], 'full');
  };

}

var modalWindow = new Modal();