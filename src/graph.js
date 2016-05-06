'use strict';

module.exports = function (cfg) {
    var s = {
        start: start,
        view: new GB.view(cfg.element),
        nodes: cfg.nodes,
        config: cfg.config || {},
        intersect: {
            node: []
        },
        clicked: {
            last: null,
            prev: null
        }
    };
    s.model = new GB.model(null, s);
    s.events = new GB.events(cfg.element, s, cfg.events);

    function start() {
        requestAnimationFrame(start);
        s.view.controls.update();
        render();
    }

    function render() {
        s.model.data.nodes.forEach(function (item) {
            var obj = s.view.scene.getObjectById(item.data.nodeId, true);
            if (obj) {
                obj.position.x = countX(item.x);
                obj.position.y = countY(item.y);
            }
        });
        s.model.data.links.forEach(function (item) {
            var obj = s.view.scene.getObjectById(item.linkId, true);
            obj.geometry.vertices[0].x = countX(item.source.x);
            obj.geometry.vertices[0].y = countY(item.source.y);

            obj.geometry.vertices[1].x = countX(item.target.x);
            obj.geometry.vertices[1].y = countY(item.target.y);
            obj.geometry.verticesNeedUpdate = true;
        });

        s.view.raycaster.setFromCamera(s.view.mouse, s.view.camera);
        s.intersect.node = s.view.raycaster.intersectObjects(s.view.nodes.children)[0];
        s.view.composer.render();
        if (s.hud)
            s.view.renderer.render(s.hud.scene, s.hud.camera);
    }

    function countX(x) {
        return x - s.view.width / 2;
    }

    function countY(y) {
        return -(y - s.view.height / 2);
    }

    return s;
};