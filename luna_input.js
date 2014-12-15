
// Requires JQuery

function lunaInput( html_canvas_id, gui_root ) {
  this.canvas_id = html_canvas_id;
  this.gui_root = gui_root;
  this.debug = false;

  this.mouse_drag = {};
  this.key_state = {};

  this.init();

  for (var i=0; i<256; i++) {
    this.key_state[i] = false;
  }

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

    t.mouse_drag[button] = false;
    //t.gui_root.mouseUp( button, x, y );

  });

  $(canvas_id).mousedown( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> mousedown", e); } 

    t.mouse_drag[button] = true;
    t.gui_root.mouseDown( button, x, y );

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

    var mouse_drag_event = false;
    for (var ind in t.mouse_drag) {
      if (t.mouse_drag[ind]) {
        mouse_drag_event = true;
        t.gui_root.mouseDrag( ind, x, y );
      }
    }

    if (!mouse_drag_event) {
      //t.gui_root.mouseMove( x, y );
    }

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

    console.log("click", e);

  });

  $(canvas_id).dblclick( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> dblclick", e); } 

    console.log("dblclick", e);


  });

  $(canvas_id).keydown( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keydown", e); } 

    console.log("keydown", e, e.keyCode, e.key);

    t.key_state[ e.keyCode ] = true;

    //t.gui_root.keyDown( key, e );

  });

  $(canvas_id).keyup( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keyup", e); } 

    console.log("keyUp", e);

    t.key_state[ e.keyCode ] = false;

    //t.gui_root.keyUp( key, e );

  });

  $(canvas_id).keypress( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keypress", e); } 

    console.log("keyPress", e, e.keyCode, e.key);

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
