import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

export function createSphere() {
    // Create a sphere geometry and material
    const geometry = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI);
    const material = new THREE.MeshBasicMaterial({ color: 0x4682B4 });
    const sphere = new THREE.Mesh(geometry, material);

    // Create wireframe overlay
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    return { sphere, wireframe }; // Return both the sphere and wireframe
}