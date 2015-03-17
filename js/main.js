var camera, controls, scene, renderer, container;

var raycaster, mouse;

var stars = [];

init();
animate();

function init() {
    // setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    // Scene
    scene = new THREE.Scene();
    // Controls
    controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;

    controls.addEventListener('change', render);
    // Setup world
    initStars();
    buildAxes(500);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);
}

function initStars() {
    var geometry = new THREE.SphereGeometry(5);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var sol = new THREE.Mesh(geometry, material);
    scene.add(sol);
    stars.push(sol);

    var altair = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({color: 0xFF3333}));
    altair.position.x = ( Math.random() - 0.5 ) * 100;
    altair.position.y = ( Math.random() - 0.5 ) * 100;
    altair.position.z = ( Math.random() - 0.5 ) * 100;
    altair.updateMatrix();
    altair.matrixAutoUpdate = false;
    scene.add(altair);
    stars.push(altair);
}

function onDocumentTouchStart(event) {
    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

}

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
    mouse.y = -( event.clientY / renderer.domElement.height ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(stars);

    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
        console.log("Clicked something at " + intersects[0]);
    }
}

var radius = 600;
var theta = 0;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
}


function buildAxes(length) {
    var axes = new THREE.Object3D();

    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

    scene.add(axes);
}

function buildAxis(src, dst, colorHex, dashed) {
    var geom = new THREE.Geometry(),
        mat;

    if (dashed) {
        mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3});
    } else {
        mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
    }

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    return new THREE.Line(geom, mat, THREE.LinePieces);
}