module.exports = function (data, s) {
    this.data = data || {
            "nodes": [],
            "links": []
        };

    this.force = d3.layout.force()
        .nodes(this.data.nodes)
        .links(this.data.links)
        .gravity(0.002)
        .charge(-100)
        .linkDistance(35)
        .size([s.view.width, s.view.height])
        .start();

    this.addNode = function (id, data, type, fixed, pos) {
        if (this.findNode(id)) {
            return;
        }

        type = type ? type : 'default';

        var node = new THREE.Sprite(new THREE.SpriteMaterial(s.nodes[type].material));
        node._type = type;
        node._id = id;
        s.view.nodes.add(node);

        data.nodeId = node.id;
        data.type = type;

        this.data.nodes.push({
            "id": id,
            data: data,
            fixed: fixed || false,
            x: pos ? pos.x : undefined,
            y: pos ? pos.y : undefined
        });

        s.view.controls.dispatchEvent({type: 'change'});
        this.force.start();
    };
    this.addLink = function (source, target, value) {
        for (var i = 0; i < this.data.links.length; i++) {
            if (this.data.links[i]['source'].id === source && this.data.links[i]['target'].id === target) {
                return;
            }
        }
        var arrowHelper = new THREE.CustomArrowHelper(new THREE.Vector3(100, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x85ceff);
        s.view.links.add(arrowHelper);

        this.data.links.push({
            "source": this.findNode(source),
            "target": this.findNode(target),
            "value": value,
            "linkId": arrowHelper.id
        });

        this.force.start();
    };
    this.findNode = function (id) {
        for (var i in this.data.nodes) {
            if (this.data.nodes[i]["id"] === id) return this.data.nodes[i];
        }
    };
    this.removeNode = function (id) {
        var i = 0;
        var n = this.findNode(id);
        s.view.nodes.remove(s.view.nodes.getObjectById(n.data.nodeId, true));

        while (i < this.data.links.length) {
            if ((this.data.links[i]['source'].id === id) || (this.data.links[i]['target'].id === id)) {
                s.view.links.remove(s.view.links.getObjectById(this.data.links[i].linkId, true));
                this.data.links.splice(i, 1);
            }
            else i++;
        }
        this.data.nodes.splice(this.findNodeIndex(id), 1);

        this.force.start();
    };
    this.findNodeIndex = function (id) {
        for (var i = 0; i < this.data.nodes.length; i++) {
            if (this.data.nodes[i].id == id) {
                return i;
            }
        }
    };
    this.allNodeLinks = function (id) {
        var arr = [];
        this.data.links.forEach(function (item) {
            if (item['source'].id == id) {
                arr.push(item['target'].id);
            } else if (item['target'].id == id) {
                arr.push(item['source'].id);
            }
        });
        return arr;
    };
};