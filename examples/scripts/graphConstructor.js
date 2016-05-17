(function () {
    'use strict';
    window.addEventListener('load', function () {
        var graph = new GB.graph({
                element: document.getElementById('graph'),
                config: {
                    updateNodeScale: true
                },
                nodes: {
                    triangle: {
                        material: {
                            texture: 'sprites/triangle.png',
                            scale: 8
                        }
                    },
                    square: {
                        material: {
                            texture: 'sprites/square.png',
                            scale: 8
                        }
                    }
                },
                events: {
                    emptyClick: function () {
                        var newNodeCoords = {
                                x: graph.view.raycaster.ray.origin.x + graph.view.width / 2,
                                y: -(graph.view.raycaster.ray.origin.y - graph.view.height / 2)
                            },
                            newNodeId = Math.random(),
                            links = [];
                        graph.model.data.nodes.forEach(function (item) {
                            var dist = Math.sqrt(Math.pow(newNodeCoords.x - item.x, 2) + Math.pow(newNodeCoords.y - item.y, 2));
                            if (dist < 50) {
                                links.push({dist: dist, id: item.id});
                            }
                        });
                        links.sort(function (a, b) {
                            if (a.dist > b.dist) {
                                return 1;
                            }
                            if (a.dist < b.dist) {
                                return -1;
                            }
                            return 0;
                        });
                        graph.model.addNode(newNodeId, {}, Math.random() > 0.5 ? 'square' : 'triangle', false, newNodeCoords);
                        links.forEach(function (link) {
                            graph.model.addLink(newNodeId, link.id, 1);
                        });
                    }
                }
            }),
            editor = new Vue({
                el: 'body',
                data: {
                    graphData: graph.model.data
                },
                methods: {}
            });
        graph.view.camera.zoom = 0.5;
        graph.view.camera.updateProjectionMatrix();
        graph.view.controls.mouseButtons = {ORBIT: null, ZOOM: null, PAN: THREE.MOUSE.RIGHT};
        graph.model.force
            .gravity(0.04);
        graph.start();
    });
})();