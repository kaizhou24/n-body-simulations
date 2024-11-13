import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';

export class Sphere {
    constructor(scene, x, y, z, r, hseg, wseg, color, translucent=false) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.hseg = hseg;
        this.wseg = wseg;
        this.color = color;
        this.translucent = translucent;

        this.sphere = null;
        this.wireframe = null;

        this.createSphere(scene);
    }

    createSphere(scene) {
        const geometry = new THREE.SphereGeometry(this.r,this.hseg, this.wseg);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        if (this.translucent) {
            material.transparent = true;
            material.opacity = 0.8;
        }

        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(this.x, this.y, this.z);

        // Create wireframe overlay
        const wireframeGeometry = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        if (this.translucent) {
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 0.5;
        }
        this.wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        this.wireframe.position.set(this.x, this.y, this.z);
        
        scene.add(this.sphere);
        scene.add(this.wireframe);
    }

    animateSphere(sx, sy, wx, wy) {
        this.sphere.rotation.x += sx;
        this.sphere.rotation.y += sy;
        this.wireframe.rotation.x += wx;
        this.wireframe.rotation.y += wy;
    }
}