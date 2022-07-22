import * as THREE from "three";
import Experience from "../Experience.js";

export default class Helpers {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.addHelpers();
    }

    addHelpers() {
        const size = 100;
        const divisions = 100;

        const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(100);
        this.scene.add(axesHelper);
    }
}
