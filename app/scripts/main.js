
gKeys.init();

myKeys = gKeys.keys;

gKeys.keyDown(function(keys){
  if(myKeys.SPACE.down){
    toogleLayer(zoneActiveIndex^1);
  }
});

var anim = new Kinetic.Animation(function(frame) {
  var time = frame.time,
  timeDiff = frame.timeDiff,
  frameRate = frame.frameRate;

  move(myKeys.LEFT.down?-1:myKeys.RIGHT.down?1:0,
       myKeys.UP.down?-1:myKeys.DOWN.down?1:0);
}, characterLayer);

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
      initZone(0);
      anim.start();
      document.getElementById('audiotag1').play();
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