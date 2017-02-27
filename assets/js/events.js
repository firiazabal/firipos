function onclickChooseLogo(e) {
  chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {

    readOnlyEntry.file(function(file) {
      var reader = new FileReader();

      //reader.onerror = errorHandler;
      reader.onloadend = function(e) {
        settingslogoImg = e.target.result;
      };
      $('#logo_src').val(file.name);
      settingslogoMime = file.type;
      //reader.readAsBinaryString(file);
      reader.readAsDataURL(file);
    });
    e.preventDefault();
    return false;
	});
}

function onclickPaymentType(e) {
  var iscustomer = $(this).data('customer');
  if (iscustomer == '1') {
    var customer = $('#customer_id').val();
    if (customer == null || customer.length == 0) {
      messages.alert('Es necesario asignar un cliente a la venta para poder utilizar esta forma de pago.');
      e.preventDefault(); // prevents default
      return false;
    }
  }
  resetPreselections();
  var id = $(this).attr('id');
  activePayment(id.replace('paymenttype_', ''));
  e.preventDefault(); // prevents default
  return false;
}

function onclickLoginCombo(e) {
  var userID = $(this).data('id');
  var hasPass = $(this).data('password');
  if (hasPass == '1') {
    $('#userLoginIdLogin').val(userID);
    $('#password').val('');
    $('#modal-login').modal();
  } else {
    loginNoPassword(userID, null);
  }
  e.preventDefault(); // prevents default
  return false;
}

function onclickUserIcon(e) {
  var userID = $(this).data('id');
  var hasPass = $(this).data('password');
  if (hasPass == '1') {
    $('#usernameUsers').text($(this).data('name'));
    $('#btnLoginUsers').prop('disabled', false);
    $('#userLoginId').val(userID);
  } else {
    loginNoPassword(userID, 'modal-users');
  }
  e.preventDefault(); // prevents default
  return false;
}

function onclickCategory(e) {
  activeCategory($(this).data("id"));
  e.preventDefault(); // prevents default
  return false;
}

function onclickProduct(e) {
  var isbom = $(this).data('bom');
  var id = $(this).data('id');
  if (isbom == '1') {
    $('.product-' + id + '-bom-section').hide();
    $('#product-' + id + '-bom-section-0').show();
    $('.product-bom-finalize').prop('disabled', true);
    $('.product-bom-back').prop('disabled', true);
    $('.product-bom-item').removeClass('active');
    gProductsBom = new Array();
    gProductsBomSection = 0;
    gProductsBomID = id;
    $('#modal-bom-' + id).modal();
    return;
  }

  var calc = $('#qty').val();
  var quantity = 1;
  if (calc != null && calc != 0) {
    calc = parseFloat(calc);
    if (calc > 0)
      quantity = calc;
  }
  addProductLine($(this).data("id"), quantity)

  e.preventDefault(); // prevents default
  return false;
}

function onclickProductBOM(e) {
  var id = $(this).data('id');
  var actual = $(this).data('actual');
  var next = $(this).data('next');
  var section = $(this).data('section');
  
  if (id == '')
    gProductsBom[gProductsBomSection] = null;
  else
    gProductsBom[gProductsBomSection] = new Array(section, id);

  if (next != null && next.length > 0) {
    $('#' + actual).hide();
    $('#' + next).show();
    gProductsBomSection++;
  } else {
    $('.product-bom-finalize').prop('disabled', false);
  }
  if (gProductsBomSection > 0)
    $('.product-bom-back').prop('disabled', false);

  $('#' + actual + ' .product-bom-item').removeClass('active');
  $(this).addClass('active');

  e.preventDefault(); // prevents default
  return false;
}

function onclickProductBOMBack(e) {
  gProductsBomSection--;
  $('.product-' + gProductsBomID + '-bom-section').hide();
  $('#product-' + gProductsBomID + '-bom-section-' + gProductsBomSection).show();
  $('.product-bom-finalize').prop('disabled', true);
  if (gProductsBomSection > 0)
    $('.product-bom-back').prop('disabled', false);
  else
    $('.product-bom-back').prop('disabled', true);

  e.preventDefault(); // prevents default
  return false;
}

