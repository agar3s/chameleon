var map,
    blockSize = 60,
    zoneActiveIndex = 0,
    speed = 2,
    sequenceIndex = 0;

//main container for the game
var stage = new Kinetic.Stage({
  id: 'main',
  container: 'container',
  width: 500,
  height: 500,
});

//theMap
var mapLayer = new Kinetic.Layer({
  id:'map'
});
var characterLayer = new Kinetic.Layer({
  id:'character'
});

//Map Class
var Map = function(width, height){
  this.width = width;
  this.height = height;
  this.zones = [];
};

var Zone = function(zone){
  this.tiles = zone.tiles;
  this.color = zone.color;
  this.rects = [];
};

//main Character
var chameleonBoy = new Kinetic.Circle({
  x: 70,
  y: 70,
  width: blockSize/2,
  height: blockSize/2,
  fill: '#69F4BD',
});

var life = new Kinetic.Rect({
  x: 0,
  y: 300,
  width: 300,
  height: blockSize/2,
  fill: 'rgb(255, 20, 0)',
});

var fly = new Kinetic.Rect({
  width: blockSize/5,
  height: blockSize/5,
  fill: "#FFFFFF"
});

stage.add(mapLayer);
stage.add(characterLayer);

//dinamic function to create maps
var buildZone = function(mapLayer, width, height, zone){
  zone.rects = [];
  for(var i = 0; i<height*width; i+=width){
    for(var j = 0; j<width; j++){
      if(zone.tiles[i+j]==1){
        var block = new Kinetic.Rect({
          x: blockSize*j,
          y: i*blockSize/width,
          width: blockSize,
          height: blockSize,
          fill: zone.color,
          visible: false
        });
        zone.rects.push(block);
        mapLayer.add(block);
      }
    }
  }
};

function loadMap(data){
  map = data;
  map.won = false;
  mapLayer.destroyChildren();
  characterLayer.destroyChildren();

  for (var i = data.zones.length - 1; i >= 0; i--) {
    buildZone(mapLayer, map.width, map.height, map.zones[i]);
  };
  characterLayer.add(chameleonBoy);
  characterLayer.add(life);
  chameleonBoy.setPosition(data.j*blockSize + blockSize/2, data.i*blockSize + blockSize/2);
  chameleonBoy.i = 1;
  chameleonBoy.j = 0;
  chameleonBoy.vulnerable = false;
  life.setWidth(300);

  fly.setPosition(data.gj*blockSize + blockSize/5, data.gi*blockSize + blockSize/5);
  fly.show();
  characterLayer.add(fly);

};

var isCollision = function(){
  return map.zones[zoneActiveIndex].tiles[chameleonBoy.i*map.width+chameleonBoy.j]==1;
};

var initZone = function(){
  var zoneActiveIndex = map.sequence[0];
  sequenceIndex = 0;
  for (var i = map.zones[zoneActiveIndex].rects.length - 1; i >= 0; i--) {
    map.zones[zoneActiveIndex].rects[i].show();
  };
  mapLayer.draw();
}


var toogleLayer = function(zoneIndex){
  if(zoneIndex==undefined){
    sequenceIndex++;
    if(sequenceIndex>=map.sequence.length){
      sequenceIndex=0;
    }
    zoneIndex = map.sequence[sequenceIndex];
  }
  if(zoneIndex==zoneActiveIndex){
    return;
  }
  var tween = new Kinetic.Tween({
    node: mapLayer,
    duration: 0.1,
    opacity: 0,
    easing: Kinetic.Easings.EaseOut,
  });

  tween.play();
  setTimeout(function(){
    for (var i = map.zones[zoneActiveIndex].rects.length - 1; i >= 0; i--) {
      map.zones[zoneActiveIndex].rects[i].hide();
    };
    mapLayer.draw();
    for (var i = map.zones[zoneIndex].rects.length - 1; i >= 0; i--) {
      map.zones[zoneIndex].rects[i].show();
    };
    tween.reverse();
    zoneActiveIndex = zoneIndex;
    chameleonBoy.vulnerable = isCollision();
  }, 100);
};

var checkCollision = function(){
  if(chameleonBoy.vulnerable){
    if(isCollision()){
      life.setWidth(life.getWidth()-5);
      if(life.getWidth()<=0){
        chameleonBoy.dead = true;
      }
    }else{
      chameleonBoy.vulnerable=false;
    }
  }
};

var checkFly = function(){
  var x = chameleonBoy.getAttr('x'),
      y = chameleonBoy.getAttr('y'),
      fx = fly.getAttr('x')+blockSize/10,
      fy = fly.getAttr('y')+blockSize/10;

  if(x-blockSize/4<fx&&x+blockSize/4>fx&&
    y-blockSize/4<fy&&y+blockSize/4>fy){
    fly.hide();
    console.log("Congratulations!");
    map.won=true;
  }
};

var move = function(xDir, yDir){
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');

  x+=xDir*speed;
  y+=yDir*speed;

  if(xDir==-1 && x/blockSize-1/4<chameleonBoy.j){
    chameleonBoy.j--;
  }
  if(xDir==1 && x/blockSize-3/4>chameleonBoy.j){
    chameleonBoy.j++;
  }
  if(yDir==-1 && y/blockSize-1/4<chameleonBoy.i){
    chameleonBoy.i--;
  }
  if(yDir==1 && y/blockSize-3/4>chameleonBoy.i){
    chameleonBoy.i++;
  }
  if(isCollision() || chameleonBoy.j<0 || chameleonBoy.j>=map.width ||
    chameleonBoy.i>=map.height || chameleonBoy.i<0){
    x+=xDir*-1*speed;
    y+=yDir*-1*speed;
    chameleonBoy.j+=xDir*-1;
    chameleonBoy.i+=yDir*-1;
  }
  chameleonBoy.setPosition(x, y);
  checkCollision();
  checkFly();
};

var moveFly = function(){
  var x = fly.getAttr('x');
  var y = fly.getAttr('y');
  fly.setPosition(x-0.5+Math.random(), y-0.5+Math.random());
};