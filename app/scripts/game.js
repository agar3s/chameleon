var map;
var blockSize = 60;
var zoneActiveIndex = 0;

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
  this.rects = [];
};

//main Character
var chameleonBoy = new Kinetic.Rect({
  x: 0,
  y: 70,
  width: blockSize/2,
  height: blockSize/2,
  fill: 'rgb(170, 170, 50)',
});

var life = new Kinetic.Rect({
  x: 0,
  y: 300,
  width: 300,
  height: blockSize/2,
  fill: 'rgb(255, 20, 0)',
});


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
          fill: 'rgb(0,60,180)',
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
  mapLayer.destroyChildren();
  for (var i = data.zones.length - 1; i >= 0; i--) {
    buildZone(mapLayer, map.width, map.height, map.zones[i]);
  };
  characterLayer.add(chameleonBoy);
  characterLayer.add(life);
  chameleonBoy.setPosition(0, blockSize);
  chameleonBoy.i = 1;
  chameleonBoy.j = 0;
  chameleonBoy.vulnerable = false;
  life.setWidth(300);
};

var isCollision = function(){
  return map.zones[zoneActiveIndex].tiles[chameleonBoy.i*map.width+chameleonBoy.j]==1;
};

var initZone = function(zoneIndex){
  var zoneActiveIndex = zoneIndex;
  for (var i = map.zones[zoneIndex].rects.length - 1; i >= 0; i--) {
    map.zones[zoneIndex].rects[i].show();
  };
  mapLayer.draw();
}

var toogleLayer = function(zoneIndex){

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
    color = Kinetic.Util.getRandomColor();
    for (var i = map.zones[zoneIndex].rects.length - 1; i >= 0; i--) {
      map.zones[zoneIndex].rects[i].setFill(color);
      map.zones[zoneIndex].rects[i].show();
    };
    tween.reverse();
    zoneActiveIndex = zoneIndex;
    chameleonBoy.vulnerable = isCollision();
  }, 100);
};

var checkCollision = function(x, y){
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
  chameleonBoy.setPosition(x, y);
};

var moveLeft = function(){
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');
  x -=2;
  if(x/blockSize<chameleonBoy.j){
    chameleonBoy.j--;
    if(chameleonBoy.j<0 || isCollision()){
      x+=2;
      chameleonBoy.j++;
    }
  }
  checkCollision(x, y);
};

var moveRight = function(){
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');
  x +=2;
  if(x/blockSize-1/2>chameleonBoy.j){
    chameleonBoy.j++;
    if(chameleonBoy.j>=map.width || isCollision()){
      x-=2;
      chameleonBoy.j--;
    }
  }
  checkCollision(x, y);
};
var moveUp = function(){
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');
  y-=2;
  if(y/blockSize<chameleonBoy.i){
    chameleonBoy.i--;
    if(chameleonBoy.i<0||isCollision()){
      y+=2;
      chameleonBoy.i++;
    }
  }
  checkCollision(x, y);
};

var moveDown = function(){
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');
  y+=2;
  if(y/blockSize-1/2>chameleonBoy.i){
    chameleonBoy.i++;
    if(chameleonBoy.i>=map.height||isCollision()){
      y-=2;
      chameleonBoy.i--;
    }
  }
  checkCollision(x, y);
};


stage.add(mapLayer);
stage.add(characterLayer);