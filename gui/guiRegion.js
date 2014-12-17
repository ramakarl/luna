

function guiRegion( name )
{
  // All regions have this
  this.x = 0;
  this.y = 0;
  this.bClip = false;  
  this.bOverlay = false;
  this.scrollx=0;	// scrolling variables
  this.scrolly=0;
  this.width = 40;
  this.height = 40;  
  this.visible = true;    
  this.parent = null;
  this.guiChildren = [];  
  this.bgColor = "rgba(0,0,255,.1)";
  this.name = name;   

  this.transform       = [ [ 1, 0, 0], [0, 1, 0], [0, 0, 1] ];
  this.world_transform = [ [ 1, 0, 0], [0, 1, 0], [0, 0, 1] ];
  this.inv_transform   = [ [ 1, 0, 0], [0, 1, 0], [0, 0, 1] ];
  this.inv_world_transform = [ [ 1, 0, 0], [0, 1, 0], [0, 0, 1] ];

  //this.pickCallback = null;
}

guiRegion.prototype.init = function ( x, y, w, h )
{
  this.width = w;
	this.height = h;
	this.move ( x, y );
}

guiRegion.prototype.setClip = function ( b )
{
  this.bClip = b;
}

guiRegion.prototype.handleEvent = function(ev)
{
  if (this.parent)
    if ("handleEvent" in this.parent)
      this.parent.handleEvent(ev);
}
 
guiRegion.prototype.setSize = function( x1, y1, w, h )
{
  this.x = x1;
  this.y = y1;
  this.width = w;  
  this.height = h;
  this.move ( x1, y1);
}
guiRegion.prototype.setBackClr = function ( r, g, b, a )
{
  this.bgColor = "rgba("+Math.floor(r*255.0)+","+Math.floor(g*255.0)+","+Math.floor(b*255.0)+","+a+")";
}


/*
guiRegion.prototype.registerPickCallback = function(f)
{
  console.log("guiRegion, registering cb");
  console.log(f);

  this.pickCallback = f;
}
*/

guiRegion.prototype.setWorldMatrix = function ()
{
  // local transform
  
  this.transform     = [ [ 1, 0, this.x ],
					     [ 0, 1, this.y ],
                         [ 0, 0, 1 ] ];

  this.inv_transform = [ [ 1, 0, -this.x ],
					     [ 0, 1, -this.y ],
                         [ 0, 0, 1 ] ];

  if ( this.parent == null ) 
  {
    this.world_transform     = this.transform;
    this.inv_world_transform = this.inv_transform;
    return this.world_transform;
  }   
  this.world_transform     = numeric.dot ( this.parent.setWorldMatrix (), this.transform );   
  this.inv_world_transform = numeric.dot ( this.inv_transform, this.parent.inv_world_transform);
  return this.world_transform;
}

guiRegion.prototype.move = function ( x, y )
{
   this.x = x;
   this.y = y;
   this.setWorldMatrix ();
   console.log ( this.name + ": "+ this.transform[1][2] );
   
   for (var ind in this.guiChildren ) { 
		cx = this.guiChildren[ind].x;
		cy = this.guiChildren[ind].y;
		this.guiChildren[ind].move ( cx, cy );
   }
}

guiRegion.prototype.draw = function()
{
  g_painter.drawFill ( 10, 10, 20, 20, "rgba(255,255,0,1)" );
}

guiRegion.prototype.drawChildren = function( sx, sy )
{
  /* g_painter.drawRectangle( this.x, this.y, this.width, this.height, 
                           0, "rgb(0,0,0)", 
                           true, "rgba(0,0,0, 0.2)" );*/
  M = this.world_transform;  
  if ( this.bOverlay ) { sx=0; sy=0; }
  
  g_scene.ctx.save();
  
  // Clipping	
  if ( this.bClip ) {      
    g_scene.ctx.setTransform( M[0][0], M[1][0], M[0][1], M[1][1], M[0][2]-sx, M[1][2]-sy);     
    g_scene.ctx.beginPath();
    g_scene.ctx.rect ( 0, 0, this.width, this.height );      
    g_scene.ctx.closePath();
    //-- debug clipping (next 4 lines)
    //console.log ( "CLIP: " + this.name+ ":  " + M[0][2] + "," +M[1][2] + "," + M[0][0] + "," + M[1][1] );
    //g_scene.ctx.lineWidth = 4;
    //g_scene.ctx.stroke();
    //g_scene.ctx.lineWidth = 1;
    g_scene.ctx.clip ();
  }

  // Draw self 
  g_scene.ctx.setTransform( M[0][0], M[1][0], M[0][1], M[1][1], M[0][2]-this.scrollx-sx, M[1][2]-this.scrolly-sy);  
  this.draw ();  
  
  // Draw children
  var child = null;
  for (var ind in this.guiChildren ) {
    child = this.guiChildren[ind];
    if (child.visible) {	  
	  // background
      g_scene.ctx.fillStyle = child.bgColor;
      g_scene.ctx.fillRect ( child.x, child.y, child.width, child.height );
	  // child
      child.drawChildren( this.scrollx, this.scrolly );		
	  // border	  
	  if ( !child.bOverlay ) {
		  g_scene.ctx.beginPath();
		  g_scene.ctx.rect ( child.x, child.y, child.width, child.height );
		  g_scene.ctx.stroke ();
		  g_scene.ctx.closePath();
	  }
    }
  }   
 
  g_scene.ctx.restore();
}

