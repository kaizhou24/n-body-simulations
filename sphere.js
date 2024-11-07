import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';

export class Sphere {
    constructor(scene, x, y, z, r, hseg, wseg, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.hseg = hseg;
        this.wseg = wseg;
        this.color = color;

        this.sphere = null;
        this.wireframe = null;

        this.createSphere(scene);
    }

    createSphere(scene) {
        const geometry = new THREE.SphereGeometry(this.r,this.hseg, this.wseg);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(this.x, this.y, this.z);

        // Create wireframe overlay
        const wireframeGeometry = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        this.wireframe.position.set(this.x, this.y, this.z);
        
        scene.add(this.sphere);
        scene.add(this.wireframe);
    }

    animateSphere() {
        this.sphere.rotation.x += 0.1;
        this.sphere.rotation.y += 0.1;
        this.wireframe.rotation.x += 0.1;
        this.wireframe.rotation.y += 0.1;
    }
}