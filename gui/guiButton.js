
function guiButton( name )
{
  this.constructor(name);

  this.prop_flag_move = false;
  this.prop_flag_resize = false;

  // debugging...
  this.uniq = parseInt(128.0*Math.random());
  this.bgColor = "rgba(0," + this.uniq +",0,0.5)";
  this.press_color = "rgba(60," + (this.uniq + 60) + ",60,0.5)";

  console.log( this.bgColor );

  this.image = null;
  this.press_image = null;

  this.button_press = false;

}
guiButton.inherits( guiRegion );

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
  this.button_press = true;
  return false;
}

guiButton.prototype.OnMouseUp = function( button, x, y ) {
  this.button_press = false;
  return false;
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

  if (!this.image) {
    if (this.button_press) {
      g_painter.drawFill( 0, 0, this.width, this.height, this.press_color );
    } else {
      g_painter.drawFill( 0, 0, this.width, this.height, this.bgColor );
    }
  } else {
    // top left of self is 0,0

    if (this.button_press) {
      if (this.press_image ) {
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

