
function guiText( name )
{
  this.constructor(name);

  this.text = "Hello world!";
  this.textsize = 20;
  this.textclr = "black";

  this.cursorx = 0;
  this.cursory = 0;
}

guiText.inherits( guiRegion );


guiText.prototype.OnMouseDown = function( button, x, y ) 
{

  this.cursorx = 0;
  g_scene.ctx.font = String(this.textsize)+"px Georgia";
  var dms = g_scene.ctx.measureText( this.text.substring(0,this.cursorx) ).width;
  console.log ( "dms: " + dms );
  while ( x > dms && this.cursorx < this.text.length ) {
     this.cursorx++;
     dms = g_scene.ctx.measureText( this.text.substring(0,this.cursorx) ).width;
     console.log ( "dms: " + dms );
  }
  this.cursorx--;
  this.cursory = 0;

  return true;
}


guiText.prototype.OnMouseUp = function( button, x, y ) {

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

guiText.prototype.OnKeyPress = function( key, extd )
{
  console.log ( "key: "+key + " " + extd );
  switch ( key ) {
  case 37:  this.moveCursor(-1, 0);   break;  // left
  case 39:  this.moveCursor(+1, 0);   break;  // right
  case 38:  this.moveCursor( 0,-1);   break;  // up
  case 40:  this.moveCursor( 0,+1);   break;  // down
  case 36:    // home
     this.cursorx = 0;	
     this.cursory = 0;
     break;
  case 35:    // end
     this.cursorx = this.text.length;
     this.cursory = 0;
     break;
  case 8:     // backspace
     this.text = this.text.substring (0, this.cursorx-1) + this.text.substring( this.cursorx );
     this.moveCursor ( -1, 0 );
     break;
  case 46:    // delete
     this.text = this.text.substring (0, this.cursorx) + this.text.substring( this.cursorx+1 );
     break;
  default:
     if ( extd==0 ) {
        this.text = this.text.substring(0,this.cursorx) + String.fromCharCode(key) + this.text.substring(this.cursorx);
        this.moveCursor ( 1, 0 );
     }
     break;
  };
}

guiText.prototype.moveCursor = function(dx, dy)
{
  this.cursorx += dx;
  this.cursory += dy;
  if ( this.cursorx < 0 ) this.cursorx = 0;
  if ( this.cursory < 0 ) this.cursory = 0;
}


guiText.prototype.draw = function()
{
  // text
  g_scene.ctx.font = String(this.textsize)+"px Georgia";
  g_scene.ctx.fillStyle = this.textclr;
  g_scene.ctx.fillText ( this.text, 0, this.textsize );

  // cursor
  var dms = g_scene.ctx.measureText( this.text.substring(0,this.cursorx) ).width;
  g_painter.drawFill ( dms, this.cursory*this.textsize, 2, this.textsize, "rgba(255,0,0,1)" );
}

