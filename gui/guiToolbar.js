

function guiToolbar( name )
{
  this.name = name;   

  this.tool_width = 32;
  this.tool_height = 32;
  this.margin = 10;

  // array of [width, height]
  this.tool_size = [];

  // array of [x, y]
  this.tool_pos = [];

  this.tool_state = []
}
guiToolbar.inherits( guiRegion );

guiToolbar.prototype.setSize = function( x1, y1, w, h )
{
  this.x = x1;
  this.y = y1;
  this.width = w;  
  this.height = h;
  this.move ( x1, y1);
}

// virtual mouse functions 
//  (overridden by specific gui behavior)
guiToolbar.prototype.OnMouseDown = function( button, x, y )
{
  return true;
}

guiToolbar.prototype.OnMouseUp = function( button, x, y )
{
  return true;
}

guiToolbar.prototype.OnMouseDrag = function( button, x, y )
{
  return false;
}

guiToolbar.prototype.OnMouseMove = function( button, x, y )
{
  return false;
}


guiToolbar.prototype.Jumble = function() { } 


guiToolbar.prototype.setToolSize = function( w, h ) {
  this.tool_width = w;
  this.tool_height = h;
}

guiToolbar.prototype.addTool = function( name, image, pressImage )
{
  var n = this.tool_state.length;
  var nx = this.margin + n*this.tool_width;
  var ny = this.margin;

  var nw = 2*this.margin + (n+1)*this.tool_width ;
  var nh = 2*this.margin + this.tool_height ;

  var button = new guiButton( name );
  button.setType(1);
  button.setBackClr( 0.2, 0.2, 0.2, 0.3 );
  button.setSize( nx, ny, this.tool_width, this.tool_height );
  if (image) {
    button.setImage( image );
  }

  if (pressImage) {
    button.setPressImage( pressImage );
  }

  this.tool_state.push( false );
  this.tool_pos.push( [ nx, ny ] );
  this.tool_size.push( [ this.tool_width, this.tool_height] );

  this.guiChildren.push ( button );
  button.parent = this;
  button.setWorldMatrix();

  this.setSize( this.x, this.y, nw, nh );

  this.Jumble();
}
