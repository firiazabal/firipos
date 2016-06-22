var gUserID = '';
var gUserName=chrome.i18n.getMessage("user_unknown");
var gUserPassword = '';
var gHostIP = '';
var gTerminalID = '';
var gLogo = '';
var gLogoName = '';
var gLogoMime = '';
var gDirectPrint = false;
var gSkin = 'skin-red';
var gCurrency = '&euro;';
var gCurrencyPos = 1; //0-Before, 1-After
var gLockedStore = 0;
var gWaitForSaleHeader = false;

var gSelectedCategory = null;
var gItemWidth = null;
var gItemHeight = null;
var gLines = new Array();
var gLinesId = new Array();
var gTotalLines = 0.00;
var gTotalPaid = 0.00;
var gSelectedRow = null;
var gDefaultCategory = null;
var gDefaultPayment = null;
var gSelectedPayment = null;

var gProductsBom = new Array();
var gProductsBomSection = 0;
var gProductsBomID = null;

var gSelectedUpdateProductField = 'qty';
var gChangePriceGranted = false;
var gChangeDiscountGranted = false;
var gCashGranted = false;
var gRerportGranted = false;

var gOperations = new Array();

var gCashID = null;
var gCashTotal = 0;

var settingslogoImg = null;
var settingslogoMime = null;

var gProductsCols = 4; //Default 4
var gProductsRows = 4; //Default 4

$(document).ready(function(){
  buildModalWindows();
  loadStoredInfo();
  fixItemsInWindow(); //Rearrange all boxes in the window to fit to the window size
  //Center Modal windows on screen
  $(modalVerticalCenterClass).on('shown.bs.modal', function(e) {
    centerModals($(this));
  });
  buildExtraControls();
  translation_html_labels();
  bindButtons();

  checkSettings();


  $('#modal-settings').on('shown.bs.modal', function (event) {
    store.get('settings_key', function(val){
      if (!val || val == null || val == '') $('#terminal_id').val('');
      else $('#terminal_id').val(val);
    });
    store.get('settings_host', function(val){
      if (!val || val == null || val == '') $('#host_ip').val('');
      else $('#host_ip').val(val);
    });
    store.get('settings_printer', function(val){
      if (!val || val == null || val == '') $('#printer').val('');
      else $('#printer').val(val);
    });
    store.get('settings_skin', function(val){
      if (!val || val == null || val == '') $('#skin').val('skin-red');
      else $('#skin').val(val);
    });
    store.get('settings_logo', function(val){
      if (!val || val == null || val == '') $('#logo_src').val('');
      else $('#logo_src').val(val);
    });
    store.get('settings_direct_print', function(val){
      if (!val || val == null || val == '') {
        $('#direct_print').prop('checked', false);
        $('#direct_print').bootstrapSwitch('state', false);
      } else {
        $('#direct_print').prop('checked', (val == '1'));
        $('#direct_print').bootstrapSwitch('state', (val == '1'));
      }
    });
    store.get('settings_products_rows', function(val){
      if (!val || val == null || val == '') $('#products_rows').val('4');
      else $('#products_rows').val(val);
    });
    store.get('settings_products_cols', function(val){
      if (!val || val == null || val == '') $('#products_cols').val('4');
      else $('#products_cols').val(val);
    });
    $('#terminal_id').focus();
  });

  if (!store.enabled) {
    messages.Message(chrome.i18n.getMessage("alert_store_disabled_title"), chrome.i18n.getMessage("alert_store_disabled_text"));
  }

  loadUSBPrinters();
  loadBaseInfo();

});

$(window).on('resize', function() {
  fixItemsInWindow(); //Rearrange all boxes in the window to fit to the window size
  //Center Modal windows on screen
  $(modalVerticalCenterClass).on('shown.bs.modal', function(e) {
    centerModals($(this));
  });
});

