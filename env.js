import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

import { Sphere } from './sphere.js';

export class SimulationEnvironment {
    static G = 1;
    static initialVelocityMagnitude = 0.25;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
    
        this.bodies = [];
        this.particles = [];
        this.spheres = [];
        this.paths = [];
        this.lines = [];
        this.forceVectors = [];
        this.netForceVectors = [];

        this.sphereRadius = 10;
    
        this.positions = [
            [-50, 0, 0, 0x4682B4],
            [50, 0, 0, 0xFF4F4B],
            [100, 50, 50, 0x7FFF00],
        ];
        this.masses = [10, 10, 5];
    
        this.setup();

        this.forces = Array.from({ length: this.positions.length }, () => []);
        this.netForces = this.spheres.map(() => new THREE.Vector3());
        
        this.randomParticles(1000);
    
        this.running = true;
        this.showForceVectors = false;
    }

    setup() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        for (let i = 0; i < this.positions.length; i++) {
            const sphereObj = new Sphere(this.scene, this.positions[i][0], this.positions[i][1], this.positions[i][2], this.sphereRadius, 32, 32, this.positions[i][3]);
            const initialVelocity = i === 0 
                ? new THREE.Vector3(0, SimulationEnvironment.initialVelocityMagnitude, 0) 
                : new THREE.Vector3(0, -SimulationEnvironment.initialVelocityMagnitude, 0);
            
            this.spheres.push({ sphereObj: sphereObj, velocity: initialVelocity });
            this.paths.push([]);
        }

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

        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = 0; j < this.spheres.length; j++) {
                if (!this.forceVectors[i]) {
                    this.forceVectors[i] = [];
                }
                if (!this.forceVectors[j]) {
                    this.forceVectors[j] = [];
                }

                if (!this.forceVectors[i][j]) {
                    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 50 });
                    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
                    const line = new THREE.Line(geometry, material);
                    this.scene.add(line);
                    this.forceVectors[i][j] = line;
                }
            }
            if (!this.netForceVectors[i]) {
                const material = new THREE.LineBasicMaterial({ color: 0xffffff });
                const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.netForceVectors[i] = line;
            }
        }
        console.log(this.netForceVectors);
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

    updatePositions() {
        let prev_positions = [];
        this.forces = Array.from({ length: this.positions.length }, () => []);
    
        for (let i = 0; i < this.spheres.length; i++) {
            this.netForces[i] = new THREE.Vector3();
            prev_positions.push(this.spheres[i].sphereObj.sphere.position.clone());
            for (let j = i + 1; j < this.spheres.length; j++) {
                let distanceVector = new THREE.Vector3().subVectors(
                    this.spheres[j].sphereObj.sphere.position,
                    this.spheres[i].sphereObj.sphere.position
                );
                let distance = distanceVector.length();
    
                if (distance < 1) distance = 1;
                let forceMagnitude = (SimulationEnvironment.G * this.masses[i] * this.masses[j]) / (distance * distance);
                let force = distanceVector.normalize().multiplyScalar(forceMagnitude);

                this.forces[i].push(force);
                this.forces[j].push(force.clone().negate());
    
                // Update velocities
                this.spheres[i].velocity.add(force.clone().divideScalar(this.masses[i]));
                this.spheres[j].velocity.sub(force.clone().divideScalar(this.masses[j]));
    
                // Add forces to net forces
                this.netForces[i].add(force);
                this.netForces[j].sub(force);
            }
        }

        // Update positions
        for (let i = 0; i < this.spheres.length; i++) {
            this.spheres[i].sphereObj.sphere.position.add(this.spheres[i].velocity);
            this.spheres[i].sphereObj.wireframe.position.copy(this.spheres[i].sphereObj.sphere.position);
        }

        return prev_positions;
    }

    updateForceVector(i, j, force, net) {
        const directionToJ = force.clone().normalize();
        const startPoint = this.spheres[i].sphereObj.sphere.position.clone().add(directionToJ.clone().multiplyScalar(this.sphereRadius));
        const endPoint = startPoint.clone().add(force);
        
        let line;
        if (!net) {
            line = this.forceVectors[i][j];
        } else {
            line = this.netForceVectors[i];
        }
        line.geometry.setFromPoints([startPoint, endPoint]);
        line.geometry.computeBoundingSphere();
        line.visible = this.showForceVectors;
    }

    initializePath(index, color) {
        const pathGeometry = new THREE.BufferGeometry();
        const positionsArray = new Float32Array(1000 * 3);
        pathGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
        const pathMaterial = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(pathGeometry, pathMaterial);
        this.scene.add(line);
    
        this.lines[index] = line;
        this.paths[index] = [];
    }
    
    animate() {
        if (this.running) {
            let prev_positions = this.updatePositions();
            for (let i = 0; i < this.spheres.length; i++) {
                this.spheres[i].sphereObj.animateSphere(0.1, 0.1, 0.1, 0.1);
    
                // Add current position to the path
                this.paths[i].push(new THREE.Vector3(prev_positions[i].x, prev_positions[i].y, prev_positions[i].z));
                if (this.paths[i].length > 1000) {
                    this.paths[i].shift();
                }
    
                // Update line geometry
                if (!this.lines[i]) {
                    this.initializePath(i, this.positions[i][3]);
                }
    
                // Update line positions
                const positionsArray = this.lines[i].geometry.attributes.position.array;
                for (let j = 0; j < this.paths[i].length; j++) {
                    positionsArray[j * 3] = this.paths[i][j].x;
                    positionsArray[j * 3 + 1] = this.paths[i][j].y;
                    positionsArray[j * 3 + 2] = this.paths[i][j].z;
                }
    
                this.lines[i].geometry.attributes.position.needsUpdate = true;
                this.lines[i].geometry.setDrawRange(0, this.paths[i].length);
                this.lines[i].geometry.computeBoundingSphere();
            }
        }

        if (this.showForceVectors) {
            for (let i = 0; i < this.forces.length; i++) {
                for (let j = 0; j < this.spheres.length - 1; j++) {                    
                    let force = this.forces[i][j].multiplyScalar(1000);
                    
                    this.updateForceVector(i, j, force, false);
                    this.updateForceVector(j, i, force.clone().negate(), false);
                }
            }

            for (let i = 0; i < this.netForces.length; i++) {
                this.updateForceVector(i, 0, this.netForces[i].multiplyScalar(1000), true);
            }
        }

        for (let i = 0; i < this.forces.length; i++) {
            for (let j = 0; j < this.spheres.length; j++) { 
                this.forceVectors[i][j].visible = this.showForceVectors;
            }
        }

        for (let i = 0; i < this.netForces.length; i++) {
            this.netForceVectors[i].visible = this.showForceVectors;
        }
    
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    
        requestAnimationFrame(() => this.animate());
    }
}
