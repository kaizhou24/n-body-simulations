import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Enable anti-aliasing
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 50;
controls.addEventListener('change', ()=>{renderer.render(scene, camera)});
controls.update();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Create a sphere with a darker blue material
const geometry = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, Math.PI);
const material = new THREE.MeshBasicMaterial({ color: 0x4682B4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add wireframe overlay
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
scene.add(wireframe);

function animate() {
    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.002;
    wireframe.rotation.x += 0.002;
    wireframe.rotation.y += 0.002;

    requestAnimationFrame( animate );
    controls.update();
    
    renderer.render(scene, camera);
}