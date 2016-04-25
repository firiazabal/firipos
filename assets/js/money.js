function Money(fieldID, container, addprefix) {
  this.id = fieldID;
  this.parent = $(container);
  this.prefix = ((addprefix)?addprefix:'');

  this.build = function() {
    var data = [
      {"price" : 100, "image" : "100.jpg"},
      {"price" : 200, "image" : "200.jpg"},
      {"price" : 500, "image" : "500.jpg"},
      {"price" : 5, "image" : "5.jpg"},
      {"price" : 10, "image" : "10.jpg"},
      {"price" : 20, "image" : "20.jpg"},
      {"price" : 50, "image" : "50.jpg"},
      {"price" : 0.20, "image" : "0.20.gif"},
      {"price" : 0.50, "image" : "0.50.jpg"},
      {"price" : 1, "image" : "1.png"},
      {"price" : 2, "image" : "2.jpg"},
      {"price" : 0.01, "image" : "0.01.gif"},
      {"price" : 0.02, "image" : "0.02.gif"},
      {"price" : 0.05, "image" : "0.05.jpg"},
      {"price" : 0.10, "image" : "0.10.gif"},
    ];
    var html = '<div class="row">';
    var cols = 0;
    var firstRow = true;
    for (var i = 0; i < data.length; i++) {
      cols++;
      if ((firstRow && cols > 3) || (!firstRow && cols > 4)) {
        if (firstRow) {
          html += '  <div class="col-sm-3">';
          html += '    <input type="numeric" value="0" name="qty" id="qty_' + this.parent.attr('id') + '" disabled class="form-control money-field bg-green"';
          html += 'style="padding-left: 5px; padding-right: 5px; text-align: right; height: 50px; font-size: 24px;"/>';
          html += '  </div>';
        }
        html += '</div>';
        html += '<div class="row">';
        cols = 1;
        firstRow = false;
      }
      html += '  <div class="col-sm-2">';
      html += '    <a href="#" title="' + data[i].price + '€" style="display: block; position: relative;" class="money" data-value="' + data[i].price + '" data-prefix="' + this.prefix + '" data-id="' + this.parent.attr('id') + '" data-target="' + this.id + '">';
      html += '      <img src="assets/img/money/' + data[i].image + '" alt="' + data[i].price + '€" style="width: 100%; height: 50px;"/>';
      html += '      <span class="badge" style="position: absolute; top: 20%; left: 25%; font-size: 24px;">' + data[i].price + '</span>';
      html += '    </a>';
      html += '  </div>';
      html += '  <div class="col-sm-1">';
      html += '    <input type="numeric" value="0" name="m' + String(data[i].price).replace('.', '-') + '" id="m' + this.prefix + String(data[i].price).replace('.', '-') + '" disabled class="form-control money-field"';
      html += 'style="padding-left: 5px; padding-right: 5px; text-align: right; height: 50px; font-size: 20px;"/>';
      html += '  </div>';
    }
    html += '</div>';
    this.parent.html(html);
    var that = this;
    $(this.parent).find('.money').on('click', that.doOnClick);
  };

  this.doOnClick = function(e) {
    var actprefix = $(this).data('prefix');
    var amount = $(this).data('value');
    var field = $('#m' + actprefix + String(amount).replace('.', '-'));
    var qty = 0;
    {
      var extraQtyField = $('#qty_' + $(this).data('id'));
      var qty = extraQtyField.val();
      extraQtyField.val('0');
      if (qty != null && qty.length > 0) {
        qty = parseInt(qty);
        if (qty <= 0) qty = 1;
      } else
        qty = 1;
    }
    field.val(parseInt(field.val()) + qty);
    var id = $(this).data('target');
    var actual = parseFloat($('#' + id).val());
    
    $('#' + id).val(roundNumber(actual + (parseFloat(amount) * qty)));

    e.preventDefault(); // prevents default
    return false;
  };


  this.build();
}