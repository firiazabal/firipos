function fixItemsInWindow() {
  var a=$(".main-header").outerHeight()+$(".main-footer").outerHeight(),b=$(window).outerHeight();
  var height = b-a;
  $('#content-body').css("height", height);
  $('#content-body').css("overflow", "auto");

  $(".box-wrapper-half").each(function(){
    var c=$(this).find(".box-header").height(), d=$(this).find(".box-footer").height();
    if (!c || c==null) c = 0;
    if (!d || d==null) d = 0;
    if (c>0) c += 20;
    if (d>0) d += 20;
    var separator = 20;
    if (c>0 || d>0) separator = 134;
    //var height = (b-a-c-d);
    var height2 = height-c-d-separator;
    $(this).find(".box-body").css("height", height2 / 2);
    $(this).find(".box-body").css("overflow", "auto");
  });

  $(".box-wrapper").each(function(){
    var c=$(this).find(".box-header").height(), d=$(this).find(".box-footer").height();
    if (!c || c==null) c = 0;
    if (!d || d==null) d = 0;
    if (c>0) c += 20;
    if (d>0) d += 20;
    //var height = (b-a-c-d);
    var height2 = b-a-33-c-d;
    $(this).find(".box-body").css("height", height2);
    $(this).find(".box-body").css("overflow", "auto");
    $(this).find(".categories").css("height", height2 - $(this).find(".calculator").height() - 25);
  });

  fixModalFullWindows();
}

function fixModalFullWindows() {
  var a=$(".main-header").outerHeight()+$(".main-footer").outerHeight(),b=$(window).outerHeight();
  $(".modal-full").each(function(){
    var c=$(this).find(".modal-header").height(), d=$(this).find(".modal-footer").height();
    if (!c || c==null) c = 0;
    if (!d || d==null) d = 0;
    if (c>0) c += 20;
    if (d>0) d += 20;
    var e = ((c==0 && d==0)?60:0);
    var height2 = b-a-165-c-d+e;
    $(this).find('.modal-body').css("height", height2);
    $(this).find(".modal-body").css("overflow", "auto");
  });
}

function fixGridHorizontal(id, cols) {
  var grid = $('#' + id);
  if (gItemWidth == null || gItemHeight == null) {
    var selected = $('#category_' + gSelectedCategory);
    gItemHeight = parseInt(selected.height()/4);
    var item = selected.find('.item').first();
    item.css('width', '25%');
    gItemWidth = item.width();
  }
  grid.css("width", (((gItemWidth + 2) * cols) + 1) + "px");
  grid.find('.item').each(function(){
    $(this).css('width', gItemWidth + "px");
    //$(this).css('height', (gItemHeight-5) + "px");
  });
  grid.find('.item img').each(function(){
    $(this).css('height', (gItemHeight - 22) + "px");
  });
}