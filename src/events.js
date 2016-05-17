module.exports = function (element, s) {
    var overElement;

    this.mouseMove = function (e) {
        e.preventDefault();

        s.view.mouse.x = ( e.clientX / element.clientWidth ) * 2 - 1;
        s.view.mouse.y = -( e.clientY / element.clientHeight ) * 2 + 1;


        if (!s.view.controls.enabled) {
            s.view.controls.drag.fixed = true;
            s.view.controls.drag.dragged = true;
            s.view.controls.drag.px = s.view.raycaster.ray.origin.x + s.view.width / 2;
            s.view.controls.drag.py = -(s.view.raycaster.ray.origin.y - s.view.height / 2);
            s.model.force.start();
            emitNodeEvent(e, 'mousemove', overElement);
            return;
        }
        if (s.intersect.node) {
            if (!overElement) {
                overElement = s.intersect.node.object;
                emitNodeEvent(e, 'mouseover', overElement);
            } else if (overElement !== s.intersect.node.object) {
                emitNodeEvent(e, 'mouseout', overElement);
                overElement = null;
            }
            emitNodeEvent(e, 'mousemove');
        } else if (overElement) {
            emitNodeEvent(e, 'mouseout', overElement);
            overElement = null;
        }
    };

    this.mouseDown = function (e) {
        if (e.button !== 0) {
            return;
        }
        e.preventDefault();

        if (s.intersect.node && s.nodes[s.intersect.node.object._type].draggable) {
            s.view.controls.enabled = false;
            s.view.controls.drag = s.model.findNode(s.intersect.node.object._id);
            s.view.controls.drag.dragged = false;
        }
    };

    this.mouseUp = function (e) {
        if (e.button !== 0) {
            return;
        }
        e.preventDefault();

        s.view.controls.enabled = true;

        if (s.intersect.node) {
            s.clicked.prev = s.clicked.last;
            s.clicked.last = s.intersect.node.object;
        } else {
            emitGlobalEvent(e, 'emptyClick');
            s.clicked.last = null;
        }

        if (s.view.controls.drag) {
            if (!s.view.controls.drag.dragged) {
                emitNodeEvent(e, 'click');
            }

            s.view.controls.drag.dragged = false;
        }
    };

    this.dblclick = function (e) {
        emitNodeEvent(e, 'dblclick');
    };

    this.contextmenu = function (e) {
        emitNodeEvent(e, 'contextmenu');
    };

    this.controlsChanged = function (e) {
        if (s.config.updateNodeScale) {
            s.view.nodes.children.forEach(function (item) {
                var scale = (s.view.controls.maxZoom - s.view.camera.zoom) + s.nodes[item._type].startScale;
                item.scale.set(scale, scale, 1);
            });
        }
        emitGlobalEvent(e, 'controlsChanged');
    };

    this.resize = function (e) {
        s.view.width = element.clientWidth;
        s.view.height = element.clientHeight;

        s.view.renderer.setSize(s.view.width, s.view.height);
        s.view.composer.setSize(s.view.width, s.view.height);
        s.view.camera.left = s.view.width / -2;
        s.view.camera.right = s.view.width / 2;
        s.view.camera.top = s.view.height / 2;
        s.view.camera.bottom = s.view.height / -2;
        s.view.camera.updateProjectionMatrix();
    };

    function emitGlobalEvent(e, eName, data, sprite) {
        if (s.globalEvents && s.globalEvents[eName]) {
            if (data && sprite) {
                s.globalEvents[eName](e, data, sprite);
            } else {
                s.globalEvents[eName](e);
            }
        }
    }

    function emitNodeEvent(e, eName, elem) {
        var intersected = elem !== undefined ? elem : s.intersect.node ? s.intersect.node.object : undefined;
        if (intersected) {
            var events = s.nodes[intersected._type].events;
            var event = events[eName],
                node = s.model.findNode(intersected._id);
            emitGlobalEvent(e, eName, node, intersected);
            if (event) {
                event(e, node, intersected);
            }
        }
    }

    element.addEventListener('mousemove', this.mouseMove, false);
    element.addEventListener('mousedown', this.mouseDown, false);
    element.addEventListener('mouseup', this.mouseUp, false);
    element.addEventListener('dblclick', this.dblclick, false);
    element.addEventListener('contextmenu', this.contextmenu, false);
    //window.addEventListener('resize', this.resize, false);

    s.view.controls.addEventListener('change', this.controlsChanged);

};