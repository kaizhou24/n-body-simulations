import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

export function createSphere(scene, x, y, z, color) {
    // Create a sphere geometry and material
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    // Create wireframe overlay
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframe.position.set(x, y, z);
    
    scene.add(sphere);
    scene.add(wireframe);
    
    return { sphere, wireframe }; // Return both the sphere and wireframe
}

export function animateSphere(sphere, wireframe) {
    sphere.rotation.x += 0.1;
    sphere.rotation.y += 0.1;
    wireframe.rotation.x += 0.1;
    wireframe.rotation.y += 0.1;
}