import * as THREE from "three";
import Experience from "../Experience.js";

import { EventEmitter } from "events";
import Pyramid from "./Pyramid.js";
import Museum from "./Museum.js";

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
            this.museum = new Museum();
            // this.pyramid = new Pyramid();
        });
    }

    resize() {}

    update() {}
}
