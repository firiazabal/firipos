function translation_html_labels() {
  $('#settigns').attr('title', chrome.i18n.getMessage("btn_settings_alt"));
  $('#i18nBtnReportOpenedTickets').html(chrome.i18n.getMessage("btn_opened_tickets"));
  $('#tpv_opened_btn').attr('title', chrome.i18n.getMessage("btn_opened_tickets_alt"));
  $('#i18nBtnReportCompletedTickets').html(chrome.i18n.getMessage("btn_completed_tickets"));
  $('#tpv_completed_btn').attr('title', chrome.i18n.getMessage("btn_completed_tickets_alt"));
  $('#i18nBtnReportSales').html(chrome.i18n.getMessage("btn_sales"));
  $('#sales-report').attr('title', chrome.i18n.getMessage("btn_sales_alt"));
  $('#i18nBtnCash').html(chrome.i18n.getMessage("btn_cash"));
  $('#cash').attr('title', chrome.i18n.getMessage("btn_cash_alt"));
  $('#logout').attr('title', chrome.i18n.getMessage("btn_logout_alt"));

  $('#i18nLblUnit').html(chrome.i18n.getMessage("tbl_sale_unit"));
  $('#i18nLblProduct').html(chrome.i18n.getMessage("tbl_sale_product"));
  $('#i18nLblPrice').html(chrome.i18n.getMessage("tbl_sale_price"));
  $('#i18nLblDiscount').html(chrome.i18n.getMessage("tbl_sale_discount"));
  $('#i18nLblAmount').html(chrome.i18n.getMessage("tbl_sale_amount"));
  $('#i18nLblTotal').html(chrome.i18n.getMessage("tbl_sale_total"));

  $('#i18nLblNoProducts').html(chrome.i18n.getMessage("lbl_no_products"));
  $('#i18nLblNoCategories').html(chrome.i18n.getMessage("lbl_no_categories"));

  $('#i18nBtnNew').html(chrome.i18n.getMessage("btn_new"));
  $('#i18nBtnCancel').html(chrome.i18n.getMessage("btn_cancel"));
  //$('#i18nBtnOpened').html(chrome.i18n.getMessage("btn_opened"));
  $('#i18nBtnCommand').html(chrome.i18n.getMessage("btn_command"));
  $('#i18nBtnDrawer').html(chrome.i18n.getMessage("btn_drawer"));
  $('#i18nBtnTpvCash').html(chrome.i18n.getMessage("btn_tpv_cash"));

  $('#i18nBtnBack').html(chrome.i18n.getMessage("btn_back"));
  $('#i18nBtnNewPayment').html(chrome.i18n.getMessage("btn_new_payment"));
  $('#i18nBtnPrint').html(chrome.i18n.getMessage("btn_print"));
  $('#i18nBtnDrawerTicket').html(chrome.i18n.getMessage("btn_drawer_ticket"));
  $('#i18nBtnPaid').html(chrome.i18n.getMessage("btn_paid"));

  $('#i18nBtnCompletedNew').html(chrome.i18n.getMessage("btn_completed_new"));
  //$('#i18nBtnCompletedOpened').html(chrome.i18n.getMessage("btn_completed_opened"));
  $('#i18nBtnCompletedCommand').html(chrome.i18n.getMessage("btn_completed_command"));
  $('#i18nBtnCompletedPrint').html(chrome.i18n.getMessage("btn_completed_print"));
  $('#i18nBtnCompletedDrawer').html(chrome.i18n.getMessage("btn_completed_drawer"));
  $('#i18nBtnCompletedReopen').html(chrome.i18n.getMessage("btn_completed_reopen"));

  $('#i18nPrintTicket').html(chrome.i18n.getMessage("print_ticket"));
  $('#i18nCopyright').html(chrome.i18n.getMessage("copyright"));
  $('#i18nLastCashback').html(chrome.i18n.getMessage("last_cashback"));
}