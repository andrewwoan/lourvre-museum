import "./style.css";
import Experience from "./Experience/Experience.js";

window.addEventListener("DOMContentLoaded", () => {
    const experience = new Experience(
        document.querySelector("canvas.experience-canvas")
    );
});
