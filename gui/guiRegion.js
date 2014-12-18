

function guiRegion( name )
{
  // All regions have this
  this.x = 0;
  this.y = 0;
  this.bClip = false;  
  this.bOverlay = false;
  this.bBorder = true;
  this.bBackground = true;
  this.scrollx=0;	// scrolling variables
  this.scrolly=0;
  this.width = 40;
  this.height = 40;  
  this.visible = true;    
  this.parent = null;
  this.guiChildren = [];  
  this.bgColor = "rgba(0,0,255,.1)";
  this.name = name;   

  this.window_head_size = 15;
  this.window_apron_size = 25;

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

guiRegion.prototype.OnEvent = function( e )
{
   if ( e.name=="scroll" ) {
      this.scrolly = e.retrieveInt();
      return true;
   }
   return false;
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

   for (var ind in this.guiChildren ) { 
		cx = this.guiChildren[ind].x;
		cy = this.guiChildren[ind].y;
		this.guiChildren[ind].move ( cx, cy );
   }
}

guiRegion.prototype.draw = function()
{
}

guiRegion.prototype.drawChildren = function( sx, sy )
{
  M = this.world_transform;  
  if ( this.bOverlay ) { sx=0; sy=0; }

  g_scene.ctx.save();

  // Clipping
  if ( this.bClip ) {      
    g_scene.ctx.setTransform( M[0][0], M[1][0], M[0][1], M[1][1], M[0][2]-sx, M[1][2]-sy);     
    g_scene.ctx.beginPath();
    g_scene.ctx.rect ( -1, -1, this.width+2, this.height+2 ); 
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
  if (this.bBackground) {
    g_scene.ctx.fillStyle = this.bgColor;
    g_scene.ctx.fillRect ( this.scrollx, this.scrolly, this.width, this.height );
  }
  this.draw ();  

  // Draw children
  var child = null;
  for (var ind in this.guiChildren ) {
    child = this.guiChildren[ind];
    if (child.visible) 
      child.drawChildren( this.scrollx, this.scrolly );    
  }
  // Draw border
  if ( !this.bOverlay ) {
    if (this.bBorder) {
      g_scene.ctx.beginPath();
      g_scene.ctx.rect ( this.scrollx, this.scrolly, this.width, this.height );      
      g_scene.ctx.lineWidth = 1;        
      g_scene.ctx.strokeStyle = 'rgba(150,150,150,1)';      
      if ( g_scene.eFocus == this ) g_scene.ctx.strokeStyle = 'rgba(50,50,50,1)';      
      g_scene.ctx.stroke();
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
  if (!this.visible) return false;

  if ( g_scene.eFocus != null ) {    
    // clear edit state (move or resize)
    g_scene.eMode = 0;    
    // check focus object first for drag
    if ( g_scene.eFocus.OnMouseUp ( button, x, y ) )
      return true;
  }
  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
    return false;

  // map coords for self
  var cx = x + this.scrollx;
  var cy = y + this.scrolly;

// recursive check children
  var child = null;
  var adjx, adjy;
  for (var ind in this.guiChildren ) { 
    child = this.guiChildren[ind];
    if ( this.hasParent(g_scene.eFocus, child) ) {     
     adjx = 0; adjy = 0;
     if ( child.bOverlay == true ) { adjx=this.scrollx; adjy=this.scrolly; }
     if ( child.mouseUp( button, cx -child.x - adjx, cy -child.y - adjy ) ) 
       return true;
    }
  }

  // check self for activity
  if ( this.OnMouseUp ( button, cx, cy ) ) {
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
    //if ( y < 15 ) {    
    if ( y < this.window_head_size ) {    
      g_scene.eMode = 1;          // moving mode
      g_scene.eStart = [ x+this.x, y+this.y, this.x, this.y ];    // start of move (in parent coordinates)
      g_scene.setFocus ( this );    
      return true; 
    } 
  }

  if (this.prop_flag_resize) {
    // check resize
    console.log ( "hit: "+ this.name+ ": "+x+", "+y +"  "+this.width +"," + this.height);
    if ( x > this.width -this.window_apron_size && y > this.height-this.window_apron_size) {
      g_scene.eMode = 2;          // moving mode
      g_scene.eStart = [ x+this.x, y+this.y, this.width, this.height ];    // start of resize (in parent coordinates)
      g_scene.setFocus ( this );    
      return true; 
    } 
  }

 // map coords for self
  var cx = x + this.scrollx;   // scrolling
  var cy = y + this.scrolly;
 
  g_scene.setFocus ( this );

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
     return true;
  }
  return false;
}

guiRegion.prototype.hasParent = function ( child, target )
{
  if ( child == null || child==target ) return true;
  var curr = child.parent;
  while ( curr != null ) {
    if (curr==target) return true;
	curr = curr.parent;
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
	  if ( this.OnMouseDrag ( button, x, y ) )
      return true;
  }

  // hit test self
  if ( x < 0 || y < 0 || x > this.width || y > this.height ) 
    return false;

  // map coords for self
  var cx = x + this.scrollx;
  var cy = y + this.scrolly;

  // recursive check children
  var child = null;
  var adjx, adjy;
  for (var ind in this.guiChildren ) { 
    child = this.guiChildren[ind];
    if ( this.hasParent(g_scene.eFocus, child) ) {     
     adjx = 0; adjy = 0;
     if ( child.bOverlay == true ) { adjx=this.scrollx; adjy=this.scrolly; }
	   if ( child.mouseDrag ( button, cx -child.x - adjx, cy -child.y - adjy ) ) 
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
  cx = x + this.scrollx;
  cy = y + this.scrolly;

  // recursive check children
  var child = null;
  var adjx, adjy;
  for (var ind in this.guiChildren ) { 
    child = this.guiChildren[ind];
    if ( this.hasParent(g_scene.eFocus, child) ) {     
     adjx = 0; adjy = 0;
     if ( child.bOverlay == true ) { adjx=this.scrollx; adjy=this.scrolly; }
	   if ( child.mouseMove ( button, cx -child.x - adjx, cy -child.y - adjy ) ) 
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
