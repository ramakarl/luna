
function guiScrollbar( gui_name )
{
  this.constructor ( gui_name );

  this.bgColor = "rgba(0,0,0,0)";   // bgColor must be 0,0,0,0 for scrollbars
  this.barColor = "rgba(200,200,200,.9)";
  this.selColor = "rgba(100,100,100,1)";  
  this.bOverlay = true;  
  this.value = 0;
  this.value_view = 10;
  this.value_min = 0;
  this.value_max = 100;  
}

guiScrollbar.inherits ( guiRegion );

guiScrollbar.prototype.setRange = function( rmin, rmax )
{
  this.range_min = rmin;
  this.range_max = rmax;
  this.full = this.width;
  this.updatePos();
}
guiScrollbar.prototype.updatePos = function()
{
  // map value to bar position  
  this.full = this.width;
  var u = (this.value-this.value_min) / (this.value_max-this.value_min);    
  var handlesize = (this.value_view*this.height) / (this.value_max-this.value_min);
  this.pos_min = this.full + u * (this.height-this.full*2-handlesize)
  this.pos_max = this.pos_min + handlesize;  
}

guiScrollbar.prototype.OnMouseDown = function( button, x, y )
{
  // start scrollbar drag
  this.pos_start = y;    // or x if horiz
  this.value_start = this.value;
  return true;
}
guiScrollbar.prototype.OnMouseDrag = function( button, x, y )
{
  // start scrollbar drag  
  var u = (y-this.full) / (this.height-this.full*2);   
  this.value = this.value_min + u * (this.value_max-this.value_min);
  if ( this.value < this.value_min ) this.value = this.value_min;
  if ( this.value > this.value_max ) this.value = this.value_max;
  this.updatePos ();  

  // Create and send scroll event
  var e = createEvent ( this, "scroll", "mdrag", "", null );
  e.attach ( this.value );
  sendEvent ( e );

  return true;
}

guiScrollbar.prototype.OnMouseWheel = function(delta)
{
}

guiScrollbar.prototype.draw = function()
{
  var mid = this.full / 2;  
  g_painter.drawFill ( 0, 0, this.width, this.height, this.barColor );
  g_painter.drawTri  ( mid, 0, this.full, this.full, 0, this.full, this.selColor );
  g_painter.drawFill ( 0, this.pos_min, this.width, this.pos_max-this.pos_min, this.selColor );
  g_painter.drawTri  ( 0, this.height-this.full, this.full, this.height-this.full, mid, this.height, this.selColor );
}

 