function buildModalWindows() {
  modalWindow.alert('modal-generic-alert', null, '');
  modalWindow.confirm('modal-alert', null, chrome.i18n.getMessage("mdl_exit"));
  modalWindow.confirm('modal-confirm-reopen', null, chrome.i18n.getMessage("mdl_reopen"));
  modalWindow.confirmDanger('modal-alert-delete', null, chrome.i18n.getMessage("mdl_delete_sale"));
  modalWindow.general_sm('modal-login', 'Login', '<input type="hidden" name="userLoginIdLogin" id="userLoginIdLogin" value=""/><div class="container-fluid sales-grid" id="calculator-password"></div>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-primary btn-lg pull-right" id="btnLogin">' + chrome.i18n.getMessage("mdl_btn_login") + '</button>']);
  modalWindow.general_full('modal-users', chrome.i18n.getMessage("mdl_users"), '<div class="container-fluid sales"><div class="col-sm-4 sales-grid"><h4 class="modal-title" id="usernameUsers">' + chrome.i18n.getMessage("mdl_select_user") + '</h4>' + 
          '<div class="container-fluid" id="calculator-login">' + 
          '</div>' + 
          '<br/>' + 
          '<input type="hidden" name="userLoginId" id="userLoginId"/>' + 
          '<button type="submit" class="btn btn-primary btn-lg" disabled id="btnLoginUsers">' + chrome.i18n.getMessage("mdl_btn_login") + '</button>' + 
          '</div>' + 
          '<div class="col-sm-8 text-uppercase" id="users-icons">' + 
          chrome.i18n.getMessage("mdl_users") + 
          '</div></div>', true, null);
  modalWindow.general_full('modal-settings', chrome.i18n.getMessage("mdl_settings_title"), '<div class="container-fluid sales-grid"><div class="col-xs-12">' + 
          '<div class="form-group">' + 
          '  <label for="terminal_id" class="required">' + chrome.i18n.getMessage("mdl_settings_terminal_id") + '</label>' + 
          '  <input type="text" name="terminal_id" id="terminal_id" class="form-control"/>' + 
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="host_ip" class="required">' + chrome.i18n.getMessage("mdl_settings_host") + '</label>' + 
          '  <input type="ip" name="host_ip" id="host_ip" class="form-control"/>' + 
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="skin" class="required">' + chrome.i18n.getMessage("mdl_settings_skin") + '</label>' + 
          '  <select name="skin" id="skin" class="form-control select2">' + 
          '    <option value="skin-yellow">' + chrome.i18n.getMessage("mdl_settings_yellow") + '</option>' + 
          '    <option value="skin-blue">' + chrome.i18n.getMessage("mdl_settings_blue") + '</option>' + 
          //'    <option value="skin-black">Negro</option>' + 
          '    <option value="skin-red">' + chrome.i18n.getMessage("mdl_settings_red") + '</option>' + 
          '    <option value="skin-green">' + chrome.i18n.getMessage("mdl_settings_green") + '</option>' + 
          '    <option value="skin-purple">' + chrome.i18n.getMessage("mdl_settings_purple") + '</option>' + 
          '  </select>' + 
          '</div>' + 
          '<div class="form-group">' +
          '  <label class="label-control" for="direct_print"> <span id="i18nDirectPrint">' + chrome.i18n.getMessage("mdl_settings_direct_print") + '</span> <input type="checkbox" value="1" name="direct_print" id="direct_print"/></label>' +
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="logo_src">' + chrome.i18n.getMessage("mdl_settings_logo") + '</label>' + 
          '  <div class="form-inline">' + 
          '    <div class="input-group" style="width: 100%;">' + 
          '      <input type="text" name="logo_src" id="logo_src" class="form-control disabled" disabled/> <div class="input-group-addon" style="padding: 0px !important;"><button id="btnSelectLogo" class="btn btn-block"><i class="fa  fa-folder-open"></i></button></div>' + 
          '    </div>' + 
          '  </div>' + 
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="skin" class="required">' + chrome.i18n.getMessage("mdl_settings_products_rows") + '</label>' + 
          '  <select name="products_rows" id="products_rows" class="form-control select2">' + 
          '    <option value="1">1</option>' + 
          '    <option value="2">2</option>' + 
          '    <option value="3">3</option>' + 
          '    <option value="4">4</option>' + 
          '    <option value="6">6</option>' + 
          '  </select>' + 
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="skin" class="required">' + chrome.i18n.getMessage("mdl_settings_products_cols") + '</label>' + 
          '  <select name="products_cols" id="products_cols" class="form-control select2">' + 
          '    <option value="1">1</option>' + 
          '    <option value="2">2</option>' + 
          '    <option value="3">3</option>' + 
          '    <option value="4">4</option>' + 
          '    <option value="6">6</option>' + 
          '  </select>' + 
          '</div>' + 
          '<div class="form-group">' + 
          '  <label for="printer" class="required">' + chrome.i18n.getMessage("mdl_settings_printer") + '</label>' + 
          '  <select name="printer" id="printer" class="form-control select2">' + 
          '    <option value="">' + chrome.i18n.getMessage("mdl_settings_default_printer_text") + '</option>' + 
          '  </select>' + 
          '</div>' + 
        '</div></div>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-success btn-lg pull-right" id="btnSettingsSave">' + chrome.i18n.getMessage("mdl_btn_save") + '</button>']);
  modalWindow.general_full_table('modal-archived', chrome.i18n.getMessage("mdl_opened_sales_title"), '<table class="table table-bordered">' + 
          '<thead>' + 
          '  <tr>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_opened_sales_documentno") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_opened_sales_time") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_opened_sales_employee") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_opened_sales_customer") + '</th>' + 
          '    <th class="text-right">' + chrome.i18n.getMessage("mdl_opened_sales_lines") + '</th>' + 
          '    <th class="text-right">' + chrome.i18n.getMessage("mdl_opened_sales_total") + '</th>' + 
          '  </tr>' + 
          '</thead>' + 
          '<tbody id="archived-lines">' + 
          '</tbody>' + 
        '</table>', true, null);
  modalWindow.general_full_table('modal-completed', '', '<table class="table table-bordered">' + 
          '<thead>' + 
          '  <tr>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_completed_sales_documentno") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_completed_sales_time") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_completed_sales_employee") + '</th>' + 
          '    <th>' + chrome.i18n.getMessage("mdl_completed_sales_customer") + '</th>' + 
          '    <th class="text-right">' + chrome.i18n.getMessage("mdl_completed_sales_lines") + '</th>' + 
          '    <th class="text-right">' + chrome.i18n.getMessage("mdl_completed_sales_total") + '</th>' + 
          '  </tr>' + 
          '</thead>' + 
          '<tbody id="completed-lines">' + 
          '</tbody>' + 
        '</table>', true, null, '<h3 class="col-sm-4 modal-title text-blue">' + chrome.i18n.getMessage("mdl_completed_sales_title") + '</h3><div class="col-sm-4"><input type="date" name="modal-ticket-date" id="modal-ticket-date" class="form-control" value="" /></div>');
  modalWindow.general_sm('modal-sales-report', chrome.i18n.getMessage("mdl_report_sales_title"), '<div class="form-group">' + 
        '  <label for="sales-report-date" class="col-sm-3 control-label">' + chrome.i18n.getMessage("mdl_report_sales_startdate") + '</label>' + 
        '  <div class="col-sm-9">' + 
        '    <input type="date" name="sales-report-date" id="sales-report-date" class="form-control" />' + 
        '  </div>' + 
        '</div>' + 
        '<div class="form-group">' + 
        '  <label for="sales-report-enddate" class="col-sm-3 control-label">' + chrome.i18n.getMessage("mdl_report_sales_enddate") + '</label>' + 
        '  <div class="col-sm-9">' + 
        '    <input type="date" name="sales-report-enddate" id="sales-report-enddate" class="form-control" />' + 
        '  </div>' + 
        '</div>' + 
        '<div class="form-group">' + 
        '  <label for="sales-report-detailed" class="col-sm-3 control-label">' + chrome.i18n.getMessage("mdl_report_sales_detail") + '</label>' + 
        '  <div class="col-sm-9">' + 
        '    <input type="checkbox" value="1" name="sales-report-detailed" id="sales-report-detailed" class="flat-red"/>' + 
        '  </div>' + 
        '</div>' + 
        '<div class="form-group">' + 
        '  <label for="sales-report-cashdetail" class="col-sm-3 control-label">' + chrome.i18n.getMessage("mdl_report_sales_cash") + '</label>' + 
        '  <div class="col-sm-9">' + 
        '    <input type="checkbox" value="1" name="sales-report-cashdetail" id="sales-report-cashdetail" class="flat-red"/>' + 
        '  </div>' + 
        '</div>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-success btn-lg pull-right" id="btnSalesReportPrint">' + chrome.i18n.getMessage("mdl_btn_print") + '</button>']);
  modalWindow.general_sm_full_table('modal-customer', chrome.i18n.getMessage("mdl_customers_title"), '<table class="table table-bordered table-condensed" id="customer-table">' + 
        '  <tbody id="customer-lines">' + 
        '  </tbody>' + 
        '</table>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-danger btn-lg pull-right" id="btnCustomerRemove">' + chrome.i18n.getMessage("mdl_btn_delete") + '</button>']);
  modalWindow.general_lg('modal-product', chrome.i18n.getMessage("mdl_line_title"), '<div class="container-fluid sales"><div class="row">' + 
        '<input type="hidden" name="update-product-id" id="update-product-id"/>' + 
        '  <div class="col-sm-4 sales-grid">' + 
        '    <div class="container-fluid" id="calc-update-product">' + 
        '    </div>' + 
        '  </div>' + 
        '  <div class="col-sm-2">' + 
        '    <div class="btn-group-vertical" data-toggle="buttons">' + 
        '      <button type="button" name="update-qty-option" class="btn btn-primary btn-lg btn-block text-uppercase option-group" id="update-qty-option" style="height: 95px;"> ' + chrome.i18n.getMessage("mdl_line_quantity") + '</button>' + 
        '      <button type="button" name="update-price-option" class="btn btn-primary btn-lg btn-block text-uppercase option-group" id="update-price-option" style="height: 95px;"> ' + chrome.i18n.getMessage("mdl_line_price") + '</button>' + 
        '      <button type="button" name="update-discount-option" class="btn btn-primary btn-lg btn-block text-uppercase option-group" id="update-discount-option" style="height: 95px;"> ' + chrome.i18n.getMessage("mdl_line_discount") + '</button>' + 
        '    </div>' + 
        '  </div>' + 
        '  <div class="col-sm-5">' + 
        '    <div class="container-fluid">' + 
        '      <div class="form-group">' + 
        '        <label for="update-qty" class="col-sm-4 control-label">' + chrome.i18n.getMessage("mdl_line_quantity") + '</label>' + 
        '        <div class="col-sm-8">' + 
        '          <input type="numeric" name="update-qty" id="update-qty" class="form-control text-right" disabled value="" />' + 
        '        </div>' + 
        '      </div>' + 
        '      <div class="form-group">' + 
        '        <label for="update-price" class="col-sm-4 control-label">' + chrome.i18n.getMessage("mdl_line_price") + '</label>' + 
        '        <div class="col-sm-8">' + 
        '          <input type="numeric" name="update-price" id="update-price" class="form-control text-right" disabled value="" />' + 
        '        </div>' + 
        '      </div>' + 
        '      <div class="form-group">' + 
        '        <label for="update-discount" class="col-sm-4 control-label">' + chrome.i18n.getMessage("mdl_line_discount") + '</label>' + 
        '        <div class="col-sm-8">' + 
        '          <input type="numeric" name="update-discount" id="update-discount" class="form-control text-right" disabled value="" />' + 
        '        </div>' + 
        '      </div>' + 
        '    </div><!-- /.container-fluid -->' + 
        '  </div>' + 
        '</div>', true, 
    ['<button type="button" class="btn btn-danger btn-lg pull-left" id="btnRemoveProduct">' + chrome.i18n.getMessage("mdl_btn_delete") + '</button>', 
     '<button type="submit" class="btn btn-primary btn-lg pull-right" id="btnUpdateProduct">' + chrome.i18n.getMessage("mdl_btn_save") + '</button>']);
  modalWindow.general_full('modal-cash', chrome.i18n.getMessage("mdl_cash_title"), '<div class="container-fluid sales">' + 
        '  <div class="row">' + 
        '    <div class="col-sm-6 table-responsive no-padding">' + 
        '      <div class="callout callout-warning" style="display: none;" id="modal-cash-alert">' + 
        '        <h4><i class="icon fa fa-warning"></i> <span>' + chrome.i18n.getMessage("mdl_cash_alert_title") + '</span></h4>' + 
        '        <p>' + chrome.i18n.getMessage("mdl_cash_alert_text") + '</p>' + 
        '      </div>' + 
        '      <table class="table table-bordered table-condensed" id="cash-lines-table">' + 
        '        <tbody id="cash-lines">' + 
        '          <tr>' + 
        '            <td>Apertura de Caja 12-12-1212 12:12</td>' + 
        '            <td>500€</td>' + 
        '          </tr>' + 
        '        </tbody>' + 
        '        <tfoot>' + 
        '          <tr>' + 
        '            <th>' + chrome.i18n.getMessage("mdl_cash_total") + '</th>' + 
        '            <th class="text-right" id="cash-lines-total">0€</th>' + 
        '          </tr>' + 
        '        </tfoot>' + 
        '      </table>' + 
        '      <p id="cash-alert">' + chrome.i18n.getMessage("mdl_cash_alert") + '</p>' + 
        '    </div>' + 
        '    <div class="col-sm-6 sales-grid">' + 
        '      <div class="container-fluid money" id="cash-money">' + 
        '      </div>' + 
        '      <div class="container-fluid money" id="cash-calc">' + 
        '      </div>' + 
        '    </div>' + 
        '  </div>' + 
        '</div>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-primary btn-lg pull-right" id="btnConfirmCash">' + chrome.i18n.getMessage("mdl_btn_confirm") + '</button>']);
  modalWindow.general_lg('modal-drawer', chrome.i18n.getMessage("mdl_drawer_title"), '<div class="container-fluid sales">' + 
        '  <div class="row">' + 
        '    <div class="col-sm-6 table-responsive no-padding">' + 
        '      <div class="container-fluid">' + 
        '        <div class="form-group">' + 
        '          <p class="text-justify text-green">' + chrome.i18n.getMessage("mdl_drawer_info_text") + '</p>' + 
        '        </div>' + 
        '        <div class="form-group">' + 
        '          <label for="drawer-operations" class="control-label">' + chrome.i18n.getMessage("mdl_drawer_reason") + '</label>' + 
        '          <select name="drawer-operations" id="drawer-operations" class="form-control select2">' + 
        '          </select>' + 
        '        </div>' + 
        '        <div class="form-group">' + 
        '          <label for="drawer-customer" class="control-label">' + chrome.i18n.getMessage("mdl_drawer_customer") + '</label>' + 
        '          <select name="drawer-customer" id="drawer-customer" class="form-control select2" disabled>' + 
        '          </select>' + 
        '        </div>' + 
        '        <div class="form-group">' + 
        '          <label for="drawer-employee" class="control-label">' + chrome.i18n.getMessage("mdl_drawer_employee") + '</label>' + 
        '          <select name="drawer-employee" id="drawer-employee" class="form-control select2">' + 
        '          </select>' + 
        '        </div>' + 
        '      </div>' + 
        '    </div>' + 
        '    <div class="col-sm-6 sales-grid">' + 
        '      <div class="container-fluid money" id="drawer-calc">' + 
        '      </div>' + 
        '    </div>' + 
        '  </div>' + 
        '</div>', true, 
    ['<button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">' + chrome.i18n.getMessage("mdl_btn_cancel") + '</button>', 
     '<button type="submit" class="btn btn-primary btn-lg pull-right" id="btnSaveDrawer">' + chrome.i18n.getMessage("mdl_btn_open_drawer") + '</button>']);
}

