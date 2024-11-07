import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

import { createSphere } from './sphere.js';

let spheres = [];
let positions = [[-50, 0, 0, 0x4682B4], [50, 0, 0, 0xFF4F4B]];
let masses = [10, 10]; // Masses for each sphere
const G = 1; // Gravitational constant, scaled for simulation
const initialVelocityMagnitude = 0.25; // Initial velocity for orbiting

// Set up renderer, scene, and camera
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 150;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spheres and add them to the scene with initial velocities
for (let i = 0; i < positions.length; i++) {
    const { sphere, wireframe } = createSphere(scene, positions[i][0], positions[i][1], positions[i][2], positions[i][3]);
    // Set initial velocity perpendicular to the line connecting the two spheres
    const initialVelocity = i === 0 ? new THREE.Vector3(0, initialVelocityMagnitude, 0) : new THREE.Vector3(0, -initialVelocityMagnitude, 0);
    spheres.push({ sphere, wireframe, velocity: initialVelocity });
}

// Function to calculate gravitational force and update positions
function updatePositions() {
    for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
            // Calculate distance vector between spheres i and j
            let distanceVector = new THREE.Vector3().subVectors(spheres[j].sphere.position, spheres[i].sphere.position);
            let distance = distanceVector.length();

            // Prevent excessive force when distance is too small
            if (distance < 1) distance = 1;

            // Calculate force magnitude using Newton's gravity equation
            let forceMagnitude = (G * masses[i] * masses[j]) / (distance * distance);
            let force = distanceVector.normalize().multiplyScalar(forceMagnitude);

            // Update velocities based on force (F = m * a -> a = F / m)
            spheres[i].velocity.add(force.clone().divideScalar(masses[i]));
            spheres[j].velocity.sub(force.clone().divideScalar(masses[j]));
        }
    }

    // Update positions based on velocities
    for (let i = 0; i < spheres.length; i++) {
        spheres[i].sphere.position.add(spheres[i].velocity);
        spheres[i].wireframe.position.copy(spheres[i].sphere.position); // Move wireframe with the sphere
    }
}

// Animation loop
function animate() {
    updatePositions();

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
