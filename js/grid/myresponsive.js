$(function () {
            // thanks to http://stackoverflow.com/a/22885503
  var waitForFinalEvent=function(){
     var b={};return function(c,d,a){a||(a="I am a banana!");b[a]&&clearTimeout(b[a]);b[a]=setTimeout(c,d)}}();
  var fullDateString = new Date();
  function isBreakpoint(alias) {
     return $('.device-' + alias).is(':visible');
  }

  var options = {
     float: false
  };
  $('.grid-stack').gridstack(options);
  function resizeGrid() {
     var grid = $('.grid-stack').data('gridstack');
     if (isBreakpoint('xs')) {
                    $('#grid-size').text('One column mode');
     } else if (isBreakpoint('sm')) {
                    grid.setGridWidth(3);
                    $('#grid-size').text(3);
     } else if (isBreakpoint('md')) {
                    grid.setGridWidth(6);
                    $('#grid-size').text(6);
     } else if (isBreakpoint('lg')) {
                    grid.setGridWidth(12);
                    $('#grid-size').text(12);
     }
  };
  $(window).resize(function () {
      waitForFinalEvent(function() {
         resizeGrid();
      }, 300, fullDateString.getTime());
  });

  // new function () {
  //    this.serializedData = [
  //                   {x: 0, y: 0, width: 4, height: 2},
  //                   {x: 3, y: 1, width: 4, height: 2},
  //                   {x: 4, y: 1, width: 4, height: 1},
  //                   {x: 2, y: 3, width: 8, height: 1},
  //                   {x: 0, y: 4, width: 4, height: 1},
  //                   {x: 0, y: 3, width: 4, height: 1},
  //                   {x: 2, y: 4, width: 4, height: 1},
  //                   {x: 2, y: 5, width: 4, height: 1},
  //                   {x: 0, y: 6, width: 12, height: 1}
  //    ];

  //    this.grid = $('.grid-stack').data('gridstack');

  //    this.loadGrid = function () {
  //       this.grid.removeAll();
  //       var items = GridStackUI.Utils.sort(this.serializedData);
  //       _.each(items, function (node, i) {
  //           this.grid.addWidget($('<div><div class="grid-stack-item-content">' + i + '</div></div>'),
  //           node.x, node.y, node.width, node.height);
  //       }, this);
  //       return false;
  //    }.bind(this);

  //    this.loadGrid();
  //    resizeGrid();
  // };
});
