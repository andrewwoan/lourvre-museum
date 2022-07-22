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
        this.noMove = false;
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

        this.moveRaycaster = new THREE.Raycaster(
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
        this.cameraData.current = new THREE.Vector3();
        this.cameraData.target = new THREE.Vector3(0, 2, 0);

        this.lerp = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };

        this.cameraData.directionalVectors = {
            dummyVec: new THREE.Vector3(),
            moveDirection: new THREE.Vector3(),
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

        this.targetPos = new THREE.Vector3();
    }

    setRaycasterDirection(vec) {
        this.cameraData.directionalVectors.direction
            .copy(vec)
            .applyQuaternion(this.controls.getObject().quaternion);
    }

    // moveForward(distance) {
    //     this.cameraData.directionalVectors.dummyVec.setFromMatrixColumn(
    //         camera.matrix,
    //         0
    //     );

    //     this.cameraData.directionalVectors.dummyVec.crossVectors(
    //         camera.up,
    //         this.cameraData.directionalVectors.dummyVec
    //     );

    //     camera.position.addScaledVector(
    //         this.cameraData.directionalVectors.dummyVec,
    //         distance
    //     );
    // }

    update() {
        this.raycaster.set(
            this.lerp.target,
            this.cameraData.directionalVectors.down
        );

        if (this.actions.forward) {
            this.lerp.target.z += 0.5;
        }
        if (this.actions.backward) {
            this.lerp.target.z -= 0.5;
        }
        if (this.actions.right) {
            this.lerp.target.x += 0.5;
        }
        if (this.actions.left) {
            this.lerp.target.x -= 0.5;
        }

        this.lerp.current.lerp(this.lerp.target, 0.1);

        this.camera.perspectiveCamera.position.copy(
            this.lerp.current.applyQuaternion(
                this.controls.getObject().quaternion
            )
        );

        // console.log(this.lerp.current);

        const intersects = this.raycaster.intersectObjects(
            this.scene.children[4].children
        );
        // console.log(this.scene.children);
        for (let i = 0; i < intersects.length; i++) {
            if (intersects.length > 0) {
                // console.log("SHEEESH DA BABIE");
                console.log(intersects[0].object.name);
            } else {
            }
        }

        // console.log(this.camera.debugCamera.position);
    }
}