function loadStoredInfo() {
  loadActualUser();
  loadActualTerminalInfo();
}

function loadActualUser() {
  gLockedStore++;
  store.get('security_id', function(val){
    if (!val || val == null || val == '') gUserID = '';
    else gUserID = val;
    gLockedStore--;
  });

  gLockedStore++;
  store.get('security_name', function(val){
    if (!val || val == null || val == '') gUserName = chrome.i18n.getMessage("user_unknown");
    else gUserName = val;
    gLockedStore--;
    $('#security_user').text(gUserName);
  });
  gLockedStore++;
  store.get('security_hash', function(val){
    if (!val || val == null || val == '') gUserPassword = '';
    else gUserPassword = val;
    gLockedStore--;
  });
}

function loadActualTerminalInfo() {
  gLockedStore++;
  store.get('settings_key', function(val){
    if (!val || val == null || val == '') gTerminalID = '';
    else gTerminalID = val;
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_host', function(val){
    if (!val || val == null || val == '') gHostIP = '';
    else gHostIP = val;
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_skin', function(val){
    if (!val || val == null || val == '') gSkin = 'skin-red';
    else gSkin = val;
    gLockedStore--;
    updateSkin();
  });
  gLockedStore++;
  store.get('settings_logo', function(val){
    if (!val || val == null || val == '') gLogoName = '';
    else gLogoName = val;
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_logo_mime', function(val){
    if (!val || val == null || val == '') gLogoMime = '';
    else gLogoMime = val;
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_logo_img', function(val){
    if (!val || val == null || val == '') gLogo = '';
    else gLogo = val;
    gLockedStore--;
    updateLogo();
  });
  gLockedStore++;
  store.get('settings_direct_print', function(val){
    if (!val || val == null || val == '') gDirectPrint = false;
    else gDirectPrint = (val=='1');
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_products_rows', function(val){
    if (!val || val == null || val == '') gProductsRows = 4;
    else gProductsRows = val;
    gLockedStore--;
  });
  gLockedStore++;
  store.get('settings_products_cols', function(val){
    if (!val || val == null || val == '') gProductsCols = 4;
    else gProductsCols = val;
    gLockedStore--;
  });
}

