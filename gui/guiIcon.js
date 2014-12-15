
function guiIcon( name )
{
  this.constructor(name);

  // debugging...
  this.uniq = parseInt(256.0*Math.random());
  //this.bgColor = "rgba(" + this.uniq + ",0,0," + "0.2)";
  //this.bgColor = "rgba(0,0," + this.uniq +",0.7)";
  this.bgColor = "rgba(0," + this.uniq +",0,0.5)";

  this.drawShape = null;

  //console.log("uniq: " + this.uniq);
}
guiIcon.inherits( guiRegion );


guiIcon.prototype.mouseDown = function(button, x, y)
{
  console.log("guiIcon.mouseDown(" + this.name + "): " + button + " " + x + " " + y);

  var ev = { type: "mouseDown", owner: this.name, ref: this, button : button, x : x, y : y };

  this.parent.handleEvent(ev);

  return true;
}

guiIcon.prototype.doubleClick = function(ev, x, y)
{
  //console.log("guiIcon.doubleClick(" + this.name + ")");
  //console.log(ev);

  var ev = { type: "doubleClick", owner: this.name, button : ev.button, x : x, y : y };

  this.parent.handleEvent(ev);

  return true;
}

guiIcon.prototype.draw = function()
{
   g_painter.drawRectangle( 0, 0, this.width, this.height,  
                           0, "rgb(0,0,0)", 
                           true, this.bgColor );

  if (this.drawShape)
    this.drawShape();
}

