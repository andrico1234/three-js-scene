import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
import GUI from 'lil-gui'
import constants from './constants'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({ canvas });

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(constants.camera.FOV, sizes.width / sizes.height, constants.camera.NEAR, constants.camera.FAR);
camera.position.set(constants.camera.X_POS, constants.camera.Y_POS, constants.camera.Z_POS);

// Loading textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const colorTexture = textureLoader.load('textures/marble/Red_Marble_002_COLOR.jpg')

// Platform
const platformGeometryFactory = () => {
    return new THREE.CylinderGeometry(
        constants.platform.RADIUS_TOP,
        constants.platform.RADIUS_BOTTOM,
        constants.platform.HEIGHT,
        constants.platform.RADIAL_SEGMENTS,
        constants.platform.HEIGHT_SEGMENTS
    );
}
const platformGeometry = platformGeometryFactory()

const platformMaterial = new THREE.MeshBasicMaterial({ map: colorTexture });
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
scene.add(platform);

// Water
const waterGeometry = new THREE.PlaneGeometry(constants.water.WIDTH, constants.water.HEIGHT)

const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
})

water.rotation.x = constants.water.ROTATION;

scene.add(water);

function init() {
    renderer.render(scene, camera);
    requestAnimationFrame(init)
}

init()


// GUI
const gui = new GUI();
const updateCamera = () => camera.updateProjectionMatrix()

const cameraFolder = gui.addFolder('camera').onChange(updateCamera)
cameraFolder.add(camera, 'fov', 0, 100, 1)
cameraFolder.add(camera, 'near', 0, 10, 0.1)
cameraFolder.add(camera, 'far', 100, 10000, 10)
cameraFolder.add(camera.position, 'x', -100, 100, 1)
cameraFolder.add(camera.position, 'y', 10, 100, 1)
cameraFolder.add(camera.position, 'z', 0, 100, 1)


function generateGeometry() {
    const newPlatformGeometry = platformGeometryFactory()
    platform.geometry.dispose();
    platform.geometry = newPlatformGeometry;
}

const platformFolder = gui.addFolder('platform').onChange(generateGeometry)
platformFolder.add(constants.platform, 'RADIUS_TOP', 1, 100, 1)
platformFolder.add(constants.platform, 'RADIUS_BOTTOM', 1, 100, 1)
platformFolder.add(constants.platform, 'HEIGHT', 1, 100, 1)
platformFolder.add(constants.platform, 'RADIAL_SEGMENTS', 3, 48, 1)
platformFolder.add(constants.platform, 'HEIGHT_SEGMENTS', 1, 48, 1)
