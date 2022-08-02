import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        this.init();
        this.setKeyboardControls();
        this.setMouseControls();
        this.addEventListeners();
    }

    init() {
        this.controls = new PointerLockControls(
            this.camera.perspectiveCamera,
            document.body
        );

        window.addEventListener("click", () => {
            this.controls.lock();
        });

        this.raycaster = new THREE.Raycaster(
            new THREE.Vector3(),
            new THREE.Vector3()
        );

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

        this.cameraData = {};
        this.cameraData.velocity = new THREE.Vector3();
        this.cameraData.direction = new THREE.Vector3();
        this.dummyVector = new THREE.Vector3();

        this.cameraData.directionalVectors = {
            direction: new THREE.Vector3(),
            down: new THREE.Vector3(0, -1, 0),
            forward: new THREE.Vector3(0, 0, -1),
            backward: new THREE.Vector3(0, 0, 1),
            left: new THREE.Vector3(-1, 0, 0),
            right: new THREE.Vector3(1, 0, 0),
            forwardRight: new THREE.Vector3(1, 0, -1),
            forwardLeft: new THREE.Vector3(-1, 0, -1),
            backwardRight: new THREE.Vector3(1, 0, 1),
            backwardLeft: new THREE.Vector3(-1, 0, 1),
        };
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
        };
    }

    addEventListeners() {
        document.addEventListener("keydown", this.keyboard.keyDown);
        document.addEventListener("keyup", this.keyboard.keyUp);
        document.addEventListener("mousemove", this.mouse.onMouseMove);
    }

    setRaycasterDirection(directionalVector) {
        this.cameraData.directionalVectors.direction
            .copy(directionalVector)
            .applyQuaternion(this.controls.getObject().quaternion);
    }

    update() {
        this.delta = 0.0167;

        if (this.actions.forward) {
            this.dummyVector = this.cameraData.directionalVectors.forward
                .clone()
                .applyQuaternion(this.camera.perspectiveCamera.quaternion);
        }
        if (this.actions.backward) {
            this.dummyVector = this.cameraData.directionalVectors.backward
                .clone()
                .applyQuaternion(this.camera.perspectiveCamera.quaternion);
        }
        if (this.actions.left) {
            this.dummyVector = this.cameraData.directionalVectors.left
                .clone()
                .applyQuaternion(this.camera.perspectiveCamera.quaternion);
        }
        if (this.actions.right) {
            this.dummyVector = this.cameraData.directionalVectors.right
                .clone()
                .applyQuaternion(this.camera.perspectiveCamera.quaternion);
        }

        let targetPos = this.camera.perspectiveCamera.position
            .clone()
            .add(this.dummyVector.multiplyScalar(50.0 * this.delta));

        this.raycaster.set(targetPos, this.cameraData.directionalVectors.down);

        const intersects = this.raycaster.intersectObjects(
            this.scene.children[4].children
        );

        if (intersects.length > 0) {
            targetPos = intersects[0].point;
            // console.log(intersects[0].distance);

            this.cameraData.velocity.x -=
                this.cameraData.velocity.x * 10.0 * this.delta;
            this.cameraData.velocity.z -=
                this.cameraData.velocity.z * 10.0 * this.delta;

            this.cameraData.direction.z =
                Number(this.actions.forward) - Number(this.actions.backward);
            this.cameraData.direction.x =
                Number(this.actions.right) - Number(this.actions.left);

            if (this.actions.forward || this.actions.backward)
                this.cameraData.velocity.z -=
                    this.cameraData.direction.z * 50.0 * this.delta;
            if (this.actions.right || this.actions.left)
                this.cameraData.velocity.x -=
                    this.cameraData.direction.x * 50.0 * this.delta;

            this.controls.moveRight(-this.cameraData.velocity.x * this.delta);
            this.controls.moveForward(-this.cameraData.velocity.z * this.delta);
        } else {
            console.log("YOUD MOVE OUT BRUH");
            this.cameraData.velocity.x -=
                this.cameraData.velocity.x * 10.0 * this.delta;
            this.cameraData.velocity.z -=
                this.cameraData.velocity.z * 10.0 * this.delta;
        }
    }
}
