import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

const CANVAS = document.getElementById("canvas");
const SIZES = { width: window.innerWidth, height: window.innerHeight };

// Add a listener to handle window resizing
window.addEventListener("resize", handleResize);

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  SIZES.width / SIZES.height,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas: CANVAS });

// Set renderer properties
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(SIZES.width, SIZES.height);

// Set the initial camera position
camera.position.setZ(20);

// Moon
const moonTexture = new THREE.TextureLoader().load("/images/moon.png");
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(geometry, material);
scene.add(moon);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.75);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(12, 4, 4);
scene.add(directionalLight);

// Create OrbitControls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 8;
controls.maxDistance = 150;
controls.zoomSpeed = 0.5;

// Stars field
const stars = [];
const starCount = SIZES.width * 6;
for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  stars.push(x, y, z);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(stars, 3)
);
const starMaterial = new THREE.PointsMaterial({ size: 0.02 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Start the animation loop
animate();

function animate() {
  requestAnimationFrame(animate);

  // Rotate the moon and star field
  moon.rotateY(0.001);
  starField.rotateX(0.0001);
  starField.rotateY(0.0001);

  // Update the camera controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

function handleResize() {
  SIZES.width = window.innerWidth;
  SIZES.height = window.innerHeight;

  // Update camera aspect ratio and renderer size
  camera.aspect = SIZES.width / SIZES.height;
  camera.updateProjectionMatrix();
  renderer.setSize(SIZES.width, SIZES.height);
}
