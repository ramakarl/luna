
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


function Event( name, type, dest, callbk )
{
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
Event.prototype.retrieveInt = function ( val )
{
  return Number( this.payload[ this.pos++] );
}
Event.prototype.retrieveStr = function ( val )
{
  return String( this.payload[ this.pos++] );
}


lunaScene.prototype.sendEvent = function( obj, e )
{
  console.log ( "send: " + obj.name +" " + e.name );

  // Luna event passing
  // Rule 1 - Try parent first
  if ( obj.parent != null ) {     
     e.startRead ();
     if ( obj.parent.OnEvent( e ) ) 
        return true;
  }
  // Rule 2 - Try target name
  // .. not yet implemented ..

  // Rule 3 - Try custom callback
  if ( e.callbk != null ) {
     e.startRead ();
     if ( e.callbk ( e ) ) 
       return true;
  }

  // Rule 4 - Go to luna global
  if ( g_scene.eventCallback != null ) {
     e.startRead ();
     if ( g_scene.eventCallback ( e ) ) 
       return true; 
  }
  return false;
}

lunaScene.prototype.createEvent = function ( name, type, dest, callbk )
{
  var e = new Event( name, type, dest, callbk );
  return e;  
}