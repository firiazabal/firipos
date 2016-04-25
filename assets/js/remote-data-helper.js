function _updateGrants(data) {
  if (data.cash_info) {
    gCashID = data.cash_info.id;
  } else {
    gCashID = null;
  }
  if (data.change_price)
    gChangePriceGranted = (data.change_price);
  if (data.change_discount)
    gChangeDiscountGranted = (data.change_discount);
  if (data.cash) {
    $('#cash').removeClass('disabled');
    gCashGranted = data.cash;
  }
  if (data.reports) {
    $('#sales-report').removeClass('disabled');
    $('#tpv_completed_btn').removeClass('disabled');
    gRerportGranted = data.reports;
  }
}

function _updateCurrency(data) {
  if (data.currency)
    gCurrency = data.currency;

  if (data.currency_position || data.currency_position == 0)
    gCurrencyPos = data.currency_position;

  currencyUpdate();
}

function _buildUsersControls(data, host) {
  $('.users-icons').unbind("click");
  $('.users-select').unbind("click");
  $('#select-users li').remove();
  $('#users-icons').html('');
  for (var i = 0; i < data.length; i++) {
    $('#select-users').append($('<li><a href="#" data-id="' + data[i].id + '" class="users-select"><i class="fa fa-user text-red"></i>' + data[i].name + '</a></li>'));
    var icons = '<div class="col-xs-6 col-sm-4 text-center">';
    icons += '  <a href="#" class="users-icons" data-id="' + data[i].id + '" data-name="' + data[i].name + '">';
    icons += '    <img src="assets/img/no-photo.png" id="image-users-icons-' + data[i].id + '" alt="' + data[i].name;
    icons += '" class="img-circle img-thumbnail" title="' + data[i].name + '" style="border: 6px solid #e6eced; height: 120px; width: 120px;">';
    icons += '<h3 style="color: #6d1e1e; text-transform: uppercase;">' + data[i].name + '</h3>';
    icons += '  </a>';
    icons += '</div>';
    $('#users-icons').append($(icons));
    loadImageSrc(host + data[i].image, 'image-users-icons-' + data[i].id);
  }
  $('.users-select').on('click', onclickLoginCombo);
  $('.users-icons').on('click', onclickUserIcon);
}

function _buildOperationsControls(data) {
  fillSelect('drawer-operations', data, chrome.i18n.getMessage("select_one_operation_option"));
  gOperations = new Array();
  for (var i = 0; i < data.length; i++) {
    gOperations[data[i].value] = ((data[i].customer == '1')?'customer':((data[i].employee == '1')?'employee':''));
  }
}

function _buildCustomersControls(data) {
  fillSelect('drawer-customer', data, chrome.i18n.getMessage("select_one_customer_option"));
  fillTable('customer-lines', data, customerListClick);
}

function _buildEmployeesControls(data) {
  fillSelect('drawer-employee', data, chrome.i18n.getMessage("select_one_employee_option"));
}

function _buildCategoriesControls(host, data) {
  var colsize = 4;
  var colstyle = (12/colsize);
  var cols = 0;
  var img = [];
  var row = $('<div class="row"></div>');
  for (var i = 0; i < data.length; i++) {
    if (i==0) {
      gSelectedCategory = data[i].id;
      gDefaultCategory = gSelectedCategory;
    }
    cols++;
    if (cols > colsize) {
      $('#categories').append(row);
      row = $('<div class="row"></div>');
      cols = 1;
    }
    var html = '<div class="col-xs-6 col-sm-' + colstyle + '" style="position: relative;">';
    html += '  <a href="#" data-id="' + data[i].id + '" class="thumbnail category-item' + ((i==0)?' active':'') + '" title="' + data[i].name + '" id="category_button_' + data[i].id + '">';
    html += '    <img src="assets/img/no-photo-grid.png" style="width: 100%; height: 54px;" alt="' + data[i].name + '" id="image-categories-' + data[i].id + '">';
    html += '    <p style="overflow: hidden; text-overflow: ellipsis; width: 100%; margin: 0px; padding-left: 5px; padding-right: 5px;" class="text-uppercase text-nowrap">' + data[i].name + '</p>';
    html += '  </a>';
    html += '</div>';
    row.append($(html));
    
    if (data[i].icon != null && data[i].icon.length > 0)
      img[img.length] = [host + data[i].icon, 'image-categories-' + data[i].id];

    _buildProductsControls(host, data[i].id, data[i].products, (i==0));
  }
  $('#categories').append(row);
  for (var i = 0; i < img.length; i++) {
    loadImageSrc(img[i][0], img[i][1]);
  }
  $('.category-item').unbind('click');
  $('.category-item').on('click', onclickCategory);
}

