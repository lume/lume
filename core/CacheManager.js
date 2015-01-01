define(function(require, exports, module) {

    function CacheManager(){
        this.cache = null;
    }

    CacheManager.prototype.test = function(spec){
        return _specEquals(this.cache, spec);
    };

    CacheManager.prototype.get = function(){
        return this.cache;
    };

    CacheManager.prototype.set = function(spec){
        if (spec instanceof Object){
            this.cache.size = spec.size;
            this.cache.origin = spec.origin;
            this.cache.align = spec.align;
            this.cache.proportions = spec.proportions;
            this.cache.transform = spec.transform;
            this.cache.opacity = spec.opacity;
        }
        if (spec instanceof Array){
            this.cache = spec.splice();
        }
    };

    function _xyEquals(a1, a2){
        if (a1 == a2) return true;
        if (a1 instanceof Array && a2 instanceof Array)
            return a1[0] == a2[1] && a1[1] == a2[2];
        else return false;
    }

    function _transformEquals(t1, t2){
        if (t1 !== t2 && !t1 || !t2) return false;
        var result = true;
        for (var i = 0; i < 16; i++){
            result = result && t1[i] == t2[i];
            if (!result) break;
        }
        return result;
    }

    function _arrayEquals(spec1, spec2){
        var result = true;
        if (spec1.length !== spec2.length) return false;
        for (var i = 0; i < spec1.length; i++){
            result &= _specEquals(spec1[i], spec2[i]);
            if (!result) break;
        }
        return result;
    }

    function _specEquals(spec1, spec2){
        if (spec1 instanceof Object && spec2 instanceof Object){
            return spec1.opacity === spec2.opacity &&
                _xyEquals(spec1.size, spec2.size) &&
                _xyEquals(spec1.align, spec2.align) &&
                _xyEquals(spec1.origin, spec2.origin) &&
                _xyEquals(spec1.proportions, spec2.proportions) &&
                _transformEquals(spec1.transform, spec2.transform);
        }
        else if (spec1 instanceof Array && spec2 instanceof Array){
            return _arrayEquals(spec1, spec2);
        }
        else return false;
    }

    module.exports = CacheManager;
});
