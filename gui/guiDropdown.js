
function guiDropdown( name )
{
  this.name = name;   
  this.active_state = false;

  this.inactive_size = [ this.width, this.height ];
  this.active_size = [ this.width, this.height + 100 ];
}
guiDropdown.inherits( guiRegion );

guiDropdown.prototype.setInactiveSize = function( w, h ) {
  this.inactive_size = [ w, h ];

  if (!this.active_state) {
    this.setSize( this.x, this.y, w, h );
  }
}

guiDropdown.prototype.setActiveSize = function( w, h ) {
  this.active_size = [ w, h ];

  if (this.active_state) {
    this.setSize( this.x, this.y, w, h );
  }

}


// virtual mouse functions 
//  (overridden by specific gui behavior)
guiDropdown.prototype.OnMouseDown = function( button, x, y )
{
  if (!this.active_state) {
    this.active_state = true;
    this.setSize( this.x, this.y, this.active_size[0], this.active_size[1] );
  } else {
    this.active_state = false;
    this.setSize( this.x, this.y, this.inactive_size[0], this.inactive_size[1] );
  }

  var e = createEvent( this, "dropdown", "mdown", "", null );
  e.attach( this.active_state );
  sendEvent( e );

  return true;
}

guiDropdown.prototype.OnMouseUp = function( button, x, y )
{
  return true;
}


