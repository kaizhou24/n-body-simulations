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

// Create the first sphere
const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x4682B4 });
const sphere1 = new THREE.Mesh(geometry, material);
scene.add(sphere1);

// Add wireframe overlay for the first sphere
const wireframeGeometry1 = new THREE.WireframeGeometry(geometry);
const wireframeMaterial1 = new THREE.LineBasicMaterial({ color: 0xffffff });
const wireframe1 = new THREE.LineSegments(wireframeGeometry1, wireframeMaterial1);
scene.add(wireframe1);

// Position the wireframe to match the first sphere
wireframe1.position.copy(sphere1.position);

// Create the second sphere at a different position to avoid overlap
const sphere2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xFF6347 })); // Different color
sphere2.position.set(25, 0, 0); // Offset by 25 units on the x-axis
scene.add(sphere2);

// Add wireframe overlay for the second sphere
const wireframeGeometry2 = new THREE.WireframeGeometry(geometry);
const wireframeMaterial2 = new THREE.LineBasicMaterial({ color: 0xffffff });
const wireframe2 = new THREE.LineSegments(wireframeGeometry2, wireframeMaterial2);
wireframe2.position.copy(sphere2.position); // Position the wireframe to match the second sphere
scene.add(wireframe2);

function animate() {
    // Rotate both spheres and their wireframes
    sphere1.rotation.x += 0.002;
    sphere1.rotation.y += 0.002;
    wireframe1.rotation.x += 0.002;
    wireframe1.rotation.y += 0.002;

    sphere2.rotation.x += 0.002;
    sphere2.rotation.y += 0.002;
    wireframe2.rotation.x += 0.002;
    wireframe2.rotation.y += 0.002;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
