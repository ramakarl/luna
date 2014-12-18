

function guiToolbar( name )
{
  this.name = name;   

  this.tool_width = 32;
  this.tool_height = 32;
  this.margin = 10;

  this.tool_id_bp = {};
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

guiToolbar.prototype.OnEvent = function( ev )
{
  if ( ev.name == "button" ) {
    if ( ev.obj.name in this.tool_id_bp ) {

      var ind = this.tool_id_bp[ev.obj.name];
      var v = ev.retrieve();
      for (var x=0; x<this.guiChildren.length; x++) {
        if (x == ind) { continue; }
        this.guiChildren[x].active_state = false;
      }

      return true;
    }
  }

  return false;
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
  var n = this.guiChildren.length;
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

  this.tool_id_bp[name] = this.guiChildren.length;

  this.addChild( button );

  this.setSize( this.x, this.y, nw, nh );

  this.Jumble();
}
