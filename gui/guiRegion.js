

function guiRegion( name )
{
  // All regions have this
  this.x = 0;
  this.y = 0;
  this.bClip = false;
  this.width = 40;
  this.height = 40;
  this.visible = true;    
  this.parent = null;
  this.guiChildren = [];  
  this.bgColor = "rgba(230,230,255, 0.8)";
  this.name = name;   

  // Property flags
  //
  this.prop_flag_move = true;
  this.prop_flag_resize = true;


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
  this.bgColor = "rgba("+(r*255.0)+","+(g*255.0)+","+(b*255.0)+","+a+")";
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
    this.world_transform     = [ [ 1, 0, this.x ], 
                                 [ 0, 1, this.y ], 
                                 [ 0, 0, 1 ] ];
    this.inv_world_transform = [ [ 1, 0, -this.x ], 
                                 [ 0, 1, -this.y ], 
                                 [ 0, 0, 1 ] ];

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

   for (var ind in this.guiChildren ) { 
		cx = this.guiChildren[ind].x;
		cy = this.guiChildren[ind].y;
		this.guiChildren[ind].move ( cx, cy );
   }
}

guiRegion.prototype.draw = function()
{
  //g_painter.drawFill( 0, 0, this.width, this.height, this.bgColor );
  //g_painter.drawRect( 0, 0, this.width, this.height, 3, this.bgColor );

  var c = "rgba(128,110,141,0.9)";
  g_painter.drawFillRect( 0, 0, this.width, this.height, this.bgColor, 2, c );
}

guiRegion.prototype.drawChildren = function()
{
  /* g_painter.drawRectangle( this.x, this.y, this.width, this.height, 
                           0, "rgb(0,0,0)", 
                           true, "rgba(0,0,0, 0.2)" );*/

  M = this.world_transform;
  g_scene.ctx.setTransform( M[0][0], M[1][0], M[0][1], M[1][1], M[0][2], M[1][2] );  
  this.draw ();			

  if ( this.bClip ) {
    //--- Clipping	
    g_scene.ctx.save();
    g_scene.ctx.beginPath();
    g_scene.ctx.rect ( 0, 0, this.width, this.height );      
    g_scene.ctx.closePath();
    //-- debug clipping (next 4 lines)
    //console.log ( "CLIP: " + this.name+ ":  " + M[0][2] + "," +M[1][2] + "," + M[0][0] + "," + M[1][1] );
    //this.context.lineWidth = 4;
    //this.context.stroke();
    //this.context.lineWidth = 1;
    g_scene.ctx.clip ();
  }
						   
  for (var ind in this.guiChildren ) {
    if (this.guiChildren[ind].visible) {		  
      this.guiChildren[ind].drawChildren();		
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

guiRegion.prototype.mouseUp = function( button, x, y )
{
  g_scene.eMode = 0;

  var cx = x + 0;   // scrolling
  var cy = y + 0;

  // recursive check children
  var child = null;
  for (var ind in this.guiChildren ) {     
    child = this.guiChildren[ind];
    if ( child.mouseUp ( button, cx - child.x, cy - child.y ) ) {      
      return true;
    }
  }


  // check self for activity
  if ( this.OnMouseUp( button, cx, cy ) ) {
     return true;
  }

  return false;
}


guiRegion.prototype.mouseDown = function( button, x, y )
{
  if (!this.visible) return false;

  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
    return false;

  if (this.prop_flag_move) {

    // check moving - hit test title
    if ( y < 15 ) {    
      g_scene.eMode = 1;          // moving mode
      g_scene.eStart = [ x+this.x, y+this.y, this.x, this.y ];    // start of move (in parent coordinates)
      g_scene.setFocus ( this );    
      return true; 
    } 
  }


  if (this.prop_flag_resize) {
    // check resize
    console.log ( "hit: "+ this.name+ ": "+x+", "+y +"  "+this.width +"," + this.height);
    if ( x > this.width -25 && y > this.height-25 ) {

      g_scene.eMode = 2;          // moving mode
      g_scene.eStart = [ x+this.x, y+this.y, this.width, this.height ];    // start of resize (in parent coordinates)
      g_scene.setFocus ( this );    
      return true; 
    } 

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
      if (this.prop_flag_move) {
        obj.setSize ( g_scene.eStart[2] + obj.x + dx, g_scene.eStart[3] + obj.y + dy, obj.width, obj.height );
      }
      return true;    
    }

    // if resizing
    if ( g_scene.eMode == 2 ) {            
      if (this.prop_flag_resize) {
        obj.setSize ( obj.x, obj.y, g_scene.eStart[2] + obj.x + dx, g_scene.eStart[3] + obj.y + dy );
      }
      return true;    
    }

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
  if ( this.OnMouseDrag ( button, cx, cy ) ) {
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

guiRegion.prototype.OnMouseUp = function( button, x, y )
{
  return false;
}

guiRegion.prototype.OnMouseDrag = function( button, x, y )
{
  return false;
}

guiRegion.prototype.OnMouseMove = function( button, x, y )
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
