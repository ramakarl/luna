
function guiButton( name )
{
  this.constructor(name);

  // debugging...
  this.uniq = parseInt(256.0*Math.random());
  this.bgColor = "rgba(0," + this.uniq +",0,0.5)";

  console.log( this.bgColor );

  this.image = null;


}
guiButton.inherits( guiRegion );

guiButton.prototype.setImage = function( img ) {
  this.image = img;
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
    g_painter.drawFill( 0, 0, this.width, this.height, this.bgColor );
  } else {
    // top left of self is 0,0
    g_painter.drawImage( this.image, 0, 0, this.width, this.height );
  }

}

