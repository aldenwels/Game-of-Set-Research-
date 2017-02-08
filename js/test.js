function lineRect(){
  this.drawShape = function(){
    beginShape();
    vertex(30,20);
    vertex(20,30);
    vertex(10,40);
    vertex(50,40);
    vertex(40,30);
    vertex(20,30);
    vertex(40,30);
    endShape(CLOSE);
  };
}
var rectangle = new lineRect();

function setup(){
  var myCanvas = createCanvas(600, 400);
}
function draw() {
  rectangle.drawShape();
}


rect, line, blue, 1