function _buildProductsControls(host, categoryID, products, active) {
  var rowsize = 4;
  var itemsize = 110;

  var row = 0;
  var maxitems = 0;
  var lines = new Array();
  var sizes = new Array();
  var img = [];
  for (var i = 0; i < products.length; i++) {
    row++;
    if (row > rowsize) {
      row = 1;
    }

    if (products[i].boms) {
      _buildProductsBOMControls(host, products[i].id, products[i].boms);
    }

    line = '<div class="col-sm-3 item">';
    line += '	<a href="#" data-id="' + products[i].id + '" data-name="' + products[i].name + '" data-price="' + products[i].sales_price + '" data-bom="' + ((products[i].boms)?'1':'0') + '" class="thumbnail product-item">';
    line += '		<img src="assets/img/no-photo-grid.png" style="width: 100%; height: 50px;" alt="' + products[i].name + '" id="image-products-' + products[i].id + '">';
    line += '		<p class="text-nowrap" style="overflow: hidden; text-overflow: ellipsis; width: 100%; margin: 0px;">' + products[i].name + '</p>';
    line += '	</a>';
    line += '</div>';

    if (products[i].icon != null && products[i].icon.length > 0)
      img[img.length] = [host + products[i].icon, 'image-products-' + products[i].id];

    if (lines.length < row || !lines[row - 1] || lines[row - 1] == null) {
      lines[row - 1] = '';
      sizes[row - 1] = 0;
    }
    lines[row - 1] += line;
    sizes[row - 1]++;
  }

  for (var i = 0; i < sizes.length; i++) {
    if (sizes[i] > maxitems)
      maxitems = sizes[i];
  }
  var grid = $('<div class="grid-horizontal" style="min-width: 100%;' + (active?'':' display: none;') + '" id="category_' + categoryID + '"></div>');

  for (var i = 0; i < lines.length; i++) {
    grid.append(lines[i]);
    grid.append($('<div class="clearfix"></div>'));
  }
  $('#products').append(grid);
  for (var i = 0; i < img.length; i++) {
    loadImageSrc(img[i][0], img[i][1]);
  }
  $(document).ready(function(){
    fixGridHorizontal('category_' + categoryID, maxitems);
  });
  $(window).resize(function(){
    fixGridHorizontal('category_' + categoryID, maxitems);
  });
  $('.product-item').unbind('click');
  $('.product-item').on('click', onclickProduct);
  $('.product-bom-item').unbind('click');
  $('.product-bom-item').on('click', onclickProductBOM);
  $('.product-bom-back').unbind('click');
  $('.product-bom-back').on('click', onclickProductBOMBack);
  $('.product-bom-finalize').unbind('click');
  $('.product-bom-finalize').on('click', onclickProductBOMFinalize);
}

