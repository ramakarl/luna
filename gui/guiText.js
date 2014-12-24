
function guiText( name )
{
  this.constructor(name);

  this.bClip = true;
  this.text = [ "This is a fun little", "window that lets me", "enter some text." ];
  this.textsize = 20;
  this.textclr = "black";

  this.cursorx = 0;
  this.cursory = 0;

  var scroll = new guiScrollbar;
  scroll.setSize ( 190, 0, 10, 100 );
  scroll.setRange ( 0, 200 );
  this.addChild ( scroll );
}

guiText.inherits( guiRegion );

guiText.prototype.OnResize = function()
{
    
}

guiText.prototype.textWidth = function()
{
  return g_scene.ctx.measureText( this.text[ this.cursory ].substring(0, this.cursorx) ).width;
}

guiText.prototype.OnMouseDown = function( button, x, y ) 
{
  this.cursory = Math.floor(y / this.textsize);
  if ( this.cursory >= this.text.length ) this.cursory = this.text.length-1;
  this.cursorx = 0;
  g_scene.ctx.font = String(this.textsize)+"px Georgia";
  while ( x > this.textWidth() && this.cursorx < this.text[this.cursory].length ) {
     this.cursorx++;
  }
  this.cursorx--;
 
  return true;
}
guiText.prototype.InsertLine = function ( pos )
{
  this.text.splice ( pos+1, 0, "");
}

guiText.prototype.OnKeyPress = function( key, extd )
{
  var y = this.cursory;
  console.log ( "key: "+key + " " + extd );
  switch ( key ) {
  case 37:  this.moveCursor(-1, 0);   break;  // left
  case 39:  this.moveCursor(+1, 0);   break;  // right
  case 38:  this.moveCursor( 0,-1);   break;  // up
  case 40:  this.moveCursor( 0,+1);   break;  // down
  case 36:    // home
     this.cursorx = 0;
     break;
  case 35:    // end
     this.cursorx = this.text[y].length;
     break;
  case 8:     // backspace
     if ( this.cursorx == 0 && this.cursory > 0 ) {
       this.cursorx = this.text[y-1].length;
       this.text[y-1] = this.text[y-1] + this.text[y];
       this.text.splice ( y, 1 );
       this.cursory--;
     } else {
       this.text[y] = this.text[y].substring (0, this.cursorx-1) + this.text[y].substring( this.cursorx );
       this.moveCursor ( -1, 0 );
     }
     break;
  case 46:    // delete
     if ( this.cursorx == this.text[y].length && y < this.text.length-1 ) {
       this.text[y] = this.text[y] + this.text[y+1];
       this.text.splice ( y+1, 1);
     } else {
       this.text[y] = this.text[y].substring (0, this.cursorx) + this.text[y].substring( this.cursorx+1 );
     }
     break;
  case 13:    // enter
     this.InsertLine ( y );
     this.text[y+1] = this.text[y].substring( this.cursorx );
     this.text[y] = this.text[y].substring( 0, this.cursorx );
     this.cursory++;
     this.cursorx = 0;
     break;
  default:
     if ( extd==0 ) {
        this.text[y] = this.text[y].substring(0,this.cursorx) + String.fromCharCode(key) + this.text[y].substring(this.cursorx);
        this.moveCursor ( 1, 0 );
     }
     break;
  };
}

guiText.prototype.moveCursor = function(dx, dy)
{
  this.cursorx += dx;
  this.cursory += dy;
  if ( this.cursory < 0 ) this.cursory = 0;
  if ( this.cursory >= this.text.length ) this.cursory = this.text.length-1;
  if ( this.cursorx < 0 ) this.cursorx = 0;	
  if ( this.cursorx > this.text[this.cursory].length ) this.cursorx = this.text[this.cursory].length;

}


guiText.prototype.draw = function()
{
  // text
  g_scene.ctx.font = String(this.textsize)+"px Georgia";
  g_scene.ctx.fillStyle = this.textclr;
  for ( y=0; y < this.text.length; y++)
    g_scene.ctx.fillText ( this.text[y], 0, (y+1)*this.textsize );

  // cursor
  g_painter.drawFill ( this.textWidth(), this.cursory*this.textsize, 2, this.textsize, "rgba(255,0,0,1)" );
}

