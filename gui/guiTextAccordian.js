
function guiTextAccordian( name )
{
  this.constructor(name);

  this.accordian = [ this.accordianElement("PARENT"), this.accordianElement("sibling") ];
  this.textsize = 20;
  this.textclr = "gray";

  //testing
  this.accordian[0].children = [
    this.accordianElement("child0"),
    this.accordianElement("child1"),
    this.accordianElement("ygM")
  ];

  this.accordian[0].children[1].children = [
    this.accordianElement("grandchild"),
  ];

  this.cursorx = 0;
  this.cursory = 0;
  this.cursorline = 0;

  this.highlightColor = "rgba(255,255,255,0.5)";
  this.scratchElement = null;

  this.show_collapse_widget = true;
  this.collapse_widget_size = 10;

  this.font = String(this.textsize) + "px Courier New";
  this.fudge = 5;
}
guiTextAccordian.inherits( guiRegion );

guiTextAccordian.prototype.accordianElement = function( s ) {
  s = ( (typeof s === "undefined") ? "" : s );
  var obj = { "text" : s, "collapsed" : true, "children" : [], "highlight" : false }
  return obj;
}

guiTextAccordian.prototype.height_r = function( text_ele ) {
  var h = 1;
  if ( !text_ele.collapsed ) {
    for (var ind=0; ind<text_ele.children.length; ind++) {
      h += this.height_r( text_ele.children[ind] );
    }
  }
  return h;
}

// In single units
guiTextAccordian.prototype.textVisibleHeight = function() {
  var h = 0;
  for (var ind=0; ind<this.accordian.length; ind++) {
    h += this.height_r( this.accordian[ind] );
  }
  return h;
}

guiTextAccordian.prototype.findTextXY = function( px, py ) {
  var q = Math.floor( py / this.textsize );

  if (q < this.text.length) {

    var w = g_scene.ctx.measureText( this.text[q] ).width;
    if ( px > w ) {
      return [ this.text[q].length, q ];
      return true;
    }

    var cx = 0;
    g_scene.ctx.font = this.font;
    var dms = g_scene.ctx.measureText( this.text[q].substring(0,cx) ).width;
    while ( (px > dms) && (cx < this.text[q].length) ) {
      cx++;
      dms = g_scene.ctx.measureText( this.text[q].substring(0,cx) ).width;
    }
    cx--;
    return [ cx, q ];
  }

  return [-1,-1];
}

guiTextAccordian.prototype.hit_r = function( ele, h )  {
  var r = { "found" : false, "height" : 0 };
  if ( h < r.height ) return r; 
  if ( r.height == h ) {
    r.found = true;
    r.element = ele;
    r.height += 1;
    return r;
  }

  r.height += 1;

  if (!ele.collapsed) {
    for (var ind=0; ind<ele.children.length; ind++) {
      var rr = this.hit_r( ele.children[ind], h - r.height );
      if (rr.found) return rr;
      r.height += rr.height;
    }
  }

  return r;
}


guiTextAccordian.prototype.OnMouseDown = function( button, x, y ) 
{

  var q = Math.floor( y / this.textsize );
  var h = this.textVisibleHeight();
  if (q > h) return;

  console.log("q", q, "h", h, button, x, y, this.textsize );

  var cur_h = 0;
  for (var ind=0; ind<this.accordian.length; ind++) {
    var r = this.hit_r( this.accordian[ind], q-cur_h );
    cur_h += r.height;
    if (r.found) break;
    if (cur_h > q) break;
  }

  if (r.found) {
    console.log("!!", r, r.element.text);

    if (this.scratchElement) {
      this.scratchElement.highlight = false;
    }

    r.element.collapsed = !r.element.collapsed;
    r.element.highlight = true;

    this.scratchElement = r.element;

  }

  return true;
}

guiTextAccordian.prototype.draw_collapse_widget  = function( ele, x, y ) {
  g_painter.drawRect( x - 5, y + 5 , 10, 10, this.textclr );

  g_scene.ctx.fillStyle = this.textclr;
  if (ele.children.length == 0) {
    g_painter.drawFill( x-1, y+9, 2, 2, this.textclr );
  } else {

    if (ele.collapsed) {
      g_painter.line( x-3, y+10, x+3, y+10, this.textclr, 2);
      g_painter.line( x, y+7, x, y+13, this.textclr, 2);
    } else {
      g_painter.line( x-3, y+10, x+3, y+10, this.textclr, 2);
    }
  }
}

guiTextAccordian.prototype.draw_r = function( ele, h, indent )
{
  var cur_h = 1;
  var yyb = h * this.textsize + this.fudge;
  var yy = (h+1) * this.textsize ;
  var xx = 10 * indent;

  g_scene.ctx.fillStyle = this.textclr;

  if (this.show_collapse_widget) {
    this.draw_collapse_widget( ele, xx, yyb );
    xx += this.collapse_widget_size;
  }

  g_scene.ctx.fillText( ele.text, xx, yy );

  if (ele.highlight) {
    var w = this.width;
    g_painter.drawFill( 0, yyb, w, this.textsize, this.highlightColor );
  }

  if (!ele.collapsed) {
    for (var ind=0; ind<ele.children.length; ind++) {
      cur_h += this.draw_r( ele.children[ind], cur_h + h, indent+1 );
    }
  }

  return cur_h;
}


guiTextAccordian.prototype.draw = function()
{

  // text
  g_scene.ctx.font = this.font;
  g_scene.ctx.fillStyle = this.textclr;

  var cur_h = 0;
  for (var ind=0; ind<this.accordian.length; ind++) {
    cur_h += this.draw_r( this.accordian[ind], cur_h, 0 );
  }

}

