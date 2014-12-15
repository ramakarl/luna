

function lunaScene ( canvas, context, input, root ) {

  this.cvs = canvas;
  this.ctx = context;
  this.inp = input;
  this.root = root;  
  this.eMode = 0;             // edit mode
  this.eStart = [0,0,0,0];    // edit start
  this.eFocus = null;  
}

lunaScene.prototype.setFocus = function( obj ) {
   this.eFocus = obj;   
}