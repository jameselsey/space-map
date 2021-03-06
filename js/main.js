var camera, controls, scene, renderer, container;

var raycaster, mouse;

var stars = [];
var gui;

var GuiControls = function() {
    this.home = function() { console.log('clicked home!'); controls.reset(); };
    // Define render logic ...
};

init();
animate();

function init() {
    // setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;
    buildGUI();

    // Scene
    scene = new THREE.Scene();
    // Controls
    initControls();

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


function buildGUI(){
    var guiControls = new GuiControls();
    var gui = new dat.GUI();
    gui.add(guiControls, 'home');
}

function initControls(){
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );
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


