import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';

import { Sphere } from './sphere.js';
import { SimulationEnvironment } from './env.js';

// simulation environment
let env = new SimulationEnvironment();
let spheres = [];
let paths = [];
let lines = [];

// constants
const G = 1;
const initialVelocityMagnitude = 0.25;

// Define sphere positions and masses
let positions = [
    [-50, 0, 0, 0x4682B4],
    [50, 0, 0, 0xFF4F4B],
    [100, 50, 50, 0x4682B4],
];
let masses = [10, 10, 5];

// Create spheres and add to the environment
for (let i = 0; i < positions.length; i++) {
    const sphereObj = new Sphere(env.scene, positions[i][0], positions[i][1], positions[i][2], 10, 32, 32, positions[i][3]);
    const initialVelocity = i === 0 
        ? new THREE.Vector3(0, initialVelocityMagnitude, 0) 
        : new THREE.Vector3(0, -initialVelocityMagnitude, 0);
    
    spheres.push({ sphereObj: sphereObj, velocity: initialVelocity });
    paths.push([]);
}

// Function to calculate gravitational forces and update positions
function updatePositions() {
    let prev_positions = [];
    for (let i = 0; i < spheres.length; i++) {
        prev_positions.push(spheres[i].sphereObj.sphere.position.clone());
        for (let j = i + 1; j < spheres.length; j++) {
            let distanceVector = new THREE.Vector3().subVectors(
                spheres[j].sphereObj.sphere.position,
                spheres[i].sphereObj.sphere.position
            );
            let distance = distanceVector.length();

            if (distance < 1) distance = 1; // Avoid excessive force
            let forceMagnitude = (G * masses[i] * masses[j]) / (distance * distance);
            let force = distanceVector.normalize().multiplyScalar(forceMagnitude);

            spheres[i].velocity.add(force.clone().divideScalar(masses[i]));
            spheres[j].velocity.sub(force.clone().divideScalar(masses[j]));
        }
    }

    for (let i = 0; i < spheres.length; i++) {
        spheres[i].sphereObj.sphere.position.add(spheres[i].velocity);
        spheres[i].sphereObj.wireframe.position.copy(spheres[i].sphereObj.sphere.position);
    }

    return prev_positions;
}

function animate() {
    let prev_positions = updatePositions();

    for (let i = 0; i < spheres.length; i++) {
        spheres[i].sphereObj.animateSphere(0.1, 0.1, 0.1, 0.1);

        // Add current position to the path
        paths[i].push(new THREE.Vector3(prev_positions[i].x, prev_positions[i].y, prev_positions[i].z));
        if (paths[i].length > 1000) {
            paths[i].shift();
        }

        // Update line geometry
        if (!lines[i]) {
            const pathGeometry = new THREE.BufferGeometry();
            const positionsArray = new Float32Array(1000 * 3);
            pathGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
            const pathMaterial = new THREE.LineBasicMaterial({ color: positions[i][3] });
            const line = new THREE.Line(pathGeometry, pathMaterial);
            env.scene.add(line);
            lines[i] = line;
        }

        // Update line positions
        const positionsArray = lines[i].geometry.attributes.position.array;
        for (let j = 0; j < paths[i].length; j++) {
            positionsArray[j * 3] = paths[i][j].x;
            positionsArray[j * 3 + 1] = paths[i][j].y;
            positionsArray[j * 3 + 2] = paths[i][j].z;
        }

        lines[i].geometry.attributes.position.needsUpdate = true;
        lines[i].geometry.setDrawRange(0, paths[i].length);
        lines[i].geometry.computeBoundingSphere();
    }

    env.renderer.render(env.scene, env.camera);
    requestAnimationFrame(animate);
}

// Start animation
animate();
