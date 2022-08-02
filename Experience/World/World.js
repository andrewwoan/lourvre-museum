import * as THREE from "three";

import { EventEmitter } from "events";

import Experience from "../Experience.js";
import Museum from "./Museum.js";
import Controls from "./Controls.js";

import Helpers from "../Utils/Helpers.js";

export default class World extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.resources.on("ready", () => {
            console.log(this.resources);
            this.controls = new Controls();
            this.museum = new Museum();
            this.helpers = new Helpers();
        });
    }

    resize() {}

    update() {
        if (this.physics) {
            this.physics.update();
        }
        // if (this.controls) {
        //     this.controls.update();
        // }
    }
}
