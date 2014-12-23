
function guiText( name )
{
  this.constructor(name);

  //this.text = "Hello world!";
  this.text = [ "Hello ...", "there!", "^-^" ] ;
  this.textsize = 20;
  this.textclr = "black";

  this.cursorx = 0;
  this.cursory = 0;
  this.cursorline = 0;

  this.show_cursor = true;

  this.font = String(this.textsize) + "px Georgia";
}

guiText.inherits( guiRegion );


guiText.prototype.OnMouseDown = function( button, x, y ) 
{
  q = Math.floor( y / this.textsize );

  if (q < this.text.length) {

    var w = g_scene.ctx.measureText( this.text[q] ).width;
    if ( x > w ) {
      this.cursorx = this.text[q].length;
      this.cursory = q;
      return true;
    }

    this.cursorx = 0;
    g_scene.ctx.font = this.font;
    var dms = g_scene.ctx.measureText( this.text[q].substring(0,this.cursorx) ).width;
    while ( x > dms && this.cursorx < this.text[q].length ) {
      this.cursorx++;
      dms = g_scene.ctx.measureText( this.text[q].substring(0,this.cursorx) ).width;
    }
    this.cursorx--;
    this.cursory = q;

  }

  return true;
}


guiText.prototype.OnKeyPress = function( key, extd )
{

  switch ( key ) {
  case 37:  this.moveCursor(-1, 0);   break;  // left
  case 39:  this.moveCursor(+1, 0);   break;  // right
  case 38:  this.moveCursor( 0,-1);   break;  // up
  case 40:  this.moveCursor( 0,+1);   break;  // down

  // return
  case 13:
    var cx = this.cursorx;
    var cy = this.cursory;
    var w = this.text[cy].length;

    var a = this.text[cy].substring( 0, cx );
    var b = this.text[cy].substring( cx, w );

    this.text.splice( cy+1, 0, "" );
    this.text[cy] = a;
    this.text[cy+1] = b;
    this.moveCursor(0,+1);
    this.cursorx = 0;
    break;

  case 36:    // home
     this.cursorx = 0;	
     break;

  case 35:    // end
     this.cursorx = this.text[ this.cursory ].length;
     break;

  case 8:     // backspace

     var cx = this.cursorx;
     var cy = this.cursory;

     if ((cx==0) && (cy>0)) {
       var w = this.text[cy-1].length;
       this.text[cy-1] = this.text[cy-1] + this.text[cy];
       this.text.splice( cy, 1 );

       this.cursorx = w;
       this.cursory--;
       break;
     }

     var p = this.cursory;
     this.text[p] = this.text[p].substring (0, this.cursorx-1) + this.text[p].substring( this.cursorx );
     this.moveCursor ( -1, 0 );
     break;

  case 46:    // delete
     var p = this.cursory;
     this.text[p] = this.text[p].substring (0, this.cursorx) + this.text[p].substring( this.cursorx+1 );
     break;

  default:
     var p = this.cursory;
     if ( extd==0 ) {
        this.text[p] =
          this.text[p].substring(0,this.cursorx) +
          String.fromCharCode(key) +
          this.text[p].substring(this.cursorx);
        this.moveCursor ( 1, 0 );
     }
     break;

  };

}

guiText.prototype.moveCursor = function(dx, dy)
{
  this.cursorx += dx;
  this.cursory += dy;
  if ( this.cursory >= this.text.length ) this.cursory = this.text.length-1;
  if ( this.cursorx < 0 ) this.cursorx = 0;
  if ( this.cursorx > this.text[ this.cursory ].length )
    this.cursorx = this.text[ this.cursory ].length;
  if ( this.cursory < 0 ) this.cursory = 0;
}


guiText.prototype.draw = function()
{

  // text
  g_scene.ctx.font = this.font;
  g_scene.ctx.fillStyle = this.textclr;
  for (var i=0; i<this.text.length; i++) {
    var yy = (i+1) * this.textsize ;
    g_scene.ctx.fillText( this.text[i], 0, yy );
  }

  // cursor
  if (this.show_cursor) {
    var p = this.cursory;
    var dms = g_scene.ctx.measureText( this.text[p].substring(0,this.cursorx) ).width;
    g_painter.drawFill ( dms, this.cursory*this.textsize, 2, this.textsize, "rgba(255,0,0,1)" );
  }

}

