
function guiDebug( name )
{
  this.name = name;   
  this.value = 0;

  this.r = 128;
  this.g = 128;
  this.b = 128;
  this.a = 0.25;
}
guiDebug.inherits( guiRegion );


guiDebug.prototype.OnEvent = function( ev ) {

  // console.log("guiDebug, got event:", ev );

  if (ev.name == "spinner") {
    var v = ev.retrieve();
    this.r = Math.floor(255.9*v);
  }

  if (ev.name == "slider") {
    var v = ev.retrieve();
    this.g = Math.floor(255.9*v);
  }

  if (ev.name == "button") {
    var v = ev.retrieve();
    if (v) {
      this.a = 0.75;
    } else {
      this.a = 0.25;
    }
  }



  this.value = ev.retrieve();
}

guiDebug.prototype.draw = function() {
  var r = this.r;
  var g = this.g;
  var b = this.b;
  var a = this.a;
  var rgba = "rgba(" + String(r) + "," + String(g) + "," + String(b) + "," + String(a) + ")";
  g_painter.drawFill( 10, 10, 30, 30, rgba);
}


