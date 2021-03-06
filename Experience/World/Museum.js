import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

export default class Museum {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.setModel();
        this.setMaterials();
    }

    setModel() {
        this.museum = this.resources.items.museum.scene;
        this.navmesh = this.resources.items.navmesh.scene;
        this.landscape = this.resources.items.landscape.scene;
    }

    setMaterials() {
        this.museumTexture = this.resources.items.museumTexture;
        this.museumTexture.flipY = false;
        this.museumTexture.encoding = THREE.sRGBEncoding;

        this.museum.children.find((child) => {
            child.material = new THREE.MeshBasicMaterial({
                map: this.museumTexture,
            });
        });

        this.navmesh.children.find((child) => {
            child.material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
            });
        });

        this.landscape.children.find((child) => {
            child.material = new THREE.MeshBasicMaterial({
                map: this.museumTexture,
            });
        });

        this.scene.add(this.museum);
        this.scene.add(this.navmesh);
        this.scene.add(this.landscape);
    }
}
