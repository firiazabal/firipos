function Calculator(fieldID, container, type, defaultval, disabled, money) {
  this.id = fieldID;
  this.parent = $(container);
  this.fieldType = ((type==null)?'text':type);
  this.fieldDefault = ((defaultval==null)?'':defaultval);
  this.fieldDisabled = ((disabled==null)?'':'disabled');
  this.moneyId = money;

  this.build = function() {
    var html = '';
    //html += '<div class="container-fluid">';
    html += '  <div class="row">';
    if (this.moneyId && this.moneyId.length > 0) {
      html += '    <div class="col-xs-2">';
      html += '      <button type="button" class="btn btn-primary btn-lg btn-block btn-calc-money" style="height: auto;" data-target="' + this.moneyId + '" data-type="money" data-id="' + this.id + '"><i class="fa fa-money"></i></button>';
      html += '    </div>';
      html += '    <div class="col-xs-8">';
    } else
      html += '    <div class="col-xs-10">';
    html += '      <input type="' + this.fieldType + '" id="' + this.id + '" name="' + this.id + '" class="form-control input-lg' + ((this.fieldType=='password')?'':' text-right') + '" style="width: 100%;" ' + this.fieldDisabled + ' value="' + this.fieldDefault + '" />';
    html += '    </div>';
    html += '    <div class="col-xs-2">';
    html += '      <button type="button" class="btn btn-default btn-lg btn-block btn-calc" style="height: auto;" data-target="' + this.id + '" data-money="' + this.moneyId + '" data-id="cc"><i class="fa fa-chevron-left"></i></button>';
    html += '    </div>';
    html += '  </div>';
    
    html += '  <div class="row text-center">';
    var row = 0;
    for (var i = 0; i < 12; i++) {
      row++;
      if (row > 3) {
        html += '  </div>';
        html += '  <div class="row">';
        row = 1;
      }
      html += '    <div class="col-xs-4">';
      var myval = '';
      if (i == 9)
        myval = '0';
      else if (i == 10)
        myval = '.';
      else if (i == 11)
        myval = 'ce';
      else
        myval = i + 1;
      html += '      <button type="button" class="btn btn-' + ((myval=='ce')?'danger':'default') + ' btn-lg btn-calc btn-block" data-target="' + this.id + '" data-id="' + myval + '" data-money="' + this.moneyId + '">' + String(myval).toUpperCase() + '</button>';
      html += '    </div>';
    }
    html += '  </div>';
    //html += '</div><!-- /.container-fluid -->';
    this.parent.html(html);
    var that = this;
    $(this.parent).find('.btn-calc').on('click', that.doOnClick);
    $(this.parent).find('.btn-calc-money').on('click', that.doOnClickMoney);
  };

  this.doOnClickMoney = function() {
    var id = $(this).data('id');
    var money = $(this).data('target');
    var fieldType = $('#' + id).attr('type');
    var moneyField = null;
    if (money != null && money.length > 0) {
      moneyField = $('#qty_' + money);
      if (!moneyField || !moneyField.is(":visible"))
        moneyField = null;
    }

    if (fieldType == 'password') {
      if (moneyField) moneyField.val('');
      $('#' + id).val('');
    } else {
      if (moneyField) moneyField.val('0');
      $('#' + id).val('0');
    }

    if (moneyField) {
      $('#' + money).hide();
    } else {
      $('#' + money).show();
    }
  }

  this.doOnClick = function() {
    var value = $(this).data('id');
    var id = $(this).data('target');
    var fieldType = $('#' + id).attr('type');
    var money = $(this).data('money');
    var moneyField = null;
    if (money != null && money.length > 0) {
      moneyField = $('#qty_' + money);
      if (!moneyField || !moneyField.is(":visible"))
        moneyField = null;
    }
    
    var actual = $('#' + id).val();
    if (moneyField) actual = moneyField.val();
    if (fieldType == 'password') {
      if (value == 'ce') {
        $('#' + id).val('');
        if (moneyField) {
          moneyField.val('');
          $('#' + money + ' .money-field').val('0');
          $('#' + money + ' .money-inp').val('0');
        }
      } else if (value == 'cc') {
        if (actual != null && actual.length > 0) {
          actual = actual.substring(0, actual.length - 1);
        } else actual = '';
        if (moneyField) moneyField.val(actual);
        else $('#' + id).val(actual);
      } else {
        if (moneyField) moneyField.val(actual + value);
        else $('#' + id).val(actual + value);
      }
    } else {
      if (value == 'ce') {
        $('#' + id).val('0');
        if (moneyField) {
          moneyField.val('0');
          $('#' + money + ' .money-field').val('0');
          $('#' + money + ' .money-inp').val('0');
        }
      } else if (value == 'cc') {
        if (actual != null && actual.length > 0 && actual != '0') {
          actual = actual.substring(0, actual.length - 1);
        } else actual = '0';
        if (actual == null || actual.length == 0) actual = '0';
        if (moneyField) moneyField.val(actual);
        else $('#' + id).val(actual);
      } else if (value == '.') {
        if (!moneyField) $('#' + id).val(((actual.indexOf(value) != -1)?actual:actual + value));
      } else {
        if (moneyField) moneyField.val(((actual == '0')?'':actual) + value);
        else $('#' + id).val(((actual == '0')?'':actual) + value);
      }
    }
  };

  this.build();
}