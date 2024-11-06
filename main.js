import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';

// Set up renderer, scene, and camera
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 50;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere with a darker blue material
const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x4682B4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add wireframe overlay
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
scene.add(wireframe);

function animate() {
    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.002;
    wireframe.rotation.x += 0.002;
    wireframe.rotation.y += 0.002;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
