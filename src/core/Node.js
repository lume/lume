var Node = function(conf){
    if(conf){
        this.setProperties(conf);
    } else {
        this.setDefaults();
    }
}

Node.prototype.setDefaults = function(conf){
    this.position = [0,0,0];
    this.origin = [0.0,0.0,0.0];
    this.align = [0.0,0.0,0.0];
    this.size = [0,0,0];
    this.opacity = 1.0;
};

Node.prototype.setProperties = function(conf){
    this.position = conf.position || [0,0,0];
    this.origin = conf.origin || [0.0,0.0,0.0];
    this.align = conf.align || [0.0,0.0,0.0];
    this.size = conf.size || [0,0,0];
    this.opacity = conf.opacity || 1.0;
};

Node.prototype.getProperties = function(){
    return {
        position: this.position,
        origin: this.origin,
        align: this.align,
        size: this.size,
        opacity: this.opacity
    }
};

Node.prototype.setPosition = function(pos){
    this.position = pos;
}

Node.prototype.getPosition = function(){
    return this.position;
}

Node.prototype.setSize = function(size){
    this.size = size;
}

Node.prototype.getSize = function(){
    return this.size;
}

Node.prototype.setOrigin = function(origin){
    this.origin = origin;
}

Node.prototype.getOrigin = function(){
    return this.origin;
}

Node.prototype.setAlign = function(align){
    this.align = align;
}

Node.prototype.getAlign = function(){
    return this.align;
}

Node.prototype.setOpacity = function(opacity){
    this.opacity = opacity;
}

Node.prototype.getOpacity = function(){
    return this.opacity;
}

module.exports = Node;
