module.exports = function (data) {
    var textureLoader = new THREE.TextureLoader();

    this.material = {
        map: textureLoader.load(data.material.texture) || null,
        color: data.material.color || null,
        rotation: data.material.rotation || null,
        fog: data.material.fog || null
    };

    this.startScale = data.material.scale;
    this.draggable = data.draggable === undefined ? true : data.draggable;
    this.events = data.events || {};
};