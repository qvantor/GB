module.exports = function (element) {
    console.log(element);
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0, 15);
    this.camera.position.z = 10;
    this.camera.zoom = 4;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;

    var renderModel = new THREE.RenderPass(this.scene, this.camera);
    var effectBloom = new THREE.BloomPass(.7);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    effectCopy.renderToScreen = true;

    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);

    this.composer.addPass(renderModel);
    this.composer.addPass(effectFXAA);
    this.composer.addPass(effectBloom);
    this.composer.addPass(effectCopy);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.nodes = new THREE.Object3D;
    this.links = new THREE.Object3D;
    this.links.position.z = 4;
    this.nodes.position.z = 6;

    this.scene.add(this.nodes);
    this.scene.add(this.links);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = {ORBIT: null, ZOOM: null, PAN: THREE.MOUSE.LEFT};
    this.controls.minZoom = 0.5;
    this.controls.maxZoom = 10;

    element.appendChild(this.renderer.domElement);
};