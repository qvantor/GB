module.exports = function (data) {
    function nodeType(data) {
        var textureLoader = new THREE.TextureLoader();

        this.material = {
            map: textureLoader.load(data.material.texture) || null,
            color: data.material.color || null,
            rotation: data.material.rotation || null,
            fog: data.material.fog || null
        };
        this.texture = data.material.texture;

        this.startScale = data.material.scale;
        this.draggable = data.draggable === undefined ? true : data.draggable;
        this.events = data.events || {};
    }

    var types = {};
    for (var key in data) {
        types[key] = new nodeType(data[key]);
    }
    return types;
};