function _buildProductsBOMControls(host, productId, boms) {
  var img = [];
  var container = '';
  for (var i = 0; i < boms.length; i++) {
    container += '<div class="container-fluid sales product-' + productId + '-bom-section" id="product-' + productId + '-bom-section-' + i + '">';
    container += '  <div class="row">'
    container += '    <h2 class="text-red">' + boms[i].name + '</h2>';
    container += '  </div>';
    var actual = 'product-' + productId + '-bom-section-' + i;
    var next = (i == boms.length - 1)?'':'product-' + productId + '-bom-section-' + (i+1);
    var previous = (i == 0)?'':'product-' + productId + '-bom-section-' + (i-1);
    container += '  <div class="row sales-grid">';

    container += '<div class="col-sm-2 item">';
    container += '	<a href="#" data-id="" data-name="" data-next="' + next + '" data-actual="' + actual + '" data-section="" class="thumbnail product-bom-item">';
    container += '		<img src="assets/img/no-product-selection.png" style="width: 100%; height: 50px;" alt="' + chrome.i18n.getMessage("bom_products_nothing") + '">';
    container += '		<p class="text-nowrap" style="overflow: hidden; text-overflow: ellipsis; width: 100%; margin: 0px;">' + chrome.i18n.getMessage("bom_products_nothing") + '</p>';
    container += '	</a>';
    container += '</div>';

    for (var j = 0; j < boms[i].products.length; j++) {
      container += '<div class="col-sm-2 item">';
      container += '	<a href="#" data-id="' + boms[i].products[j].id + '" data-name="' + boms[i].products[j].name + '" data-next="' + next + '" data-actual="' + actual + '" data-section="' + boms[i].products[j].section + '" class="thumbnail product-bom-item">';
      container += '		<img src="assets/img/no-photo-grid.png" style="width: 100%; height: 50px;" alt="' + boms[i].products[j].name + '" id="image-products-' + productId + '-section-' + i + '-bom-' + boms[i].products[j].id + '">';
      container += '		<p class="text-nowrap" style="overflow: hidden; text-overflow: ellipsis; width: 100%; margin: 0px;">' + boms[i].products[j].name + '</p>';
      container += '	</a>';
      container += '</div>';
      if (boms[i].products[j].icon != null && boms[i].products[j].icon.length > 0)
        img[img.length] = [host + boms[i].products[j].icon, 'image-products-' + productId + '-section-' + i + '-bom-' + boms[i].products[j].id];
    }
    container += '  </div>';
    container += '</div>';
  }
  modalWindow.kit('modal-bom-' + productId, chrome.i18n.getMessage("mdl_bom_title"), container);
  for (var i = 0; i < img.length; i++) {
    loadImageSrc(img[i][0], img[i][1]);
  }
}

function _buildPaymentTypesControls(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].isdefault == '1') {
      gSelectedPayment = data[i].id;
      gDefaultPayment = gSelectedPayment;
    }
    var html = '<div class="col-sm-6" style="position: relative; padding-bottom: 5px;">';
    var classNames = '';
    if (data[i].free != null && data[i].free.length > 0 && data[i].free == '1')
      classNames += ' free';
    if (data[i].customer_account != null && data[i].customer_account.length > 0 && data[i].customer_account == '1')
      classNames += ' customer_account';
    if (data[i].employee_account != null && data[i].employee_account.length > 0 && data[i].employee_account == '1')
      classNames += ' employee_account';
    html += '  <div class="small-box bg-aqua payment-type-item' + classNames + '" id="paymenttype_' + data[i].id + '" data-cash="' + data[i].cash + '"';
    html += 'data-free="' + data[i].free + '" data-employee="' + data[i].employee_account + '" data-customer="' + data[i].customer_account + '"';
    html += ' style="min-height: 90px;">';
    html += '    <div class="inner">';
    html += '      <h2>' + data[i].name + '</h2>';
    html += '    </div>';
    var icon = data[i].icon;
    if (icon != null && icon.length > 0) {
      html += '    <div class="icon">';
      html += '      <i class="fa ' + icon + '"></i>';
      html += '    </div>';
    }
    html += '  </div>';
    html += '</div>';
    $('#payment-types').append($(html));
  }
  $('#payment-types .payment-type-item').unbind('click');
  $('#payment-types .payment-type-item').on('click', onclickPaymentType);
  selectUnselectPayment(gDefaultPayment, true);
}

function _buildArchivedSalesControls(data) {
  fillSalesTable('archived-lines', 'archived', data, clickArchivedLine);
}

function _buildCompletedSalesControls(data) {
  fillSalesTable('completed-lines', 'completed', data, clickCompletedLine);
}

function _buildSaleControls(data, iscompleted) {
  _buildSaleHeaderControls(data);
  if (data.lines && data.lines.length > 0) {
    for (var i = 0; i < data.lines.length; i++) {
      addLine(data.lines[i].product_id, data.lines[i].qty, data.lines[i].name, data.lines[i].price, data.lines[i].discount, data.lines[i].total, data.lines[i].name_bom, ((data.lines[i].isbom=='1')?data.lines[i].line_id:''), iscompleted);
    }
  }
  if (data.payments && data.payments.length > 0) {
    for (var i = 0; i < data.payments.length; i++) {
      addPayment(data.payments[i].id, data.payments[i].text, data.payments[i].amount, iscompleted);
    }
  }

  if (iscompleted)
    prepareSaleCompleted();
}