function onclickProductBOMFinalize(e) {
  var calc = $('#qty').val();
  var quantity = 1;
  if (calc != null && calc != 0) {
    calc = parseFloat(calc);
    if (calc > 0)
      quantity = calc;
  }

  var products = [];
  if (gProductsBom != null && gProductsBom.length > 0) {
    for (var i = 0; i < gProductsBom.length; i++) {
      if (gProductsBom[i] == null) continue;
      products[products.length] = gProductsBom[i][0] + '_' + gProductsBom[i][1];
    }
  }
  addProductBOMLine(products, quantity);

  e.preventDefault(); // prevents default
  return false;
}

function newSaleClick(e) {
  loadBaseInfo();
  e.preventDefault(); // prevents default
  return false;
}

function completedSalesClick(e) {
  if (gCompletedGranted) {
    var date = $('#modal-ticket-date').val();
    if (date == null || date.length == 0) {
      setInputDate('modal-ticket-date');
      date = $('#modal-ticket-date').val();
    }
    loadCompletedSalesList(date);
  }
  e.preventDefault(); // prevents default
  return false;
}

function clickArchivedLine(e) {
  loadBaseInfo();
  var sale_id = $(this).attr('id');
  sale_id = sale_id.replace('archived_', '');
  loadSale(sale_id);
  e.preventDefault(); // prevents default
  return false;
}

function clickCompletedLine(e) {
  loadBaseInfo();
  var sale_id = $(this).attr('id');
  sale_id = sale_id.replace('completed_', '');
  loadSaleCompleted(sale_id);
  e.preventDefault(); // prevents default
  return false;
}

function addPaymentClick(e) {
  var qty = parseFloat($('#qty').val());
  var qtypaid = qty;
  if (qty == 0) {
    qty = gTotalLines - gTotalPaid;
  } else {
    var total = gTotalLines - gTotalPaid - qty;
    if (total < 0) {
      qty = gTotalLines - gTotalPaid;
    }
  }

  if (qty == 0) {
    messages.alert('Esta venta ya está completamente pagada');
    return false;
  }

  if (qtypaid == 0)
    qtypaid = qty;
  savePayment(qty, qtypaid);
  e.preventDefault(); // prevents default
  return false;
}

function completeClick(e) {
  var qty = parseFloat($('#qty').val());
  var qtypaid = qty;
  if (qty == 0) {
    qty = gTotalLines - gTotalPaid;
  } else {
    var total = gTotalLines - gTotalPaid - qty;
    if (total != 0) {
      qty = gTotalLines - gTotalPaid;
    }
  }

  if (qtypaid < qty) {
    qtypaid = qty;
  }
  
  saveCompleteSale(qty, qtypaid);
  e.preventDefault(); // prevents default
  return false;
}

function cashClick(e) {
  var sale = $('#sale_id').val();
  if (sale!=null && sale.length > 0) {
    activePayment(gDefaultPayment);
    activatePayment(true);
    $('#tpv_paid_btn').button('reset');
    $('#tpv_add_payment_btn').button('reset');
  }
  e.preventDefault(); // prevents default
  return false;
}

function selectLine(e) {
  markRowSelected(false);
  gSelectedRow = $(this);
  markRowSelected(true);
  $('#modal-product .modal-title').text($(this).find('.name').data('name'));
  $('#update-product-id').val($(this).attr('id').replace('line_', ''));
  $('#update-qty').val($(this).find('.qty').text());
  $('#update-price').val($(this).find('.price').text());
  $('#update-discount').val($(this).find('.discount').text());
  if (gChangePriceGranted)
    $('#update-price-option').prop('disabled', false);
  else
    $('#update-price-option').prop('disabled', true);
  if (gChangeDiscountGranted)
    $('#update-discount-option').prop('disabled', false);
  else
    $('#update-discount-option').prop('disabled', true);
  $('#update-qty-option').click();
  $('#update-qty-option').button('toggle');
  //$('#modal-product .modal-title').text($(this).find('.name').text());
  $('#modal-product').modal();
  e.preventDefault(); // prevents default
  return false;
}

