import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

import { Sphere } from './sphere.js';

export class SimulationEnvironment {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.setup();

        this.bodies = [];
        this.particles = [];
        
        this.randomParticles(1000);
    }

    setup() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // controls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // initial camera position
        this.camera.position.z = 150;

        // plane
        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xf7f7f7,
            side: THREE.DoubleSide,
            opacity: 0.2,
            transparent: true,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = Math.PI / 2;
        this.scene.add(plane);
    }

    randomParticles(num) {
        for (let i = 0; i < num; i++) {
            const size = 1000
            const x = Math.random() * size - size / 2;
            const y = Math.random() * size - size / 2;
            const z = Math.random() * size - size / 2;
            const sphereObj = new Sphere(this.scene, x, y, z, 0.07, 8, 8, 0xffffff, true);
            this.particles.push(sphereObj);
        }
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