function _buildSaleHeaderControls(data) {
  $('#sale_id').val(data.sale_id);
  $('#sale_documentno').text('#' + pad(data.documentno, 7));
  $('#sale_time').text(data.time);
  $('#sale_customer').html(((data.bpartner==null || data.bpartner.length == 0)?chrome.i18n.getMessage("customer_anonymous"):data.bpartner));
  $('#customer_id').val(data.bpartner_id);
}

function _buildSaleLineControls(data, isbom) {
  _buildSaleHeaderControls(data);
  addLine(data.product_id, data.qty, data.name, data.price, data.discount, data.total, data.name_bom, (isbom?data.line_id:null));
}

function addLine(id, quantity, name, price, discount, total, name_bom, line_id, readonly) {
  if (!readonly || readonly == null)
    readonly = false;

  if (gLines == null) {
    gLines = new Array();
    gLinesId = new Array();
  }
  var register_id = id;
  if (line_id && line_id != null && line_id.length > 0)
    register_id = line_id + '_' + id;
  if (jQuery.inArray(register_id, gLinesId) != -1) {
    //Existe la linea
    var pos = jQuery.inArray(register_id, gLinesId);
    var qty_total = roundNumber(quantity);
    var oldTotal = gLines[pos][5];
    gLines[pos] = new Array(register_id, qty_total, name, price, discount, total);
    var tr = $('#line_' + register_id);
    tr.find('.qty').text(parseInt(qty_total).toString());
    tr.find('.price').text(parseFloat(price).toFixed(2).toString());
    tr.find('.discount').text(parseFloat(discount).toFixed(2).toString());
    tr.find('.total').html(((gCurrencyPos==0)?gCurrency:'') + parseFloat(total).toFixed(2).toString() + ((gCurrencyPos==1)?gCurrency:''));
    gTotalLines += roundNumber(total-oldTotal);
  } else {
    gLines.push(new Array(register_id, quantity, name, price, discount, total));
    gLinesId.push(register_id);
    var tr = $('<tr class="table-tr" data-id="' + id + '"></tr>');
    if ((gLinesId.length % 2) != 0) tr.addClass('odd');
    tr.attr('id', 'line_' + register_id);
    var td = $('<td class="qty">' + parseInt(quantity).toString() + '</td>');
    tr.append(td);
    var name_real = name;
    if (name_bom && name_bom != null && name_bom.length > 0)
      name_real += name_bom;
    gTotalLines += parseFloat(total);
    td = $('<td class="name" data-name="' + name + '">' + name_real + '</td>');
    tr.append(td);
    td = $('<td class="text-right price">' + parseFloat(price).toFixed(2).toString() + '</td>');
    tr.append(td);
    td = $('<td class="text-danger text-right discount">' + parseFloat(discount).toFixed(2).toString() + '</td>');
    tr.append(td);
    td = $('<td class="text-success text-right total">' + ((gCurrencyPos==0)?gCurrency:'') + parseFloat(total).toFixed(2).toString() + ((gCurrencyPos==1)?gCurrency:'') + '</td>');
    tr.append(td);
    $('#lines').append(tr);
  }
  gTotalLines = roundNumber(gTotalLines);
  $('#lines_total').text(gTotalLines.toFixed(2).toString());
  resetPreselections();
  $("#lines_div").animate({ scrollTop: $("#lines_div")[0].scrollHeight}, 1000);
  $('#lines .table-tr').unbind('click');
  if (!readonly)
    $('#lines .table-tr').on('click', selectLine);
}

function removeLine(id) {
  if (gLines == null) {
    gLines = new Array();
    gLinesId = new Array();
  }
  $('#lines .table-tr').unbind('click');
  if (jQuery.inArray(id, gLinesId) != -1) {
    //Existe la linea
    var pos = jQuery.inArray(id, gLinesId);
    var oldTotal = gLines[pos][5];
    gLinesId.splice(pos, 1);
    gLines.splice(pos, 1);
    var tr = $('#line_' + id);
    tr.remove();
    gTotalLines -= roundNumber(oldTotal);
  }
  gTotalLines = roundNumber(gTotalLines);
  $('#lines_total').text(gTotalLines.toFixed(2).toString());
  resetPreselections();
  $("#lines_div").animate({ scrollTop: $("#lines_div")[0].scrollHeight}, 1000);
  $('#lines .table-tr').on('click', selectLine);
  i = 0;
  $('#lines .table-tr').each(function(){
    $(this).removeClass('odd');
    if (i%2 == 0) $(this).addClass('odd');
    i++;
  });
}

