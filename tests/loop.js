define(function (require, exports, module) {
    var Engine = require('samsara/core/Engine');

    var loop;
    var cancel = false;
    var running = false;

    if (window) loop = Engine;
    else {
        loop = {
            start : function () {
                if (running) return;
                running = true;
                process.nextTick(function loop() {
                    if (!cancel) {
                        Engine.step();
                        process.nextTick(loop);
                    }
                    else running = false;
                });
            },
            stop : function () {
                cancel = true;
            }
        };
    }

    module.exports = loop;
});