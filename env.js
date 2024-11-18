class SimulationEnvironment {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.setupRenderer();
        this.setupCamera();

        this.bodies = [];
        this.G = 1; // Gravitational constant (scaled)
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    setupCamera() {
        this.camera.position.z = 50;
    }

    addBody(body) {
        this.bodies.push(body);
        this.scene.add(body.mesh);
    }

    updatePhysics(timestep) {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = 0; j < this.bodies.length; j++) {
                if (i !== j) {
                    this.bodies[i].applyForce(this.bodies[j], this.G, timestep);
                }
            }
        }

        this.bodies.forEach(body => {
            body.updatePosition(timestep);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updatePhysics(0.01);
        this.renderer.render(this.scene, this.camera);
    }
}

// Export the SimulationEnvironment class
export { SimulationEnvironment };