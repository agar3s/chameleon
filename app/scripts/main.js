//main container for the game
var stage = new Kinetic.Stage({
  id: 'main',
  container: 'container',
  width: 500,
  height: 500,
});

//layer1
var layer = new Kinetic.Layer({
  id:'layer1'
});

//Map Class
var Map = function(width, height, tiles){
  this.width = width;
  this.height = height;
  this.tiles = tiles;
  this.rects = [];
};

var blockSize=60;

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

var maps = [];

//dinamic function to create maps
var buildMap = function(layer, map){
  for(var i = 0; i<map.height*map.width; i+=map.width){
    for(var j = 0; j<map.width; j++){
      if(map.tiles[i+j]==1){
        var block = new Kinetic.Rect({
          x: blockSize*j,
          y: i*blockSize/map.width,
          width: blockSize,
          height: blockSize,
          fill: 'rgb(0,60,180)'
        });
        map.rects.push(block);
        layer.add(block);
      }
    }
  }
};



function loadMap(data){
  layer.destroyChildren();
  maps = [];
  for (var i = data.tiles.length - 1; i >= 0; i--) {
    var mapInstance = new Map(data.width, data.height, data.tiles[i]);
    maps.push(mapInstance);
    buildMap(layer, mapInstance);
  };
  layer.add(chameleonBoy);
  layer.add(log);
  layer.add(life);
  chameleonBoy.setPosition(0, blockSize);
  chameleonBoy.i = 1;
  chameleonBoy.j = 0;
  chameleonBoy.vulnerable = false;
  life.setWidth(300);
}


var log = new Kinetic.Text({
  text:'ola ke ase',
  x: 100,
  y: 200,
  stroke: 'rgb(100,100,200)'
});
// add the layer to the stage

stage.add(layer);

gKeys.init();

context = document.getElementsByTagName('canvas')[0].getContext('2d');
context.globalCompositeOperation = "lighter";

myKeys = gKeys.keys;

var mapActiveIndex = 0;
var isCollision = function(){
  return maps[mapActiveIndex].tiles[chameleonBoy.i*maps[mapActiveIndex].width+chameleonBoy.j]==1;
};
var toogleLayer = function(mapIndex){
  for (var i = maps[mapActiveIndex].rects.length - 1; i >= 0; i--) {
    maps[mapActiveIndex].rects[i].hide();
  };
  for (var i = maps[mapIndex].rects.length - 1; i >= 0; i--) {
    maps[mapIndex].rects[i].show();
  };
  mapActiveIndex = mapIndex;
  chameleonBoy.vulnerable = isCollision();
}

gKeys.keyDown(function(keys){
  if(myKeys.SPACE.down){
    toogleLayer(mapActiveIndex^1);
  }
});

var anim = new Kinetic.Animation(function(frame) {
  var time = frame.time,
  timeDiff = frame.timeDiff,
  frameRate = frame.frameRate;
  var x = chameleonBoy.getAttr('x'),
  y = chameleonBoy.getAttr('y');

  if(myKeys.LEFT.down){
    x -=2;
    if(x/blockSize<chameleonBoy.j){
      chameleonBoy.j--;
      if(chameleonBoy.j<0 || isCollision()){
        x+=2;
        chameleonBoy.j++;
      }else{
        log.setText('row: '+chameleonBoy.i+' col: '+chameleonBoy.j);
      }
    }
  }else if(myKeys.RIGHT.down){
    x +=2;
    if(x/blockSize-1/2>chameleonBoy.j){
      chameleonBoy.j++;
      if(chameleonBoy.j>=maps[0].width || isCollision()){
        x-=2;
        chameleonBoy.j--;
      }else{
        log.setText('row: '+chameleonBoy.i+' col: '+chameleonBoy.j);
      }
    }
  }else if(myKeys.UP.down){
    y-=2;
    if(y/blockSize<chameleonBoy.i){
      chameleonBoy.i--;
      if(chameleonBoy.i<0||isCollision()){
        y+=2;
        chameleonBoy.i++;
      }else{
        log.setText('row: '+chameleonBoy.i+' col: '+chameleonBoy.j);
      }
    }
  }else if(myKeys.DOWN.down){
    y+=2;
    if(y/blockSize-1/2>chameleonBoy.i){
      chameleonBoy.i++;
      if(chameleonBoy.i>=maps[0].height||isCollision()){
        y-=2;
        chameleonBoy.i--;
      }else{
        log.setText('row: '+chameleonBoy.i+' col: '+chameleonBoy.j);
      }
    }
  }
  if(chameleonBoy.vulnerable){
    if(isCollision()){
      life.setWidth(life.getWidth()-5);
      if(life.getWidth()<=0){
        log.setText('you are dead!!!!!! refresh the page');
        anim.stop();
      }
    }else{
      chameleonBoy.vulnerable=false;
    }
  }
  chameleonBoy.setPosition(x, y);
}, layer);

function loadDatos(mapUrl) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', mapUrl, true);
  anim.stop();
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4) {
      var data = xobj.responseText;
      data = JSON.parse(data);
      loadMap(data);
      mapActiveIndex=0;
      toogleLayer(1);
      anim.start();
    }
  }
  xobj.send(null);
};
loadDatos('maps/map1.json');



var anchors = document.getElementsByTagName('a');
var loadMapByClick = function(e){
  loadDatos(e.currentTarget.dataset.map);
  e.preventDefault();
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.focus();
  return false;
};
for(var i = 0; i<anchors.length; i++){
  anchors[i].addEventListener('click', loadMapByClick , false);
}