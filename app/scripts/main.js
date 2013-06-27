var stage = new Kinetic.Stage({
  id: 'main',
  container: 'container',
  width: 800,
  height: 600,
});

var layer = new Kinetic.Layer({
  id:'layer1'
});

var rect = new Kinetic.Rect({
  x: 0,
  y: 70,
  width: 100,
  height: 50,
  fill: 'rgba(100, 255, 255, 0.3)',
});


var rect2 = new Kinetic.Rect({
  x: 700,
  y: 100,
  width: 100,
  height: 50,
  fill: 'rgba(255, 10, 255, 0.3)',
});

// add the shape to the layer
layer.add(rect);
layer.add(rect2);

// add the layer to the stage
stage.add(layer);
gKeys.init();

context = document.getElementsByTagName('canvas')[0].getContext('2d');
context.globalCompositeOperation = "lighter";

myKeys = gKeys.keys;

var anim = new Kinetic.Animation(function(frame) {
  var time = frame.time,
      timeDiff = frame.timeDiff,
      frameRate = frame.frameRate;
  var x = rect.getAttr('x'),
      x2 = rect2.getAttr('x');
  if(myKeys.LEFT.down){
    rect.setAttr('x', x+2);
    rect2.setAttr('x', x2-2);
  }else if(myKeys.RIGHT.down){
    rect.setAttr('x', x-2);
    rect2.setAttr('x', x2+2);
  }

  // update stuff
}, layer);

anim.start();
