import * as THREE from "three";
import Experience from "./Experience.js";

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.params = {
            exposure: 1.75,
            toneMapping: "CineonToneMapping",
            toneMappingOptions: {
                NoToneMapping: THREE.NoToneMapping,
                LinearToneMapping: THREE.LinearToneMapping,
                ReinhardToneMapping: THREE.ReinhardToneMapping,
                CineonToneMapping: THREE.CineonToneMapping,
                ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
            },
        };

        this.setRenderer();

        if (this.debug) {
            this.setDebug();
        }
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping =
            this.params.toneMappingOptions[this.params.toneMapping];
        this.renderer.toneMappingExposure = 1.75;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    setDebug() {
        this.debugFolder = this.debug.addFolder("Renderer");

        this.debugFolder
            .add(
                this.params,
                "toneMapping",
                Object.keys(this.params.toneMappingOptions)
            )
            .onChange(() => {
                this.renderer.toneMapping =
                    this.params.toneMappingOptions[this.params.toneMapping];
            });
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        if (this.debug) {
            this.renderer.setViewport(
                0,
                0,
                this.sizes.width,
                this.sizes.height
            );
            // console.log(this.camera.debugCamera.position);
            this.renderer.render(this.scene, this.camera.debugCamera);

            this.renderer.setScissorTest(true);
            this.renderer.setViewport(
                0,
                0,
                this.sizes.width / 3,
                this.sizes.height / 3
            );

            this.renderer.setScissor(
                0,
                0,
                this.sizes.width / 3,
                this.sizes.height / 3
            );

            this.renderer.render(this.scene, this.camera.perspectiveCamera);
            this.renderer.setScissorTest(false);
        } else {
            // console.log(this.camera.perspectiveCamera.position);
            this.renderer.render(this.scene, this.camera.perspectiveCamera);
        }
    }
}
