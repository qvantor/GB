(function () {
    'use strict';
    window.addEventListener('load', function () {
        var graph = new GB.graph({
                element: document.getElementById('graph'),
                config: {
                    updateNodeScale: true
                },
                nodes: {
                    circle: {
                        material: {
                            texture: 'sprites/circle.png',
                            scale: 8
                        }
                    },
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
                    },
                    star: {
                        material: {
                            texture: 'sprites/star.png',
                            scale: 8
                        }
                    }
                }
            }),

            editor = new Vue({
                el: '#editor',
                data: {
                    nodes: graph.model.data.nodes,
                    nodeTypes: graph.nodes,
                    nodeCount: 0,
                    nodeText: null,
                    nodeType: 'Node Type',
                    link: {
                        source: null,
                        target: null
                    },
                    events: {
                        click: 'console.log(e,d,s);',
                        contextmenu: 'console.log(e,d,s); d.fixed = false; graph.model.force.start();',
                        mousemove: 'console.log(e,d,s);',
                        mouseover: 'console.log(e,d,s);',
                        mouseout: 'console.log(e,d,s);'
                    }
                },
                methods: {
                    eventsSet: function () {
                        graph.globalEvents.contextmenu = function (e, d, s) {
                            eval(editor.events.contextmenu);
                        };
                        graph.globalEvents.click = function (e, d, s) {
                            eval(editor.events.click);
                        };
                        graph.globalEvents.mousemove = function (e, d, s) {
                            eval(editor.events.mouseout);
                        };
                        graph.globalEvents.mouseover = function (e, d, s) {
                            eval(editor.events.mouseover);
                        };
                        graph.globalEvents.mouseout = function (e, d, s) {
                            eval(editor.events.mouseout);
                        };
                    },
                    addNode: function () {
                        if (editor.nodeType !== 'Node Type') {
                            graph.model.addNode(editor.nodeCount++, {text: editor.nodeText}, editor.nodeType);
                        }
                    },
                    addLink: function () {
                        if (editor.link.source !== null && editor.link.target !== null) {
                            graph.model.addLink(editor.link.source, editor.link.target, 1);
                            editor.link = {
                                source: null,
                                target: null
                            };
                        }
                    }
                }
            });

        graph.view.camera.zoom = 1;
        graph.view.camera.updateProjectionMatrix();

        graph.start();
        editor.eventsSet();
    });
})();