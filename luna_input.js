
// Requires JQuery

function lunaInput( html_canvas_id ) {
  this.canvas_id = html_canvas_id;
  this.debug = false;
  this.init();
}


lunaInput.prototype.init = function() {
  var canvas_id = this.canvas_id;

  var t = this;

  $(canvas_id).focus( function(e) {
    if (t.debug) { console.log(">> focus", e); } 
  });


  $(canvas_id).mouseup( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mouseup", e); } 

  });

  $(canvas_id).mousedown( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mousedown", e); } 

  });

  $(canvas_id).mouseover( function(e) {
    var x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mouseover", e); } 

  });

  $(canvas_id).mouseenter( function(e) {
    var x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mouseenter", e); } 

  });

  $(canvas_id).mouseleave( function(e) {
    var x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mouseleave", e); } 

  });

  $(canvas_id).mousemove( function(e) {
    var x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mousemove", e); } 

  });

  $(canvas_id).mousewheel( function(e, delta, deltax, deltay) {
    var wheelDelta = delta,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mousewheel", e); } 

  });

  $(canvas_id).click( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> click", e); } 

  });

  $(canvas_id).dblclick( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> dblclick", e); } 

  });

  $(canvas_id).keydown( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keydown", e); } 

  });

  $(canvas_id).keyup( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keyup", e); } 

  });

  $(canvas_id).keypress( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keypress", e); } 

  });

  $(canvas_id).resize( function(width, height, e) {

    if (t.debug) { console.log(">> resize", e); } 

  });

  // Get rid of right click menu popup.
  // Comment out if you would like the right click context menu
  // to pop up (or just have it return true).
  //
  $(document).bind('contextmenu', function(e) { return false; });

}
