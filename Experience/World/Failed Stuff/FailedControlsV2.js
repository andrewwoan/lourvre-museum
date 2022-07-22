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

        this.cameraData.directionalVectors = {
            direction: new THREE.Vector3(),
            forward: new THREE.Vector3(0, 0, -1),
            backward: new THREE.Vector3(0, 0, 1),
            left: new THREE.Vector3(-1, 0, 0),
            right: new THREE.Vector3(1, 0, 0),
            forwardRight: new THREE.Vector3(1, 0, -1),
            forwardLeft: new THREE.Vector3(-1, 0, -1),
            backwardRight: new THREE.Vector3(1, 0, 1),
            backwardLeft: new THREE.Vector3(-1, 0, 1),
        };

        this.material = new THREE.LineBasicMaterial({
            color: 0xff0000,
        });

        this.points = [];
        this.points.push(this.raycaster.ray.origin);
        this.points.push(this.cameraData.directionalVectors.direction);

        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(this.geometry, this.material);
        this.scene.add(this.line);
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
        const delta = this.time.delta / 1000;

        this.cameraData.velocity.x -= this.cameraData.velocity.x * 10.0 * delta;
        this.cameraData.velocity.z -= this.cameraData.velocity.z * 10.0 * delta;

        this.cameraData.direction.z =
            Number(this.actions.forward) - Number(this.actions.backward);
        this.cameraData.direction.x =
            Number(this.actions.right) - Number(this.actions.left);
        // this.cameraData.direction.normalize();

        // console.log(this.cameraData.direction);
        // console.log(
        //     Number(this.actions.forward),
        //     Number(this.actions.backward),
        //     Number(this.actions.right),
        //     Number(this.actions.left)
        // );

        this.raycaster.ray.origin.copy(this.controls.getObject().position);
        // console.log(this.controls.getDirection());
        this.directionHolder = new THREE.Vector3();

        if (
            this.cameraData.direction.z === 1 &&
            this.cameraData.direction.x === 1
        ) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.forwardRight
            );
        } else if (
            this.cameraData.direction.z === 1 &&
            this.cameraData.direction.x === -1
        ) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.forwardLeft
            );
        } else if (
            this.cameraData.direction.z === -1 &&
            this.cameraData.direction.x === 1
        ) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.backwardRight
            );
        } else if (
            this.cameraData.direction.z === -1 &&
            this.cameraData.direction.x === -1
        ) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.backwardLeft
            );
        } else if (this.cameraData.direction.z === 1) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.forward
            );
        } else if (this.cameraData.direction.z === -1) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.backward
            );
        } else if (this.cameraData.direction.x === 1) {
            this.setRaycasterDirection(
                this.cameraData.directionalVectors.right
            );
        } else if (this.cameraData.direction.x === -1) {
            this.setRaycasterDirection(this.cameraData.directionalVectors.left);
        }

        // if (
        //     this.cameraData.direction.z === 1 &&
        //     this.cameraData.direction.x === 1
        // ) {
        //     this.setRaycasterDirection(
        //         this.cameraData.directionalVectors.forwardRight
        //     );
        // } else if (
        //     this.cameraData.direction.z === 1 &&
        //     this.cameraData.direction.x === -1
        // ) {
        //     this.setRaycasterDirection(
        //         this.cameraData.directionalVectors.forwardLeft
        //     );
        // } else if (
        //     this.cameraData.direction.z === -1 &&
        //     this.cameraData.direction.x === 1
        // ) {
        //     this.setRaycasterDirection(
        //         this.cameraData.directionalVectors.backwardRight
        //     );
        // } else if (
        //     this.cameraData.direction.z === -1 &&
        //     this.cameraData.direction.x === -1
        // ) {
        //     this.setRaycasterDirection(
        //         this.cameraData.directionalVectors.backwardLeft
        //     );
        // }

        // this.raycaster.ray.direction.copy(this.cameraData.velocity);
        this.raycaster.ray.direction.copy(
            this.cameraData.directionalVectors.direction
        );

        // this.raycaster.ray.direction.z = -this.raycaster.ray.direction.z;
        console.log(this.raycaster.ray.direction);
        const intersects = this.raycaster.intersectObjects(
            this.scene.children[3].children
        );
        // console.log(this.scene.children[3]);
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[0].distance > 0) {
                // console.log(intersects[i]);
                console.log(intersects[0].distance);
            }
        }

        if (this.actions.forward || this.actions.backward)
            this.cameraData.velocity.z -=
                this.cameraData.direction.z * 50.0 * delta;
        if (this.actions.right || this.actions.left)
            this.cameraData.velocity.x -=
                this.cameraData.direction.x * 50.0 * delta;

        // console.log(
        //     -this.cameraData.velocity.x * delta,
        //     -this.cameraData.velocity.z * delta
        // );

        this.controls.moveRight(-this.cameraData.velocity.x * delta);
        this.controls.moveForward(-this.cameraData.velocity.z * delta);

        this.scene.remove(this.line);

        this.material = new THREE.LineBasicMaterial({
            color: 0xff0000,
        });

        this.points = [];
        this.points.push(this.raycaster.ray.origin);
        this.points.push(this.cameraData.directionalVectors.direction);

        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(this.geometry, this.material);
        this.scene.add(this.line);

        // console.log(this.camera.debugCamera.position);
    }
}
