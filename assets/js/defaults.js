function loadBaseInfo() {
  if (gLockedStore) {
    setTimeout(function () {loadBaseInfo();}, 500);
  } else {
    if (gTerminalID == null || gTerminalID.length == 0) { //Si no se ha configurado el plugin
    } else { //Si se ha configurado el plugin
      loadBaseControls();
      loadDefaults();

      if (gUserID == null || gUserID.length == 0) { //Si no está logeado ningún usuario
        $('#modal-users').modal({keyboard: false, backdrop: false, show: true});
      } else { //Si ya hay un usuario logeado
        if (gDefaultCategory && gDefaultCategory != null && gDefaultCategory.length > 0)
          activeCategory(gDefaultCategory);
        else
          loadCategories();
        if (gDefaultPayment && gDefaultPayment != null && gDefaultPayment.length > 0)
          activePayment(gDefaultPayment);
        else
          loadPaymentTypes();
      }
    }
    
  }
}

function loadDefaults() {
  activatePayment(false);
  resetGrants();
  $('#ticket-print').prop('checked', gTicketPrint);
  $("#ticket-print").change();
  $('#sale_id').val('');
  $('#customer_id').val('');
  $('#sale_documentno').text('');
  $('#sale_time').text('');
  $('#sale_customer').text(chrome.i18n.getMessage("customer_anonymous"));
  $('#lines .table-tr').unbind('click');
  $('#lines .table-tr').remove();
  $('#lines_total').text('0.00');
  currencyUpdate();
  $('#payments-list .payment-remove-btn').unbind('click');
  $('#payments-list li').remove();
  resetPreselections();
  gLines = new Array();
  gLinesId = new Array();
  gTotalLines = 0.00;
  gTotalPaid = 0.00;
}

function currencyUpdate() {
  if (gCurrencyPos == 0) {
    $('#lines_total_suffix').hide();
    $('#lines_total_prefix').html(gCurrency);
    $('#lines_total_prefix').show();
  } else {
    $('#lines_total_prefix').hide();
    $('#lines_total_suffix').html(gCurrency);
    $('#lines_total_suffix').show();
  }
}

function resetGrants() {
  gCashGranted = false;
  gRerportGranted = false;
  gChangePriceGranted = false;
  gChangeDiscountGranted = false;
  gCompletedGranted = false;
  $('#cash').removeClass('disabled');
  $('#cash').addClass('disabled');
  $('#sales-report').removeClass('disabled');
  $('#tpv_completed_btn').removeClass('disabled');
  $('#sales-report').addClass('disabled');
  $('#tpv_completed_btn').addClass('disabled');
}

function resetPreselections() {
  resetCalc();
  markRowSelected(false);
}

function resetCalc() {
  $('#qty').val('0');
  $('.money-field').val('0');
  $('.money-inp').val('0');
  updatePendingQty();
}

function prepareSaleCompleted() {
  $('#categories').hide();
  $('#products').hide();
  $('#btn-ticket').hide();
  $('#payment').show();
  $('#payment-money').hide();
  $('#payment-types').hide();
  $('#btn-payment').hide();
  $('#btn-completed').show();

  resetPreselections();
}

function activatePayment(activate) {
  $('#btn-completed').hide();
  if (activate) {
    $('#categories').hide();
    $('#products').hide();
    $('#btn-ticket').hide();
    $('#btn-payment').show();
    $('#payment-money').show();
    $('#payment').show();
    $('#payment-types').show();
  } else {
    $('#payment').hide();
    $('#payment-types').hide();
    $('#btn-payment').hide();
    $('#btn-ticket').show();
    $('#categories').show();
    $('#products').show();
  }
}

function markRowSelected(selected) {
  if (gSelectedRow) {
    gSelectedRow.removeClass('active');
    if (selected) {
      gSelectedRow.addClass('active');
    }
  }
}

function activeCategory(id) {
  resetPreselections();
  if (gSelectedCategory == id)
    return;

  selectUnselectCategory(gSelectedCategory, false);
  selectUnselectCategory(id, true);
  gSelectedCategory = id;
}

function activePayment(id) {
  if (gSelectedPayment == id)
    return;

  selectUnselectPayment(gSelectedPayment, false);
  selectUnselectPayment(id, true);
  gSelectedPayment = id;
}

function selectUnselectCategory(id, selected) {
  $('#category_button_' + id).removeClass('active');
  if (selected) {
    $('#category_button_' + id).addClass('active');
    $('#category_' + id).show();
  } else {
    $('#category_' + id).hide();
  }
}

function selectUnselectPayment(id, selected) {
  $('#paymenttype_' + id).removeClass('active');
  if (selected) {
    $('#paymenttype_' + id).addClass('active');
    if ($('#paymenttype_' + id).data('cash') == '1') {
      $('#payment-money').show();
    } else {
      $('#payment-money').hide();
    }
  }
}

function updatePendingQty() {
  var total = gTotalLines - gTotalPaid - parseFloat($('#qty').val());
  $('#pendingqty').text(numberFormat(roundNumber(total, 2), 2));
}

function backPaymentClick(e) {
  resetPreselections();
  activatePayment(false);
  e.preventDefault(); // prevents default
  return false;
}