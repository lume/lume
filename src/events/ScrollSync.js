/**
* ScrollSync
*
* API for syncing mousewheel and touchmove Events.
*
* by Steve Belovarich
* Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
**/

var ScrollSync = function(elem, cb, direction) {

  var ts,
      prop,
      pos,
      startTime,
      pauseTime,
      endTime,
      startPos,
      lastPos,
      endPos,
      dist,
      angle,
      vel,
      currentTarget,
      threshold = 1.4;

  direction === 'hor' ? prop = ['pageX', 'deltaX'] : prop = ['pageY', 'deltaY'];

  elem.addEventListener('mousewheel', function(ev){

    ev.preventDefault();
    pos = ev[prop[1]]*0.125;
    cb(pos, false);

  });

  elem.addEventListener('touchstart', function (ev){

     ev.preventDefault();
     ts = ev[prop[0]];
     startTime = new Date().getMilliseconds();
     startPos = [ev.pageX,ev.pageY];
     currentTarget = ev.target;

  });

  elem.addEventListener('touchmove', function (ev){

     var te = ev[prop[0]];

     if(te < ts){

       pos = (ts-te)*0.0325;
       cb(pos, false);

     } else if(te > ts){

       pos = (ts-te)*0.0325;
       cb(pos, false);

     }

     pauseTime = new Date().getMilliseconds();
     lastPos = ts-te;

  });

  elem.addEventListener('touchend', function (ev){

    endTime = new Date().getMilliseconds();
    endPos = [ev.pageX,ev.pageY];
    dist = [startPos[0]-endPos[0], startPos[1]-endPos[1]];
    dur = startTime - endTime;
    angle = Math.atan(dist[1] / dist[0]) * 180 / Math.PI;
    vel = Math.sqrt((dist[0]*dist[0])+(dist[1]*dist[1])) / dur;



    if(!ev.target.isEqualNode(currentTarget)) {
        console.log(vel, (vel < -threshold || vel > threshold));
    }

    if(vel < -threshold || vel > threshold) {

      if(endTime - pauseTime < 500) {
        if(ev[prop[0]] < ts){
          pos = pos + (elem.clientHeight - 60);
          cb(pos, true);
        }
        else if(ev[prop[0]] > ts){
          pos = pos - (elem.clientHeight + 60);
          cb(pos, true);
        }
      }

    }


  });

};

module.exports = ScrollSync;
