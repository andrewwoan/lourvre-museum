import * as THREE from "three";
import Experience from "../../Experience.js";
import GSAP from "gsap";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.init();
        this.setKeyboardControls();
        this.setMouseControls();
        this.addEventListeners();
    }

    init() {
        this.actions = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            backpack: false,
        };
        this.keyboard = {};

        this.mouse = {};
        this.mouse.coords = { currentX: 0, currentY: 0, deltaX: 0, deltaY: 0 };

        this.previous = null;
        this.keys = {};
        this.previousKeys = {};

        this.cameraData = {};
        this.cameraData.rotation = new THREE.Quaternion();
        this.cameraData.translation = new THREE.Vector3();
        this.cameraData.phi = 0;
        this.cameraData.phiSpeed = 8;
        this.cameraData.theta = 0;
        this.cameraData.thetaSpeed = 5;
    }

    setKeyboardControls() {
        this.keyboard.keyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    this.actions.forward = true;
                    break;

                case "ArrowDown":
                case "s":
                    this.actions.backward = true;
                    break;

                case "ArrowLeft":
                case "a":
                    this.actions.left = true;
                    break;

                case "ArrowRight":
                case "d":
                    this.actions.right = true;
                    break;

                case "b":
                case " ":
                    this.actions.backpack = true;
                    break;
            }
        };

        this.keyboard.keyUp = (e) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    this.actions.forward = false;
                    break;

                case "ArrowDown":
                case "s":
                    this.actions.backward = false;
                    break;

                case "ArrowLeft":
                case "a":
                    this.actions.left = false;
                    break;

                case "ArrowRight":
                case "d":
                    this.actions.right = false;
                    break;

                case "b":
                case " ":
                    this.actions.backpack = false;
                    break;
            }
        };
    }

    setMouseControls() {
        this.mouse.onMouseMove = (e) => {
            this.mouse.coords.currentX = e.pageX - this.sizes.width / 2;
            this.mouse.coords.currentY = e.pageY - this.sizes.height / 2;
            // console.log(this.mouse.coords);
            if (this.previous === null) {
                this.previous = { ...this.mouse.coords };
            }

            this.mouse.coords.deltaX =
                this.mouse.coords.currentX - this.previous.currentX;
            this.mouse.coords.deltaY =
                this.mouse.coords.currentY - this.previous.currentY;

            // console.log("deltax", this.mouse.coords.deltaX);
            // console.log("deltay", this.mouse.coords.deltaY);
        };
    }

    clamp(x, a, b) {
        return Math.min(Math.max(x, a), b);
    }

    updateRotation(deltaTime) {
        // Normalizing delta movement
        const xh = this.mouse.coords.deltaX / this.sizes.width;
        const yh = this.mouse.coords.deltaY / this.sizes.height;

        // Convert delta movement into spherical coordinates
        this.cameraData.phi += -xh * this.cameraData.phiSpeed;
        this.cameraData.theta = this.clamp(
            this.cameraData.theta + -yh * this.cameraData.thetaSpeed,
            -Math.PI / 3,
            Math.PI / 3
        );

        console.log(this.cameraData.phi, this.cameraData.theta);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraData.phi);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.cameraData.theta);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        this.cameraData.rotation.copy(q);
    }

    updateCamera(deltaTime) {
        this.camera.perspectiveCamera.quaternion.copy(this.cameraData.rotation);
        // console.log(this.camera.perspectiveCamera.position);
        // console.log(this.cameraData.rotation);
    }

    addEventListeners() {
        document.addEventListener("keydown", this.keyboard.keyDown);
        document.addEventListener("keyup", this.keyboard.keyUp);
        document.addEventListener("mousemove", this.mouse.onMouseMove);
    }

    update() {
        if (this.actions.backpack) {
            console.log("SHEEESH DA  BABIE");
        }
        this.updateRotation(this.time.delta);
        this.updateCamera(this.time.delta);
        // this.previous = { ...this.mouse.coords };
        if (this.previous !== null) {
            this.mouse.coords.deltaX =
                this.mouse.coords.currentX - this.previous.currentX;
            this.mouse.coords.deltaY =
                this.mouse.coords.currentY - this.previous.currentY;

            // console.log(this.mouse.coords.deltaX, this.mouse.coords.deltaY);

            this.previous = { ...this.mouse.coords };
        }
    }
}
