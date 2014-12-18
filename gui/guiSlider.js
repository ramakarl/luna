

function guiSlider( name )
{
  this.name = name;   
  this.orientation = "H"; // or "V"
  //this.orientation = "V"; // or "V"

  this.cursorColor = "rgba(10,10,10,0.3)";

  this.pos_start;
  this.margin = 20;
  this.cursorSizeShort = 11;
  this.cursorSizeLong = 31;

  this.dS = 1;
  if (this.orientation == "H") {
    this.dS = this.width - 2*this.margin;
  } else if (this.orientation == "V") {
    this.dS = this.height - 2*this.margin;
  }

  this.value = .5;
}
guiSlider.inherits( guiRegion );

guiSlider.prototype.setSize = function( x, y, w, h ) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.move ( x, y );
  this.dS = ( (this.orientation == "H") ? w : h );
  this.dS -= 2*this.margin;
}

// virtual mouse functions 
//  (overridden by specific gui behavior)
guiSlider.prototype.OnMouseDown = function( button, x, y )
{
  if (this.orientation == "H") {
    this.pos_start = x;
  } else {
    this.pos_start = y;
  }

  this.value = (this.pos_start - this.margin) / this.dS;
  if      (this.value < 0) { this.value = 0; }
  else if (this.value > 1) { this.value = 1; }

  var e = createEvent( this, "slider", "mdown", "", null );
  e.attach( this.value );
  sendEvent( e );

  return true;
}

guiSlider.prototype.OnMouseUp = function( button, x, y )
{
  return true;
}

guiSlider.prototype.OnMouseDrag = function( button, x, y )
{
  var ds = 0;
  ds = ( (this.orientation == "H") ? x : y );
  ds -= this.margin;

  var u = ds / this.dS;

  if      (u<0) { this.value = 0.0; } 
  else if (u>1) { this.value = 1.0; }
  else          { this.value = u; }

  var e = createEvent( this, "slider", "mdrag", "", null );
  e.attach( this.value );
  sendEvent( e );

  return true;
}

guiSlider.prototype.draw = function() {
  var tx = Math.floor(this.width/2);
  var ty = Math.floor(this.height/2);

  var cs = Math.floor( this.cursorSizeShort/2 );
  var cl = Math.floor( this.cursorSizeLong/2 );

  var szs = this.cursorSizeShort;
  var szl = this.cursorSizeLong;

  if (this.orientation == "H") {
    tx = Math.floor(this.value * (this.width - 2*this.margin));
    tx += this.margin;
    g_painter.drawFill( tx-cs, ty-cl, szs, szl, this.cursorColor );

  } else if (this.orientation == "V") {
    ty = Math.floor(this.value * (this.height - 2*this.margin));
    ty += this.margin;
    g_painter.drawFill( tx-cl, ty-cs, szl, szs, this.cursorColor );
  }


}


