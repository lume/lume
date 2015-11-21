/*
   res.js v1.3

   Author: Steve Belovarich

   The MIT License (MIT)
   Copyright (c) 2014 Steve Belovarich

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

   Usage: var r = new res([{
                     "state": "portrait",
                     "breakpoint": 420,
                     "cols": 4,
                     "margin": 10,
                     "gutter": 10
                 },
                 {
                     "state": "landscape",
                     "breakpoint": 640,
                     "cols": 4,
                     "margin": 10,
                     "gutter": 10
                 },
                 {
                     "state": "tablet",
                     "breakpoint": 768,
                     "cols": 12,
                     "margin": 40,
                     "gutter": 10
                 }]);

                 window.addEventListener('stateChange',function(ev,i){

                    console.log(r.state); // get the state from the object you created

                 });

*/

//Polyfill for CustomEvent in IE9+
(function() {
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

var res = function(json) {

  var that = this;
  this.uagent = navigator.userAgent.toLowerCase();
  this.state = undefined;
  this.input = undefined;
  this.orient = undefined;
  this.device = undefined;
  this.os = undefined;
  this.browser = undefined;
  this.version = undefined;
  this.width = 0;
  this.grid = {};
  this.viewports = {};
  this.gridsettings = {};

  var lastBreakpoint = 0;

  for (var i = 0; i < json.length; i++) {
    that.viewports[json[i].state] = [lastBreakpoint + 1, json[i].breakpoint];
    if (json[i].cols !== undefined && json[i].margin !== undefined && json[i].gutter !== undefined) {
      that.gridsettings[json[i].state] = [json[i].cols, json[i].margin, json[i].gutter];
    }
    lastBreakpoint = json[i].breakpoint;
  };

  this.init();
};
res.prototype = {

  setState: function() {
    var that = this;

    if (that.device === 'desktop') {
      that.width = window.innerWidth;
    } else if (that.device !== 'desktop') {
      if (that.orient === 'portrait') {
        that.width = screen.width;
      } else if (that.orient === 'landscape') {
        that.width = screen.height;
      }
    }

    for (var key in that.viewports) {
      if (that.viewports.hasOwnProperty(key)) {
        if (that.width >= that.viewports[key][0] && that.width <= that.viewports[key][1]) {
          if (that.state != key) {
            that.state = key;
            return that.state;
          }
        }
      }
    }
  },

  inputCheck: function() {
    var that = this;
    if (that.os === 'ios' || that.os === 'android' || that.os === 'winphone') {
      that.input = 'touch';
    } else {
      that.input = 'mouse';
    }
  },

  browserCheck: function() {
    var that = this;
    var tem,
      M = that.uagent.match(/(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (that.uagent.match(/(edge(?=\/))\/?\s*(\d+)/i)) {
      M = that.uagent.match(/(edge(?=\/))\/?\s*(\d+)/i);
      that.browser = 'edge';
      that.version = M[2];
      return 'Edge ' + (M[2] || '');
    }
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(that.uagent) || [];
      that.browser = 'msie';
      that.version = tem[1];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = that.uagent.match(/\bOPR\/(\d+)/);
      if (tem != null) {
        that.browser = 'opera';
        that.version = tem[1];
        return 'Opera ' + tem[1];
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = that.uagent.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    that.browser = M[0];
    that.version = M[1];
    return M.join(' ');
  },

  osCheck: function() {
    var that = this;
    if (navigator.appVersion.indexOf("Win") != -1) {
      that.os = 'windows';
      that.device = 'desktop';
    } else if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.match(/(iPhone|iPod|iPad)/) == null) {
      that.os = 'osx';
      that.device = 'desktop';
    } else if (navigator.userAgent.indexOf("Android") > -1) {
      that.os = 'android';
      if (navigator.userAgent.indexOf("Mobile") > -1) {
        that.device = 'mobile';
      } else {
        that.device = 'tablet';
      }

    } else if (navigator.userAgent.indexOf("windows phone") > 0) {
      that.os = 'windows';
      that.device = 'mobile';
    } else if (navigator.appVersion.indexOf("X11") != -1) {
      that.os = 'unix';
      that.device = 'desktop';
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
      that.os = 'linux';
      that.device = 'desktop';
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) !== null && navigator.userAgent.match(/(iPhone|iPod|iPad)/).length > 0) {
      that.os = 'ios';
      if (that.uagent.indexOf("iphone") > 0) {
        that.device = "iphone";
      }
      if (that.uagent.indexOf("ipod") > 0) {
        that.device = "ipod";
      }
      if (that.uagent.indexOf("ipad") > 0) {
        that.device = "ipad";
      }
    } else {
      that.os = 'unknown';
    }
  },

  gridHelper: function(key) {

    var that = this;

    var col,
      colArr = [],
      colSpan,
      colSpanArr = [],
      margin,
      gutter,
      cols;

    cols = that.gridsettings[key][0];
    margin = that.gridsettings[key][1];
    gutter = that.gridsettings[key][2];

    col = [];
    colSpan = [];
    width = window.innerWidth - (margin * 2) + gutter;
    columnWidth = (width / cols) - gutter;

    for (var i = 0; i < cols; i++) {
      if (i === 0) {
        colSpan = 0;
      } else {
        colSpan = (columnWidth * i) + (gutter * (i - 1));
      }
      col = ((width / cols) * i) + margin;
      colArr.push(col);
      colSpanArr.push(colSpan);

      if (i === cols - 1) {
        colSpan = (columnWidth * (i + 1)) + (gutter * (i))
        colSpanArr.push(colSpan);
      }
    }
    return {
      "cols": cols,
      "col": colArr,
      "colSpan": colSpanArr,
      "width": width,
      "margin": margin,
      "gutter": gutter
    };

  },

  resize: function() {
    var that = this;

    if (window.innerHeight > window.innerWidth) {
      that.orient = 'portrait';
    } else {
      that.orient = 'landscape';
    }

    that.setState();

    if (that.gridsettings.hasOwnProperty(that.state)) {
      that.grid = that.gridHelper(that.state);
    }

    that.stateChange = new CustomEvent("stateChange", {
      bubbles: false,
      cancelable: true
    });

    window.dispatchEvent(that.stateChange);

    return that;
  },

  init: function() {
    var that = this;

    that.osCheck();
    that.inputCheck();
    that.browserCheck();

    window.onorientationchange = function() {
      that.resize();
    };

    window.onresize = function() {
      that.resize();
    };

    that.resize();
  }

};
