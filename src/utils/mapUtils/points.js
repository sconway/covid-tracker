import * as THREE from "THREE";

let baseGeometry = new THREE.Geometry();
let points;
let isAnimated = false;

export const createPoints = (scene) => {
    if (baseGeometry !== undefined) {
        if (!isAnimated) {
            points = new THREE.Mesh(baseGeometry, new THREE.MeshBasicMaterial({
                color: 0xffffff,
                vertexColors: THREE.FaceColors,
                morphTargets: false
            }));
        } else {
            if (baseGeometry.morphTargets.length < 8) {
                console.log('t l', baseGeometry.morphTargets.length);
                var padding = 8 - baseGeometry.morphTargets.length;
                console.log('padding', padding);

                for(var i=0; i<=padding; i++) {
                    console.log('padding',i);
                    baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: baseGeometry.vertices});
                }
            }

            points = new THREE.Mesh(baseGeometry, new THREE.MeshBasicMaterial({
                color: 0xffffff,
                vertexColors: THREE.FaceColors,
                morphTargets: true
            }));
        }
        
        scene.add(points);
    }
}

export const addPoint = (lat, lng, size, color, mesh) => {
    let phi = (90 - lat) * Math.PI / 180;
    let theta = (180 - lng) * Math.PI / 180;

    let geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0,0,-0.5));

    let point = new THREE.Mesh(geometry);

    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);

    point.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
    point.updateMatrix();

    for (let i = 0; i < point.geometry.faces.length; i++) {
        point.geometry.faces[i].color = color;
    }
    
    if(point.matrixAutoUpdate){
        point.updateMatrix();
    }

    baseGeometry.merge(point.geometry, point.matrix);
}