import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

export default class Pyramid {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.setModel();
        this.setMaterials();
    }

    setModel() {
        this.pyramid = this.resources.items.pyramid.scene;
    }

    setMaterials() {
        this.pyramidTexture = this.resources.items.pyramidTexture;
        this.pyramidTexture.flipY = false;
        this.pyramidTexture.encoding = THREE.sRGBEncoding;

        // this.pyramid.children.find((child) => {
        //     child.material = new THREE.MeshBasicMaterial({
        //         map: this.pyramidTexture,
        //     });
        // });
        this.pyramid.children.find((child) => {
            child.material = new THREE.MeshBasicMaterial({
                map: this.pyramidTexture,
            });
        });

        this.scene.add(this.pyramid);
    }
}
