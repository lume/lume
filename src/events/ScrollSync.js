/**
* ScrollSync
*
* API for syncing mousewheel and touchmove Events.
*
* by Steve Belovarich
* Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
**/

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

       cb((ts-te)*1.5);

     }else if(ts < te){

       cb((ts-te)*1.5);

     }

  });

};

module.exports = ScrollSync;
