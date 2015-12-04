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
      to,
      pos;

  direction === 'hor' ? prop = ['pageX', 'deltaX'] : prop = ['pageY', 'deltaY'];

  elem.addEventListener('mousewheel', function(ev){

    ev.preventDefault();
    pos = ev[prop[1]]*0.125;
    cb(pos, false);

  });

  elem.addEventListener('touchstart', function (ev){

     ev.preventDefault();
     ts = ev[prop[0]];

  });

  elem.addEventListener('touchmove', function (ev){

     var te = ev[prop[0]];
     clearTimeout(to);

     if(te < ts){

       pos = (ts-te)*0.0325;
       cb(pos, false);

     } else if(te > ts){

       pos = (ts-te)*0.0325;
       cb(pos, false);

     }

  });

  elem.addEventListener('touchend', function (ev){

    to = setTimeout(function(){

      if((ev[prop[0]] < (ts - 260))){
        pos = pos + 400;
        cb(pos, true);
      }
      else if((ev[prop[0]] > (ts + 260))){
        pos = pos - 400;
        cb(pos, true);
      }
      else if((ev[prop[0]] < (ts - 200))){
        pos = pos + 200;
        cb(pos, true);
      }
      else if((ev[prop[0]] > (ts + 200))){
        pos = pos - 200;
        cb(pos, true);
      }

    }, 80);

  });

};

module.exports = ScrollSync;
