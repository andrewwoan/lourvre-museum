import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;
        this.params = {
            fov: 75,
            aspect: this.sizes.aspect,
            near: 0.1,
            far: 1000,
        };

        this.setPerspectiveCamera();
        if (this.debug) {
            this.setDebugCamera();
            this.setOrbitControls();
        }
    }

    setPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            this.params.fov,
            this.params.aspect,
            this.params.near,
            this.params.far
        );
        this.scene.add(this.perspectiveCamera);
        // this.perspectiveCamera.position.z = 10;
        this.perspectiveCamera.position.set(0, 0, 0);
        this.perspectiveCamera.position.y = 2;
        // this.perspectiveCamera.lookAt(0, 0, 1);
        // this.perspectiveCamera.rotation.z = Math.PI;

        if (this.debug) {
            this.helper = new THREE.CameraHelper(this.perspectiveCamera);
            this.scene.add(this.helper);
        }
    }

    setDebugCamera() {
        this.debugCamera = new THREE.PerspectiveCamera(
            this.params.fov,
            this.params.aspect,
            this.params.near,
            this.params.far
        );
        this.scene.add(this.debugCamera);
        this.debugCamera.position.x = 47;
        this.debugCamera.position.y = 23;
        this.debugCamera.position.z = 30;
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.debugCamera, this.canvas);
        this.controls.enableDamping = true;
        // this.controls.enableZoom = false;
    }

    resize() {
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        if (this.debug) {
            this.debugCamera.aspect = this.sizes.aspect;
            this.debugCamera.updateProjectionMatrix();
        }
    }

    update() {
        if (this.debug) {
            this.controls.update();
            this.helper.matrixWorldNeedsUpdate = true;
            this.helper.update();
            this.helper.position.copy(this.perspectiveCamera.position);
            this.helper.quaternion.copy(this.perspectiveCamera.quaternion);
        }
    }
}
