import * as THREE from "three";
import Experience from "../Experience.js";

import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { PointerLockControlsCannon } from "./PointerLockControlsCannon.js";

export default class Physics {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;

        this.raycaster = new THREE.Raycaster();
        this.targetPosition = new THREE.Vector3(0, 0, 0);
        this.setCube();

        this.initCannonWorld();
        this.initPointerLockControls();

        if (this.debug) {
            this.setHelper();
        }
    }

    initCannonWorld() {
        this.world = new CANNON.World();

        const sphereShape = new CANNON.Box(new CANNON.Vec3(10, 10, 10));

        let physicsMaterial = new CANNON.Material("physics");
        const physics_physics = new CANNON.ContactMaterial(
            physicsMaterial,
            physicsMaterial,
            {
                friction: 0.0,
                restitution: 0.3,
            }
        );

        this.world.addContactMaterial(physics_physics);

        this.sphereBody = new CANNON.Body({
            mass: 5,
            material: physicsMaterial,
        });
        this.sphereBody.addShape(sphereShape);
        this.sphereBody.position.set(0, 0, 0);
        this.sphereBody.linearDamping = 0.9;
        this.world.addBody(this.sphereBody);

        document.addEventListener("click", () => {
            this.controls.lock();
        });
    }

    initPointerLockControls() {
        this.controls = new PointerLockControlsCannon(
            this.cube,
            this.sphereBody
        );

        this.controls.addEventListener("lock", () => {
            this.controls.enabled = true;
        });

        this.controls.addEventListener("unlock", () => {
            this.controls.enabled = false;
        });
    }

    setHelper() {
        this.cannonDebugger = new CannonDebugger(this.scene, this.world, {});
    }

    setCube() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });
        this.cube = new THREE.Mesh(geometry, material);
        // this.scene.add(this.cube);
    }

    update() {
        // console.log(this.controls.getDirection());
        // this.cube.position.copy(this.sphereBody.position);
        // this.camera.perspectiveCamera.position.copy(this.cube.position);
        // console.log(this.camera.debugCamera.position);
        // console.log(this.controls.getObject().position);
        // this.camera.perspectiveCamera.position.copy(
        //     this.controls.getObject().position
        // );
        // this.raycaster.set(this.camera.perspectiveCamera.position,);

        // this.camera.perspectiveCamera.position.copy(this.sphereBody.position);
        // // this.camera.perspectiveCamera.quaternion.copy(
        // //     this.sphereBody.quaternion
        // // );

        console.log();
        this.delta = this.time.delta / 1000;
        this.world.step(1 / 60, this.delta);
        this.controls.update(this.delta);
        if (this.debug) {
            this.cannonDebugger.update();
        }
    }
}