function updateSkin() {
  if (gSkin == null || gSkin == '')
    gSkin = 'skin-red';
  var classes = $(document.body).attr('class');
  var arrClasses = classes.split(' ');
  for (var i = 0; i < arrClasses.length; i++) {
    var aux = arrClasses[i];
    if (aux.toUpperCase().indexOf('SKIN-') == 0)
      $(document.body).removeClass(aux.trim());
  }
  $(document.body).addClass(gSkin);
  $('#lines-box').removeClass('box-danger');
  $('#lines-box').removeClass('box-primary');
  $('#lines-box').removeClass('box-warning');
  $('#lines-box').removeClass('box-default');
  $('#lines-box').removeClass('box-success');
  switch (gSkin) {
    case 'skin-blue':
      $('#lines-box').addClass('box-primary');
      break;
    case 'skin-yellow':
      $('#lines-box').addClass('box-warning');
      break;
    case 'skin-black':
      $('#lines-box').addClass('box-default');
      break;
    case 'skin-green':
      $('#lines-box').addClass('box-success');
      break;
    case 'skin-purple':
      $('#lines-box').addClass('box-default');
      break;
    default:
      $('#lines-box').addClass('box-danger');
      break;
  }
}

function updateLogo() {
  if (gLogo != null && gLogo != '') {
    $('#app-logo').attr('src', gLogo);
  }
  $('#app-logo').show();
}

