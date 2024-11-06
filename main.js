import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

import { createSphere, animateSphere } from './sphere.js';

let spheres = [];
let positions = [[-20, 20, 0, 0x4682B4], [20, 20, 0, 0x4682B4], [-20, -20, 0, 0x4682B4], [20, -20, 0, 0x4682B4]];

// Set up renderer, scene, and camera
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 50;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

for (let i = 0; i < 4; i++) {
    const { sphere, wireframe } = createSphere(scene, positions[i][0], positions[i][1], positions[i][2], positions[i][3]);
    spheres.push({ sphere, wireframe });
}

function animate() {
    for (let i = 0; i < spheres.length; i++) {
        animateSphere(spheres[i].sphere, spheres[i].wireframe);
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