// I don't think this is the greatest, but x,y are in canvas
// co-ordinates.  Apply the inverse transformation to x,y
// to transform them to local co-ordinates.
//
guiRegion.prototype.hitTest = function(x, y)
{
  // experimenting

  var u = numeric.dot( this.inv_world_transform, [x,y,1] );

  if ( (0 <= u[0]) && (u[0] <= this.width) &&
       (0 <= u[1]) && (u[1] <= this.height) )
  {

    for (var ind in this.guiChildren ) 
    {
      if (this.guiChildren[ind].visible) 
      {
        var r = this.guiChildren[ind].hitTest(x, y);
        if (r) return r;
      }
    }

    //console.log( "guiRegion: " + this.name + " hit\n");
    return this;
  }

  return null;
}

guiRegion.prototype.mouseDown = function( button, x, y )
{
  if (!this.visible) return false;
    
  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
    return false;
    
  // check moving - hit test title
  if ( y < 5 ) {    
    g_scene.eMode = 1;          // moving mode
    g_scene.eStart = [ x+this.x, y+this.y, this.x, this.y ];    // start of move (in parent coordinates)
    g_scene.setFocus ( this );    
    return true; 
  } 
  // check resize
  console.log ( "hit: "+ this.name+ ": "+x+", "+y +"  "+this.width +"," + this.height);
  if ( x > this.width -10 && y > this.height-10 ) {
    
    g_scene.eMode = 2;          // moving mode
    g_scene.eStart = [ x+this.x, y+this.y, this.width, this.height ];    // start of resize (in parent coordinates)
    g_scene.setFocus ( this );    
    return true; 
  } 
  
 // map coords for self
  var cx = x + 0;   // scrolling
  var cy = y + 0;
 
  // recursive check children
  var child = null;
  for (var ind in this.guiChildren ) {     
    child = this.guiChildren[ind];
    if ( child.mouseDown ( button, cx - child.x, cy - child.y ) ) {      
      return true;
    }
  }
  
  // check self for activity
  if ( this.OnMouseDown ( button, cx, cy ) ) {
     g_scene.setFocus ( this );
     return true;
  }
     
  return false;
}


guiRegion.prototype.mouseDrag = function( button, x, y )
{
  var dx = x - g_scene.eStart[0];
  var dy = y - g_scene.eStart[1];
  
  if (!this.visible) return false;
  
  if ( g_scene.eFocus == this ) {    
    var obj = g_scene.eFocus;    
    // if moving..
    if ( g_scene.eMode == 1 ) {      
      obj.setSize ( g_scene.eStart[2] + obj.x + dx, g_scene.eStart[3] + obj.y + dy, obj.width, obj.height );
      return true;    
    }
    // if resizing
    if ( g_scene.eMode == 2 ) {            
      obj.setSize ( obj.x, obj.y, g_scene.eStart[2] + obj.x + dx, g_scene.eStart[3] + obj.y + dy );
      return true;    
    }
	// check focus object first for drag
	if ( this.OnMouseDrag ( button, x, y, dx, dy ) )
      return true;
  }
  
  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
    return false;
  
  // map coords for self
  var cx = x + 0;
  var cy = y + 0;
  
  // recursive check children
  var child = null;
  for (var ind in this.guiChildren ) { 
    child = this.guiChildren[ind];
    if ( child.mouseDrag ( button, cx - child.x, cy - child.y ) ) {
      return true;
    }
  }
  
  // check self for activity
  if ( this.OnMouseDrag ( button, cx, cy, dx, dy ) ) {
     return true;
  }     
  return false;
}


guiRegion.prototype.mouseMove = function( button, x, y )
{
  var dx = x - g_scene.eStart[0];
  var dy = y - g_scene.eStart[1];
  
  if (!this.visible) return false;
 
  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
  
  // map coords for children  
  cx = x + this.x;
  cy = y + this.y;
  
  // recursive check children
  for (var ind in this.guiChildren ) { 
    if ( this.guiChildren[ind].mouseMove ( button, cx, cy ) ) {
      return true;
    }
  }
  
  // check self for activity
  if ( this.OnMouseMove ( button, cx, cy ) ) {
     return true;
  }     
  return false;
}



// virtual mouse functions 
//  (overridden by specific gui behavior)
guiRegion.prototype.OnMouseDown = function( button, x, y )
{
  return false;
}
guiRegion.prototype.OnMouseDrag = function( button, x, y, dx, dy )
{
  return false;
}
guiRegion.prototype.OnMouseMove = function( button, x, y, dx, dy )
{
  return false;
}



guiRegion.prototype.doubleClick = function( ev, x, y )
{

  r = this.hitTest(x, y);
  if (r == this) 
    return this;
  else if (r)
    return r.doubleClick(ev);

  return r;
}

guiRegion.prototype.mouseWheel = function(delta)
{
  console.log("dummy mousewheel");
}

guiRegion.prototype.mouseWheelXY = function(delta, x, y)
{

  r = this.hitTest(x, y);
  if (r == this) 
    return this;
  else if (r)
  {
    if (typeof r.mouseWheelXY !== 'undefined')
      return r.mouseWheelXY(delta, x, y);
  }

  return r;
}

guiRegion.prototype.addChild = function( child )
{
   this.guiChildren.push ( child );
   child.parent = this;
   child.setWorldMatrix();
}
