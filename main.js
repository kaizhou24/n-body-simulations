import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

import { Sphere } from './sphere.js';

let spheres = [];
let particles = []
let positions = [[-50, 0, 0, 0x4682B4], [50, 0, 0, 0xFF4F4B], [0, 0, 50, 0x4682B4], [50, 25, -100, 0xFF4F4B]];
let masses = [10, 10, 5, 5]; // Masses for each sphere
let paths = [];
let lines = [];
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

// Add plane on the z-axis
const planeGeometry = new THREE.PlaneGeometry(200, 200); // Width and height
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xf7f7f7, // Grey color
    side: THREE.DoubleSide,
    opacity: 0.2, // Semi-transparent
    transparent: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Align the plane with the x-y plane
scene.add(plane);

// Create spheres and add them to the scene with initial velocities
for (let i = 0; i < positions.length; i++) {
    const sphereObj = new Sphere(scene, positions[i][0], positions[i][1], positions[i][2], 10, 32, 32, positions[i][3]);
    // Set initial velocity perpendicular to the line connecting the two spheres
    const initialVelocity = i === 0 ? new THREE.Vector3(0, initialVelocityMagnitude, 0) : new THREE.Vector3(0, -initialVelocityMagnitude, 0);
    spheres.push({ sphereObj: sphereObj, velocity: initialVelocity });
    paths.push([]);
}

function randomParticles(num) {
    for (let i = 0; i < num; i++) {
        const size = 1000
        const x = Math.random() * size - size / 2;
        const y = Math.random() * size - size / 2;
        const z = Math.random() * size - size / 2;
        const sphereObj = new Sphere(scene, x, y, z, 0.07, 8, 8, 0xffffff, true);
        particles.push(sphereObj);
    }
}

randomParticles(1000);

// Function to calculate gravitational force and update positions
function updatePositions() {
    let prev_positions = [];
    for (let i = 0; i < spheres.length; i++) {
        prev_positions.push(spheres[i].sphereObj.sphere.position.clone());
        for (let j = i + 1; j < spheres.length; j++) {
            // Calculate distance vector between spheres i and j
            let distanceVector = new THREE.Vector3().subVectors(spheres[j].sphereObj.sphere.position, spheres[i].sphereObj.sphere.position);
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
        spheres[i].sphereObj.sphere.position.add(spheres[i].velocity);
        spheres[i].sphereObj.wireframe.position.copy(spheres[i].sphereObj.sphere.position); // Move wireframe with the sphere
    }

    return prev_positions;
}

function animate() {
    let prev_positions = updatePositions();

    for (let i = 0; i < spheres.length; i++) {
        spheres[i].sphereObj.animateSphere(0.1, 0.1, 0.1, 0.1);

        // Add current position to the path
        paths[i].push(new THREE.Vector3(prev_positions[i].x, prev_positions[i].y, prev_positions[i].z));

        // Limit path size to 5000 points
        if (paths[i].length > 5000) {
            paths[i].shift();
        }

        // Create or update the line
        if (!lines[i]) {
            // Initialize the geometry and material for the line
            const pathGeometry = new THREE.BufferGeometry();
            const positionsArray = new Float32Array(5000 * 3); // Allocate space for 5000 points (x, y, z)
            pathGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
            const pathMaterial = new THREE.LineBasicMaterial({ color: positions[i][3] });
            const line = new THREE.Line(pathGeometry, pathMaterial);
            scene.add(line);
            lines[i] = line;
        }

        // Update the geometry with the current path points
        const positionsArray = lines[i].geometry.attributes.position.array;
        for (let j = 0; j < paths[i].length; j++) {
            positionsArray[j * 3] = paths[i][j].x;
            positionsArray[j * 3 + 1] = paths[i][j].y;
            positionsArray[j * 3 + 2] = paths[i][j].z;
        }

        // Update the attribute to reflect the new data
        lines[i].geometry.attributes.position.needsUpdate = true;

        // Set the draw range to match the number of points in the path
        lines[i].geometry.setDrawRange(0, paths[i].length);

        // Recompute the bounding sphere to ensure visibility
        lines[i].geometry.computeBoundingSphere();
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
