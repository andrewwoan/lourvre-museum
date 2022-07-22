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

        if (this.debug) {
            this.setHelper();
        }
    }

    setHelper() {
        // this.cannonDebugger = new CannonDebugger(this.scene, this.world, {});
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
    }
}