function buildExtraControls() {
  new Clock($('#actual-time')).start();
  new Calculator('qty', $('#calculator_total'), 'text', '0', 'disabled', 'payment-money');
  new Calculator('password', $('#calculator-password'), 'password', '', '');
  new Calculator('password-login-field', $('#calculator-login'), 'password', '', '');
  new Calculator('update-product-qty', $('#calc-update-product'), 'text', '0', 'disabled');
  new Calculator('cash-qty', $('#cash-calc'), 'text', '0', 'disabled', 'cash-money');
  new Calculator('drawer-qty', $('#drawer-calc'), 'text', '0', 'disabled');
  new Money('qty', $('#payment-money'), 'pay');
  new Money('cash-qty', $('#cash-money'), 'cash');
  
  $("input[type='checkbox']").bootstrapSwitch();
}

function bindButtons() {
  $('#printer-webview').on('loadstop', function(){
    $(this)[0].print();
  });
  $('#btnSelectLogo').on('click', onclickChooseLogo);
  $('#payment-money .money').on('click', function(e){
    updatePendingQty();
    e.preventDefault();
    return false;
  });

  $('#calculator_total .btn-calc').on('click', function(e){
    updatePendingQty();
    e.preventDefault(); // prevents default
    return false;
  });

  $('#cash').on('click', cashModalClick);
  $('#sales-report').on('click', salesReportModalClick);
  $('#btnConfirmCash').on('click', confirmCashClick);
  $('#btnSalesReportPrint').on('click', salesReportPrintClick);
  $('#modal-product .btn-group-vertical .option-group').on('change', updateProductOptionClick);
  $('#modal-product .btn-group-vertical .option-group').on('click', updateProductOptionClick);
  $('#calc-update-product .btn-calc').on('click', updateProductOptionQtyClick);
  $('#drawer-operations').on('change', drawerOperationSelect);
  $('#btnSaveDrawer').on('click', openDrawerClick);
  $('#btnCustomerRemove').on('click', customerSaleRemoveClick);
  $('#tpv_new_btn').on('click', newSaleClick);
  $('#tpv_cancel_btn').on('click', deleteSaleClick);
  $('#tpv_completed_new_btn').on('click', newSaleClick);
  $('#tpv_completed_btn').on('click', completedSalesClick);
  $('#modal-ticket-date').on('change', completedSalesClick);
  $('#tpv_opened_btn').on('click', archivedSalesClick);
  $('#tpv_completed_opened_btn').on('click', archivedSalesClick);
  $('#tpv_cash_btn').on('click', cashClick);
  $('#tpv_back_btn').on('click', backPaymentClick);
  $('#tpv_add_payment_btn').on('click', addPaymentClick);
  $('#tpv_paid_btn').on('click', completeClick);
  $('#tpv_print_btn').on('click', printSaleClick);
  $('#tpv_completed_print_btn').on('click', printSaleClick);
  $('#tpv_drawer_btn').on('click', openDrawerModalClick);
  $('#tpv_drawer_ticket_btn').on('click', openDrawerModalClick);
  $('#tpv_completed_drawer_ticket_btn').on('click', openDrawerModalClick);
  //$('#tpv_completed_reopen').on('click', reopenTicketClick);
  $('#btnmodal-alert-deleteOK').on('click', confirmDeleteSaleClick);
  $('#btnmodal-alertOK').on('click', exitApplicationClick);
  $('#btnmodal-confirm-reopenOK').on('click', reopenTicketClick);
  $('#btnLoginUsers').on('click', loginUserClick);
  $('#btnLogin').on('click', loginClick);
  $('#btnSettingsSave').on('click', settingsClick);
  $('#btnUpdateProduct').on('click', updateProductLineClick);
  $('#btnRemoveProduct').on('click', removeProductLineClick);
}



function loadUSBPrinters() {
  chrome.usb.getDevices({}, function(found_devices) {
    console.log('searching usb devices...');
    if (chrome.runtime.lastError != undefined) {
      console.warn('chrome.usb.getDevices error: ' +
                   chrome.runtime.lastError.message);
      return;
    }

    var devices = [];

    for (var device of found_devices) {
      devices[device.device] = device;
      $('#printer').append($("<option value=" + device.device + ">" + device.productName + "</option>"));
      console.log(device.device);
      //obj.innerHTML = device.device;
    }

    //console.log(devices.toString());
  });
}

function checkSettings(){
  store.get('settings_key', function(val){if (!val || val == null || val == '') $('#modal-settings').modal('show');});
}