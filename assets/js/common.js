function getHostUrl() {
  if (gHostIP && gHostIP.length > 0) {
    var host = gHostIP.trim();
    var pos = host.length;
    var last = host.substring(pos-1);
    if (last == '/' || last == "\\")
      return host;
    else
      return host + '/';
  }
  return '';
}

function getTerminalID() {
  return gTerminalID;
}

function getUserID() {
  return gUserID;
}

function getUserPassword() {
  return gUserPassword;
}

function loadImageSrc(url, id) {
  var xhr = new XMLHttpRequest();
  var imgObj = $('#' + id);
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    var img = imgObj;
    img.attr('src', window.URL.createObjectURL(this.response));
  };

  xhr.send();
}

function fillDataTable(id, idLines, data, callback) {
  $('#' + idLines + ' tr').unbind("click");
  $('#' + idLines + ' tr').remove();
  for (var i = 0; i < data.length; i++) {
    $('#' + idLines).append($('<tr data-id="' + data[i].value + '" data-name="' + data[i].name + '" class="table-tr' + ((i%0)?'':' odd') + '"><td>' + data[i].name + '</td></tr>'));
  }
  $('#' + idLines + ' tr').on("click", callback);
  $('#' + id).DataTable( {
    "destroy": $.fn.dataTable.isDataTable( '#' + id ),
    "oLanguage": {
      "oPaginate": {
          "sFirst": chrome.i18n.getMessage("datatables_first"),
          "sLast": chrome.i18n.getMessage("datatables_last"),
          "sPrevious": chrome.i18n.getMessage("datatables_previous"),
          "sNext": chrome.i18n.getMessage("datatables_next")
      },
      "sEmptyTable": chrome.i18n.getMessage("datatables_empty_table"),
      "sInfo": chrome.i18n.getMessage("datatables_info"),
      "sInfoEmpty": chrome.i18n.getMessage("datatables_info_empty"),
      "sInfoFiltered": chrome.i18n.getMessage("datatables_info_filtered"),
      "sInfoThousands": chrome.i18n.getMessage("datatables_thousands"),
      "sLengthMenu": chrome.i18n.getMessage("datatables_length_menu"),
      "sLoadingRecords": chrome.i18n.getMessage("datatables_loading_records"),
      "sProcessing": chrome.i18n.getMessage("datatables_processing"),
      "sSearch": chrome.i18n.getMessage("datatables_search"),
      "sZeroRecords": chrome.i18n.getMessage("datatables_zero_records")
    }, 
    "bPaginate": true,
    "bLengthChange": false,
    "bFilter": true,
    "bSort": true,
    "bInfo": true,
    "bAutoWidth": true
	});
}

function fillTable(id, data, callback) {
  $('#' + id + ' tr').unbind("click");
  $('#' + id + ' tr').remove();
  for (var i = 0; i < data.length; i++) {
    $('#' + id).append($('<tr data-id="' + data[i].value + '" data-name="' + data[i].name + '" class="table-tr' + ((i%0)?'':' odd') + '"><td>' + data[i].name + '</td></tr>'));
  }
  $('#' + id + ' tr').on("click", callback);
}

function fillSelect(id, data, defaultText) {
  $('#' + id + ' option').remove();
  if (defaultText && defaultText != null && defaultText.length > 0)
    $('#' + id).append($('<option value="">' + defaultText + '</option>'));
  for (var i = 0; i < data.length; i++) {
    $('#' + id).append($('<option value="' + data[i].value + '">' + data[i].name + '</option>'));
  }
}

function fillSalesTable(id, line_id_prefix, data, callback) {
  $('#' + id + ' .table-tr').unbind('click');
  $('#' + id + ' .table-tr').remove();
  for (var i = 0; i < data.length; i++) {
    var tr = $('<tr class="table-tr"></tr>');
    if ((i % 2) == 0) tr.addClass('odd');
    tr.attr('id', line_id_prefix + '_' + data[i].id);
    var td = $('<td>' + pad(data[i].documentno, 7) + '</td>');
    tr.append(td);
    td = $('<td>' + data[i].time + '</td>');
    tr.append(td);
    td = $('<td>' + data[i].employee + '</td>');
    tr.append(td);
    var customer = data[i].customer;
    if (customer == null || customer.length == 0) customer = '';
    td = $('<td>' + customer + '</td>');
    tr.append(td);
    td = $('<td class="text-right">' + data[i].lines.toString() + '</td>');
    tr.append(td);
    td = $('<td class="text-success text-right total">' + data[i].total.toString() + '</td>');
    tr.append(td);
    $('#' + id).append(tr);
  }
  $('#' + id + ' .table-tr').on('click', callback);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function roundNumber(num) {
  if (num == null || !num)
    return 0;
  num = num * 100;
  var actual = Math.round(num);
  return (actual / 100);
}

function numberFormat(num, decimals) {
  return num.toFixed(decimals);
}

function setInputDate(id) {
    var field = $('#' + id);
    var today = new Date(),
        d = today.getDate(),
        m = today.getMonth()+1, 
        y = today.getFullYear(),
        data;

    if(d < 10){
        d = "0"+d;
    };
    if(m < 10){
        m = "0"+m;
    };

    data = y+"-"+m+"-"+d;
    field.val(data);
}

function parseAjaxError(jqXHR, status, errMsg) {
  console.error(jqXHR);
  if (errMsg == null || errMsg.length == 0) {
    if (status == 'timeout') {
      messages.alert(chrome.i18n.getMessage("ajax_error_timeout"));
    } else if (status == 'parsererror') {
      messages.alert(chrome.i18n.getMessage("ajax_error_parser"));
    } else if (status == 'abort') {
      messages.alert(chrome.i18n.getMessage("ajax_error_abort"));
    } else {
      messages.alert(chrome.i18n.getMessage("ajax_error_unknown"));
    }
  } else {
    messages.alert(errMsg);
  }
}

function printCommand(id) {
  printDirect("pointofsale/report_command/" + id);
}

function printTicket(id) {
  printDirect("pointofsale/report_ticket/" + id);
}

function printSalesTicket(startdate, enddate, detail, cash) {
  printDirect("pointofsale/report_sales", ('report_date=' + startdate + '&report_enddate=' + enddate + '&detailed=' + detail + '&cashdetail=' + cash));
}

function printCashTicket(id) {
  printDirect("pointofsale/report_cash/" + id);
}

function printDirect(url, params) {
  var urlparams = 'terminal=' + getTerminalID() + '&user=' + getUserID() + 'password=' + getUserPassword();
  if (params != null && params.length > 0)
    urlparams += "&" + params;
  $('#printer-webview').attr('src', getHostUrl() + url + "?" + urlparams);
}

function getVersion(callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'manifest.json');
  xmlhttp.onload = function (e) {
    var manifest = JSON.parse(xmlhttp.responseText);
    callback(manifest.version);
  }
  xmlhttp.send(null);
}