function customerListClick(e) {
  $('#modal-customer').modal('hide');
  var name = $(this).data('name');
  var id = $(this).data('id');
  var sale = $('#sale_id').val();

  if (sale == null || sale.length == 0) {
    $('#customer_id').val(id);
    $('#sale_customer').html(name);
  } else {
    changeCustomerSale(id);
  }

  e.preventDefault(); // prevents default
  return false;
}

function addCustomerClick(e) {
  var customer = $('#mdlAddCustomerName').val();
  if (customer == null || customer.length == 0) {
    messages.alert(chrome.i18n.getMessage("mdl_add_customers_name_required"));
  } else {
    $('#modal-add-customer').modal('hide');
    
    addCustomerSale(customer);
  }
  
  e.preventDefault(); // prevents default
  return false;
}

function customerSaleRemoveClick(e) {
  $('#modal-customer').modal('hide');
  var sale = $('#sale_id').val();

  if (sale == null || sale.length == 0) {
    $('#customer_id').val('');
    $('#sale_customer').html(chrome.i18n.getMessage("customer_anonymous"));
  } else {
    changeCustomerSale('');
  }

  e.preventDefault(); // prevents default
  return false;
}

function removePaymentClick(e) {
  var id = $(this).attr('id');
  id = id.replace('payment-item-btn-', '');
  removePayment(id);
  e.preventDefault(); // prevents default
  return false;
}

function printSaleClick(e)
{
  printSale();

  e.preventDefault(); // prevents default
  return false;
}

function openDrawerModalClick(e){
  $('#drawer-operations').val('');
  $('#drawer-customer').val('');
  $('#drawer-customer').prop('disabled', true);
  $('#drawer-employee').val('');
  $('#drawer-employee').prop('disabled', true);
  $('#drawer-qty').val('0');
  $('#modal-drawer').modal();
  e.preventDefault(); // prevents default
  return false;
}

function reopenTicketClick(e) {
  $('#modal-confirm-reopen').modal('hide');
  reopenSale();
  e.preventDefault();
  return false;
}

function openDrawerClick(e)
{
  $('#modal-drawer').modal('hide');
  var customer = '', employee = '';
  if (!$('#drawer-customer').prop('disabled')) {
    customer = $('#drawer-customer').val();
  } else if (!$('#drawer-employee').prop('disabled')) {
    employee = $('#drawer-employee').val();
  }
  openDrawer(customer, employee);

  e.preventDefault(); // prevents default
  return false;
}

function salesReportPrintClick(e) {
  var chkdetailed = $('#sales-report-detailed').prop('checked');
  var chkcashdetail = $('#sales-report-cashdetail').prop('checked');
  var date = $('#sales-report-date').val();
  var enddate = $('#sales-report-enddate').val();
  $('#modal-sales-report').modal('hide');
  if (date == null || date.length == 0) {
    messages.alert('Debe indicar una fecha para las ventas');
    return;
  }
  
  printSalesReport(date, enddate, chkdetailed, chkcashdetail);

  e.preventDefault(); // prevents default
  return false;
}

function confirmCashClick(e) {
  var url = 'cash_open';
  var total = 0;
  total = $('#cash-qty').val();
  $('#modal-cash').modal('hide');
  if (gCashID) {
    url = 'cash_close';
    if (parseFloat(total) != parseFloat(gCashTotal)) {
      messages.alert('El importe indicado no coincide con la cantidad prevista. Realice las operaciones necesarias para que dichas cantidades coincidan o no podrá cerrar la caja.');
      return;
    }
  }
  saveCash(url, total);
  e.preventDefault(); // prevents default
  return false;
}

function cashModalClick(e) {
  if (gCashGranted) {
    $('#cash-qty').val('0');
    $('.money-field').val('0');
    $('.money-inp').val('0');
    $('#cash-lines tr').remove();
    if (gCashID == null || gCashID.length == 0 || gCashID == 0) {
      $('#cash-lines-table').hide();
      $('#cash-alert').show();
      $('#btnConfirmCash').text(chrome.i18n.getMessage("mdl_btn_open_cash"));
      $('#modal-cash').modal();
    } else {
      $('#cash-lines-table').show();
      $('#cash-alert').hide();
      $('#btnConfirmCash').text(chrome.i18n.getMessage("mdl_btn_close_cash"));
      getCashFlowInfo();
    }
  }
  e.preventDefault(); // prevents default
  return false;
}

