
// Requires JQuery

function lunaInput( html_canvas_id, gui_root ) {
  this.canvas_id = html_canvas_id;
  this.gui_root = gui_root;
  this.debug = false;

  this.mouse_drag = {};
  this.key_state = {};
  for (var i=0; i<256; i++) { this.key_state[i] = false; }

  this.init();


}

lunaInput.prototype.getKeyState = function( keyCode ) {
  if (keyCode in this.key_state) {
    return this.key_state[keyCode];
  }
  return false;
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
    t.gui_root.mouseUp( button, x, y );
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
    e.preventDefault();
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

  });

  $(canvas_id).dblclick( function(e) {
    var button = e.which,
        x = e.pageX,
        y = e.pageY;

    if (t.debug) { console.log(">> dblclick", e); } 

  });

  $(canvas_id).keypress( function(e) {

    // Handle typed keys only here.
    var key = e.which || e.keyCode;

    if (t.debug) { console.log(">> keypress", e); } 
   
    t.gui_root.keyPress( key, 0 );

    e.preventDefault();
    return false;
  });

  $(canvas_id).keydown( function(e) {

    var key = e.which || e.keyCode;

    if (t.debug) { console.log(">> keydown", e); } 
  
    console.log( "key" + key );

    t.key_state[ key ] = true;

    // check for typeable keys (non-control)
    // keypress will handle typed keys
    var isTyped =  
        (key > 47 && key < 58)   || // number keys
        key == 32 || key == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (key > 64 && key < 91)   || // letter keys
        (key > 95 && key < 112)  || // numpad keys
        (key > 185 && key < 193) || // ;=,-./` (in order)
        (key > 218 && key < 223);   // [\]' (in order)

    if ( !isTyped ) {
       // handle control keys now
       t.gui_root.keyPress( key, 1 );
       e.preventDefault();
       return false;
    }
  });

  $(canvas_id).keyup( function(e) {
    var key = e.which;

    if (t.debug) { console.log(">> keyup", e); } 

    t.key_state[ key ] = false;

    //t.gui_root.keyUp( key, e );

    e.preventDefault();
    return false;
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
