
'use strict';

var ScrollSync = function(elem, cb, direction) {

  var ts, prop;

  direction === 'hor' ? prop = ['pageX', 'deltaX'] : prop = ['pageY', 'deltaY'];

  elem.addEventListener('mousewheel', function(ev){

    ev.preventDefault();
    cb(ev[prop[1]]);

  });

  elem.addEventListener('touchstart', function (ev){

     ev.preventDefault();
     ts = ev[prop[0]];

  });

  elem.addEventListener('touchmove', function (ev){

     var te = ev[prop[0]];
     if(ts > te){

       cb((ts-te)*0.25);

     }else if(ts < te){

       cb((ts-te)*0.25);

     }

  });

};

module.exports = ScrollSync;