function addPayment(id, text, amount, readonly) {
  if (!readonly || readonly == null)
    readonly = false;

  var li = $('<li id="payment-item-' + id + '"></li>');
  if (!readonly)
    li.append($('<a href="#" class="text-red payment-remove-btn" data-amount="' + amount + '" id="payment-item-btn-' + id + '"><i class="fa fa-close"></i></a>'));
  li.append($('<span>' + text + '</span>'));
  gTotalPaid += parseFloat(amount);
  gTotalPaid = roundNumber(gTotalPaid);
  resetPreselections();
  activePayment(gDefaultPayment);
  updatePendingQty();
  $('#payments-list').append(li);
  $('#payments-list .payment-remove-btn').unbind('click');
  if (!readonly)
    $('#payments-list .payment-remove-btn').on('click', removePaymentClick);
}

function _buildCashModal(data) {
  $('#modal-cash-alert').hide();
  gCashID = data.id;
  gCashTotal = parseFloat(data.amount);
  var grandtotal = 0;
  var main = $('#cash-lines');
  var tr = $('<tr class="odd text-success"></tr>');
  tr.append($('<td>' + chrome.i18n.getMessage("cash_start") + ' ' + data.datestart + '</td>'));
  tr.append($('<td class="text-right">' + ((gCurrencyPos==0)?gCurrency:'') + data.amount + ((gCurrencyPos==1)?gCurrency:'') + '</td>'));
  main.append(tr);
  tr = $('<tr class="text-success"></tr>');
  tr.append($('<td>' + chrome.i18n.getMessage("cash_sales") + '</td>'));
  tr.append($('<td class="text-right">' + ((gCurrencyPos==0)?gCurrency:'') + data.sales + ((gCurrencyPos==1)?gCurrency:'') + '</td>'));
  gCashTotal += parseFloat(data.sales);
  main.append(tr);
  for (var i = 0; i < data.movements.length; i++) {
    tr = $('<tr class="' + ((i%2)?'':'odd ') + ((data.movements[i].deposit=='1')?'text-success':'text-danger') + '"></tr>');
    tr.append($('<td>' + data.movements[i].description + ' ' + data.movements[i].datemovement + '</td>'));
    tr.append($('<td class="text-right">' + ((gCurrencyPos==0)?gCurrency:'') + ((data.movements[i].deposit=='1')?'':'-') + data.movements[i].amount + ((gCurrencyPos==1)?gCurrency:'') + '</td>'));
    if (data.movements[i].deposit == '1')
      gCashTotal += parseFloat(data.movements[i].amount);
    else
      gCashTotal -= parseFloat(data.movements[i].amount);
    main.append(tr);
  }
  gCashTotal = roundNumber(gCashTotal);
  tr = $('<tr class="bg-info text-lg"></tr>');
  tr.append($('<td><strong>' + chrome.i18n.getMessage("cash_total_sales") + '<strong></td>'));
  tr.append($('<td class="text-right"><strong>' + ((gCurrencyPos==0)?gCurrency:'') + gCashTotal + ((gCurrencyPos==1)?gCurrency:'') + '</strong></td>'));
  main.append(tr);
  grandtotal = gCashTotal;
  for (var i = 0; i < data.payments.length; i++) {
    tr = $('<tr class="' + ((i%2)?'':'odd ') + ' text-info"></tr>');
    tr.append($('<td>' + data.payments[i].name + '</td>'));
    tr.append($('<td class="text-right">' + ((gCurrencyPos==0)?gCurrency:'') + data.payments[i].amount + ((gCurrencyPos==1)?gCurrency:'') + '</td>'));
    grandtotal += parseFloat(data.payments[i].amount);
    main.append(tr);
  }
  if (data.archived > 0)
    $('#modal-cash-alert').show();
  grandtotal = roundNumber(grandtotal);
  $('#cash-lines-total').html(((gCurrencyPos==0)?gCurrency:'') + grandtotal + ((gCurrencyPos==1)?gCurrency:''));
}