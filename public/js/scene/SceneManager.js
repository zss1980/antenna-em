import * as THREE from 'three';
import { OrbitControls } from 'three/controls/OrbitControls';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.isLightMode = false;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);

        const fov = 60;
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(1.5, 1, 2.5);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            preserveDrawingBuffer: true // for exporting PNG
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.addLights();
        this.addHelpers();

        window.addEventListener('resize', () => this.onResize());
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7.5);
        this.scene.add(dirLight);
    }

    addHelpers() {
        this.axesHelper = new THREE.AxesHelper(1.5);
        this.scene.add(this.axesHelper);

        this.gridHelper = new THREE.GridHelper(4, 10);
        this.scene.add(this.gridHelper);
    }

    updateTheme(isLight) {
        this.isLightMode = isLight;
        this.scene.background.set(isLight ? 0xf5f5f5 : 0x1a1a1a);
        this.axesHelper.dispose();
        this.scene.remove(this.axesHelper);
        this.axesHelper = new THREE.AxesHelper(1.5); // Recreate to respect background
        this.scene.add(this.axesHelper);
    }

    onResize() {
        const container = this.canvas.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    replace(oldObject, newObject) {
        this.remove(oldObject);
        this.add(newObject);
    }

    resetControls() {
        this.controls.reset();
    }

    exportPNG() {
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'antenna_pattern.png';
        link.href = dataURL;
        link.click();
    }
}
