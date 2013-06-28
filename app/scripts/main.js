var stage = new Kinetic.Stage({
  id: 'main',
  container: 'container',
  width: 800,
  height: 600,
});

var layer = new Kinetic.Layer({
  id:'layer1'
});

var layer2 = new Kinetic.Layer({
  id:'layer2'
});

// add the shape to the layer

var blockSize=60,
    map1= {
      width:5,
      height:3,
      tiles:'10101'+
            '00100'+
            '10101',
      rects:[],
      visible: false
    },
    map2= {
      width:5,
      height:3,
      tiles:'11111'+
            '10001'+
            '11111',
      rects:[],
      visible: false
    }

var rect = new Kinetic.Rect({
  x: 0,
  y: 70,
  width: blockSize/2,
  height: blockSize/2,
  fill: 'rgb(100, 255, 255)',
});
var life = new Kinetic.Rect({
  x: 0,
  y: 300,
  width: 300,
  height: blockSize/2,
  fill: 'rgb(255, 20, 0)',
});
var loadMap = function(layer, map){
  for(var i = 0; i<map.height*map.width; i+=map.width){
    for(var j = 0; j<map.width; j++){
      if(map.tiles[i+j]==1){
        var block = new Kinetic.Rect({
          x: blockSize*j,
          y: i*blockSize/map.width,
          width: blockSize,
          height: blockSize,
          fill: 'rgb(200,200,180)'
        });
        map.rects.push(block);
        layer.add(block);
      }
    }
  }
};
loadMap(layer, map1);
loadMap(layer, map2);
map1.visible = false;
map2.visible = true;
var log = new Kinetic.Text({
    text:'ola ke ase',
    x: 100,
    y: 200,
    stroke: 'rgb(100,100,200)'
});
// add the layer to the stage
layer.add(rect);
layer.add(log);
layer.add(life);
stage.add(layer);

gKeys.init();

context = document.getElementsByTagName('canvas')[0].getContext('2d');
context.globalCompositeOperation = "lighter";

myKeys = gKeys.keys;

var isCollision = function(){
  if(map1.visible){
    return map1.tiles[rect.i*map1.width+rect.j]==1;
  }else{
    return map2.tiles[rect.i*map2.width+rect.j]==1;
  }
};

var toogleLayer = function(){
  if(map1.visible){
    for (var i = map1.rects.length - 1; i >= 0; i--) {
      map1.rects[i].hide();
    };
    for (var i = map2.rects.length - 1; i >= 0; i--) {
      map2.rects[i].show();
    };
    map1.visible = false;
    map2.visible = false;
  } else {
    for (var i = map2.rects.length - 1; i >= 0; i--) {
      map2.rects[i].hide();
    };
    for (var i = map1.rects.length - 1; i >= 0; i--) {
      map1.rects[i].show();
    };
    map2.visible = false;
    map1.visible = true;
  }
  rect.vulnerable = isCollision();
}
toogleLayer();
gKeys.keyDown(function(keys){
  if(myKeys.SPACE.down){
    toogleLayer();
  }
});


rect.i = 1;
rect.j = 0;
rect.vulnerable = false;

var anim = new Kinetic.Animation(function(frame) {
  var time = frame.time,
      timeDiff = frame.timeDiff,
      frameRate = frame.frameRate;
  var x = rect.getAttr('x'),
      y = rect.getAttr('y');

  if(myKeys.LEFT.down){
    x -=2;
    if(x/blockSize<rect.j){
      rect.j--;
      if(rect.j<0 || isCollision()){
        x+=2;
        rect.j++;
      }else{
        log.setText('row: '+rect.i+' col: '+rect.j);
      }
    }
  }else if(myKeys.RIGHT.down){
    x +=2;
    if(x/blockSize-1/2>rect.j){
      rect.j++;
      if(rect.j>=map1.width || isCollision()){
        x-=2;
        rect.j--;
      }else{
        log.setText('row: '+rect.i+' col: '+rect.j);
      }
    }
  }else if(myKeys.UP.down){
    y-=2;
    if(y/blockSize<rect.i){
      rect.i--;
      if(rect.i<0||isCollision()){
        y+=2;
        rect.i++;
      }else{
        log.setText('row: '+rect.i+' col: '+rect.j);
      }
    }
  }else if(myKeys.DOWN.down){
    y+=2;
    if(y/blockSize-1/2>rect.i){
      rect.i++;
      if(rect.i>=map1.height||isCollision()){
        y-=2;
        rect.i--;
      }else{
        log.setText('row: '+rect.i+' col: '+rect.j);
      }
    }
  }
  if(rect.vulnerable){
    if(isCollision()){
      life.setWidth(life.getWidth()-5);
      if(life.getWidth()<=0){
        log.setText('you are dead!!!!!! refresh the page');
        anim.stop();
      }
    }else{
      rect.vulnerable=false;
    }
  }
  rect.setAttr('x', x);
  rect.setAttr('y', y);
  // update stuff
}, layer);

anim.start();