function salesReportModalClick(e) {
  if (gRerportGranted) {
    /*var aux = $('#sales-report-date').val();
    if (aux == null || aux.length == 0)
      setInputDate('sales-report-date');
    aux = $('#sales-report-enddate').val();
    if (aux == null || aux.length == 0)
      setInputDate('sales-report-enddate');*/
    setInputDate('sales-report-date');
    setInputDate('sales-report-enddate');
    $('#modal-sales-report').modal();
  }
  e.preventDefault(); // prevents default
  return false;
}

function updateProductOptionClick(e){
  $('#update-product-qty').val('0');
  var id = $(this).attr('id');
  id = id.replace('update-', '');
  id = id.replace('-option', '');
  gSelectedUpdateProductField = id;
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
  e.preventDefault(); // prevents default
  return false;
}

function updateProductOptionQtyClick(e){
  var qty = $('#update-product-qty').val();
  if (gSelectedUpdateProductField == 'price') {
    $('#update-price').val(roundNumber(qty));
  } else if (gSelectedUpdateProductField == 'discount') {
    $('#update-discount').val(roundNumber(qty));
  } else {
    $('#update-qty').val(roundNumber(qty));
  }
  e.preventDefault(); // prevents default
  return false;
}

function drawerOperationSelect(e){
  if (gOperations[$(this).val()] && gOperations[$(this).val()] == 'customer') {
    $('#drawer-customer').prop('disabled', false);
  } else {
    $('#drawer-customer').prop('disabled', true);
  }
  if (gOperations[$(this).val()] && gOperations[$(this).val()] == 'employee') {
    $('#drawer-employee').prop('disabled', false);
  } else {
    $('#drawer-employee').prop('disabled', true);
  }
}

function deleteSaleClick(e){
  var sale = $('#sale_id').val();
  if (sale!=null && sale.length > 0) {
    $('#modal-alert-delete').modal();
  }
  e.preventDefault(); // prevents default
  return false;
}

function confirmDeleteSaleClick(e){
  $('#modal-alert-delete').modal('hide');
  var sale = $('#sale_id').val();
  if (sale!=null && sale.length > 0) {
    deleteSale(sale);
  }
  e.preventDefault(); // prevents default
  return false;
}

function exitApplicationClick(e) {
  store.remove('security_id');
  store.remove('security_name');
  store.remove('security_hash');
  chrome.app.window.current().close();
}

function loginUserClick(e) {
  login($('#userLoginId').val(), $('#password-login-field').val(), 'modal-users')
  e.preventDefault(); // prevents default
  return false;
}

function loginClick(e) {
  login($('#userLoginIdLogin').val(), $('#password').val(), 'modal-login')
  e.preventDefault(); // prevents default
  return false;
}

function settingsClick(e) {
  store.set('settings_key', $('#terminal_id').val());
  store.set('settings_host', $('#host_ip').val());
  store.set('settings_printer', $('#printer').val());
  store.set('settings_skin', $('#skin').val());
  store.set('settings_logo', $('#logo_src').val());
  store.set('settings_logo_img', settingslogoImg);
  store.set('settings_logo_mime', settingslogoMime);
  store.set('settings_products_rows', $('#products_rows').val());
  store.set('settings_products_cols', $('#products_cols').val());
  store.set('settings_direct_print', (($('#direct_print').prop('checked'))?'1':'0'));
  store.set('settings_ticket_print', (($('#settings_ticket').prop('checked'))?'1':'0'));
  loadActualTerminalInfo();
  $('#modal-settings').modal('hide');
  e.preventDefault(); // prevents default
  return false;
}

function updateProductLineClick(e) {
  updateProductLine($('#update-product-id').val(), $('#update-qty').val(), $('#update-price').val(), $('#update-discount').val());
  e.preventDefault(); // prevents default
  return false;
}

function removeProductLineClick(e) {
  removeProductLine($('#update-product-id').val());
  e.preventDefault(); // prevents default
  return false;
}