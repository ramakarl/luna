

function guiRegion( name, context )
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
  this.context = context;

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
   g_painter.drawFill( 0, 0, this.width, this.height, this.bgColor );
}

guiRegion.prototype.drawChildren = function()
{
  /* g_painter.drawRectangle( this.x, this.y, this.width, this.height, 
                           0, "rgb(0,0,0)", 
                           true, "rgba(0,0,0, 0.2)" );*/
  
  M = this.world_transform;
  g_painter.context.setTransform( M[0][0], M[1][0], M[0][1], M[1][1], M[0][2], M[1][2] );  
  this.draw ();			
  
  if ( this.bClip ) {
  //--- Clipping	
    this.context.save();
    this.context.beginPath();
	this.context.rect ( 0, 0, this.width, this.height );      
    this.context.closePath();
	//-- debug clipping (next 4 lines)
	console.log ( "CLIP: " + this.name+ ":  " + M[0][2] + "," +M[1][2] + "," + M[0][0] + "," + M[1][1] );
	//this.context.lineWidth = 4;
	//this.context.stroke();
	//this.context.lineWidth = 1;
    this.context.clip ();
  }
						   
  for (var ind in this.guiChildren ) {
    if (this.guiChildren[ind].visible) {	
	    console.log ( "DRAW: " + this.guiChildren[ind].name	);
        this.guiChildren[ind].drawChildren();		
	}
  }
  console.log ( "restore" );
  this.context.restore();
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
  r = this.hitTest(x, y);
  if (r == this) 
    return this;
  else if (r)
  {
    return r.mouseDown(button, x, y);
  }

  return r;
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
