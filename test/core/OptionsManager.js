define(function(require){
    var OptionsManager = require('samsara/core/_OptionsManager');

    QUnit.module('Options Manager');

    QUnit.test('Patch', function(assert){
        expect(0)
        var start = {
            a : 1,
            b : [1,2],
            c : {type : 'hello', duration : 500},
            d : {a : {b : 1}},
            f : 2,
            g : {a : 'B'},
            h : null,
            i : undefined
        };

        var patch = {
            a : 2,
            b : [3,4],
            c : {type : 'bye', duration : 100},
            d : {a : {b : 2}},
            e : 1,
            g : null,
            h : {a : 1}
        };

        var options = new OptionsManager(start);
        options.setOptions(patch);

        var patchedOptions = options.getOptions();

        console.log(patchedOptions)

        // do deep equals check
    });

});