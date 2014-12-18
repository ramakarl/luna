
function guiButton( name )
{
  this.constructor(name);

  this.prop_flag_move = false;
  this.prop_flag_resize = false;
  this.bBackground = false;
  this.bBorder = false;

  // Button type:
  //  0 - 'spring loaded'.  mousedown -> active, mouseup -> inactive 
  //  1 - toggle.  mousedown -> !current_state
  //  2 - toggle.  mouseup -> !current_state
  //  3 - sticky.  mousedown -> active
  //  4 - sticky.  mouseup -> active
  //
  this.button_type = 0;

  // debugging...
  this.uniq = parseInt(128.0*Math.random());
  this.bgColor = "rgba(0," + this.uniq +",0,0.5)";
  this.press_color = "rgba(60," + (this.uniq + 60) + ",60,0.5)";

  console.log( this.bgColor );

  this.image = null;
  this.press_image = null;

  this.active_state = false;
}
guiButton.inherits( guiRegion );

guiButton.prototype.setState = function( state ) {
  this.active_state = state;
  var e = createEvent( this, "button", "state", "", this.eventCallback );
  e.attach( this.active_state );
  sendEvent( e );
}

guiButton.prototype.toggleState = function() {
  this.active_state = !this.active_state;
  var e = createEvent( this, "button", "state", "", this.eventCallback );
  e.attach( this.active_state );
  sendEvent( e );
}

guiButton.prototype.setType = function( typ ) {
  this.button_type = typ;
}

guiButton.prototype.setImage = function( img ) {
  this.image = img;

  if (!this.press_image) {
    this.press_color = "rgba(255,255,255,0.2)";
  }
}

guiButton.prototype.setPressImage = function( img ) {
  this.press_image = img;
}

guiButton.prototype.OnMouseDown = function( button, x, y ) {

  if (this.button_type==0) {
    this.setState(true);
    //this.active_state = true;
  } else if (this.button_type==1) {
    this.toggleState();
    //this.active_state  = !this.active_state;
  } else if (this.button_type==3) {
    this.steState(true);
    //this.active_state = true;
  }

  return true;
}

guiButton.prototype.OnMouseUp = function( button, x, y ) {

  if (this.button_type==0) {
    this.setState(false);
    //this.active_state= false;
  } else if (this.button_type==2) {
    this.toggleState();
    //this.active_state = !this.active_state;
  } else if (this.button_type==4) {
    this.setState(true);
    //this.active_state = true;
  }

  return true;
}

/*
guiButton.prototype.OnMouseDown = function(button, x, y) {
  console.log("guiButton.OnMouseDown", button, x, y);
  return false;
}
*/

/*
guiButton.prototype.mouseDown = function(button, x, y)
{
  console.log("guiButton.mouseDown(" + this.name + "): " + button + " " + x + " " + y);

  //var ev = { type: "mouseDown", owner: this.name, ref: this, button : button, x : x, y : y };
  //this.parent.handleEvent(ev);

  return false;
}
*/

/*
guiButton.prototype.doubleClick = function(ev, x, y)
{
  //console.log("guiButton.doubleClick(" + this.name + ")");
  //console.log(ev);

  var ev = { type: "doubleClick", owner: this.name, button : ev.button, x : x, y : y };

  this.parent.handleEvent(ev);

  return true;
}
*/

guiButton.prototype.draw = function()
{

  //console.log("0??>>", this.name, this.active_state);


  if (!this.image) {
    if (this.active_state) {
      g_painter.drawFill( 0, 0, this.width, this.height, this.press_color );
    } else {
      g_painter.drawFill( 0, 0, this.width, this.height, this.bgColor );
    }
  } else {
    if (this.active_state) {
      if (this.press_image) {
        g_painter.drawImage( this.press_image , 0, 0, this.width, this.height );
      } else {
        //highlight image
        g_painter.drawImage( this.image, 0, 0, this.width, this.height );
        g_painter.drawFill( 0, 0, this.width, this.height, this.press_color );
      }
    } else {
      g_painter.drawImage( this.image, 0, 0, this.width, this.height );
    }
  }


}

