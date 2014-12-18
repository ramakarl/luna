
function lunaScene ( canvas, context, input, root ) {

  this.cvs = canvas;
  this.ctx = context;
  this.inp = input;
  this.root = root;  
  this.eMode = 0;             // edit mode
  this.eStart = [0,0,0,0];    // edit start
  this.eFocus = null;  
  this.SX = 0;
  this.SY = 0;
  this.eventCallback = null;
}
lunaScene.prototype.setFocus = function( obj ) {
  this.eFocus = obj;   
}
lunaScene.prototype.setCallback = function ( callbk )
{
  this.eventCallback = callbk;  
}


function Event( obj, name, type, dest, callbk )
{
  this.obj = obj;
  this.name = name;
  this.type = type;
  this.dest = dest;
  this.callbk = callbk;
  this.payload = [];
  this.pos = -1;
}

Event.prototype.attach = function ( val )
{
  this.payload.push ( val );
  this.pos++;
}

Event.prototype.startRead = function ()
{
  this.pos = 0;
}

Event.prototype.retrieve = function ( val )
{
  return this.payload[ this.pos++];
}

Event.prototype.retrieveInt = function ( val )
{
  return Number( this.payload[ this.pos++] );
}

Event.prototype.retrieveStr = function ( val )
{
  return String( this.payload[ this.pos++] );
}

function sendEvent ( e )
{
  // console.log ( "send: " + e.name + " from " + e.obj.name );

  // Luna event passing
  // Rule 1 - Try parent first
  if ( e.obj != null && e.obj.parent != null ) {     
     e.startRead ();
     if ( e.obj.parent.OnEvent( e ) ) 
     {
       return true;
     }
  }
  // Rule 2 - Try target name
  // .. not yet implemented ..

  // Rule 3 - Try custom callback
  if ( e.callbk != null ) {
     e.startRead ();
     if ( e.callbk ( e ) ) 
     {
       return true;
     }
  }

  // Rule 4 - Go to luna global
  if ( g_scene.eventCallback != null ) {
     e.startRead ();
     if ( g_scene.eventCallback ( e ) ) 
     {
       return true; 
     }
  }
  return false;
}

function createEvent ( obj, name, type, dest, callbk )
{
  var e = new Event( obj, name, type, dest, callbk );
  return e;  
}
