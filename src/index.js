import * as THREE from 'three';
import * as Matter from 'matter-js';


import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {log} from "three/nodes";

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('hello');
  init3D();
  initMatter();
});


let actionIdle = null;
let actionHello = null;
let actionWow = null;

// Init Function
function init3D() {
  // select container
  const viewport = document.querySelector('[data-3d="c"]');
  // console.log(viewport);

  // create scened and renderer and camera
  const scene = new THREE.Scene();



  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(viewport.offsetWidth, viewport.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.LinearToneMapping
  let mixer = null

  let eyesGroup = null;
  viewport.appendChild(renderer.domElement);

  // add an object

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  // directionalLight.position.set(- 5, 5, 0)
  // scene.add(directionalLight)

  // https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/66363d89c40e1c754427a639_simpleShadow.jpg


  camera.position.z = 3;
  camera.position.x = 0.1;
  camera.position.y = 0.5;




  const rgbeLoader = new RGBELoader();

  const modelLoader = new GLTFLoader();

  const textureLoader = new THREE.TextureLoader();

  const simpleShadowTexture = textureLoader.load('https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/66363d89c40e1c754427a639_simpleShadow.jpg')

  const geometry = new THREE.PlaneGeometry(1.7,1.0);
  const material = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, alphaMap: simpleShadowTexture});
  const simpleShadow = new THREE.Mesh(geometry, material)
  simpleShadow.position.y = -0.6
  simpleShadow.rotation.x = -Math.PI / 2;

  scene.add(simpleShadow);

  rgbeLoader.load('https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663618ef81c78be7480414f0_bread.hdr.txt', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    envMap.encoding = THREE.sRGBEncoding;
    // scene.background = envMap
    scene.environment = envMap;
  })

  modelLoader.load(
      'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a6fb7a47a08fa77cbbc2f_bread_512.glb.txt',
      (gltf) =>
      {

        gltf.scene.rotation.y = -0.4;
        gltf.scene.position.y = -0.6;

        console.log(gltf.scene)

        gltf.scene.traverse((item)=> {

          if (item.isMesh) {
            if (item.name === 'Bread_rigBodyParts001') {
              item.material = new THREE.MeshBasicMaterial({color: 0xab4a6c});
              // eyesGroup = item;
            }

            if (item.name === 'Bread_rigBodyParts007') {
              console.log(item)
              // item.material = new THREE.MeshBasicMaterial({color: 0xab4aa3});
              eyesGroup = item;
            }

          }
        })

        scene.add(gltf.scene)


        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        actionHello = mixer.clipAction(gltf.animations[0])
        actionIdle = mixer.clipAction(gltf.animations[1])
        actionWow = mixer.clipAction(gltf.animations[2])


        actionHello.play()

        setTimeout(()=> {
          actionIdle.reset()
          actionIdle.play()
          actionIdle.crossFadeFrom(actionHello, 0.5)
        }, 2500)

      }
  )

  const sizes = {
    width: viewport.offsetWidth,
    height: viewport.offsetHeight
  }

  window.addEventListener('resize', () =>
  {
    // Update sizes
    sizes.width = viewport.offsetWidth
    sizes.height = viewport.offsetHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  const clock = new THREE.Clock()
  let previousTime = 0

  const tick = () =>
  {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // console.log(window.innerHeight, window.scrollY)

    const cameraZPositionOffset = Math.min(1, window.scrollY / window.innerHeight)

    camera.position.z = 3.5 - (1 * cameraZPositionOffset);

    // camera.position.z +=1

    // Model animation
    if(mixer)
    {
      mixer.update(deltaTime)
    }

    // console.log(eyesGroup)

    if (eyesGroup) {


      // console.log(eyesGroup.position.x)
      // eyesGroup.position.x += 0.1

    }

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()

}

const matterItems = {
  small: [],
  medium: [
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d550f71e1ccc6e5ba16_m_1_md.png',
      size: {
        width: 232,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d56c08cd6ec1fa559b3_m_2_md.png',
      size: {
        width: 341,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d57c4639524b8868332_m_3_md.png',
      size: {
        width: 236,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d55ef54a087ae1a5b47_m_4_md.png',
      size: {
        width: 163,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d5515cbaf5b9c9e1a05_m_5_md.png',
      size: {
        width: 323,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d55d8739cd5297ea4a0_m_6_md.png',
      size: {
        width: 226,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d559c8958be2ea0ec9b_m_7_md.png',
      size: {
        width: 313,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d566797a2cdf0cf98ea_m_8_md.png',
      size: {
        width: 252,
        height: 71,
      }
    },
    {
      url: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d56c08cd6ec1fa559ac_m_9_md.png',
      size: {
        width: 319,
        height: 71,
      }
    }
  ],
  large: []
}

const initMatter = () => {
  let Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

// create an engine
  let engine = Engine.create();

  engine.gravity.scale = 0.0009

// create a renderer

  const matterContainer = document.querySelector('[data-3d="m"]');

  let render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
      wireframes: false,
      background: "transparent",
      width: matterContainer.clientWidth,
      height: matterContainer.clientHeight,
      // showAngleIndicator: true
    }
  });

// create two boxes and a ground
//   let boxA = Bodies.rectangle(600, 200, 231, 70, {render: {sprite: {texture: 'https://uploads-ssl.webflow.com/662c0bc32e7dd9f1cb0173e4/663a4d550f71e1ccc6e5ba16_m_1_md.png', xScale: 1,
//         yScale: 1}}});
//   let boxB = Bodies.rectangle(450, 50, 80, 80);



  const currentObjects = []

  let ground = null;
  let leftWall = null;
  let rightWall = null;

  const createItems = (size = 'medium') => {
    matterItems[size].forEach((item) => {
      const object = Bodies.rectangle(Math.random() * matterContainer.clientWidth, -matterContainer.clientHeight / 2, item.size.width, item.size.height, {angle: (Math.random() - 0.5), render: {sprite: {texture: item.url}}});
      currentObjects.push(object)
      Composite.add(engine.world, object);
    })

    ground = Bodies.rectangle(matterContainer.clientWidth / 2, matterContainer.clientHeight + 1, matterContainer.clientWidth, 1, { isStatic: true });
    leftWall = Bodies.rectangle(-1, matterContainer.clientHeight / 2, 1, matterContainer.clientHeight * 5, { isStatic: true });
    rightWall = Bodies.rectangle(matterContainer.clientWidth + 1, matterContainer.clientHeight / 2, 1, matterContainer.clientHeight * 5, { isStatic: true });


// add all of the bodies to the world
    Composite.add(engine.world, [ ground, leftWall, rightWall]);
  }





// run the renderer
  Render.run(render);

// create runner
  let runner = Runner.create();

// run the engine
  Runner.run(runner, engine);

  window.addEventListener('resize', ()=> {
    render.canvas.width = matterContainer.clientWidth;
    render.canvas.height = matterContainer.clientHeight;

    if (ground && leftWall && rightWall) {
      Matter.Body.setPosition(ground, Matter.Vector.create(matterContainer.clientWidth / 2, matterContainer.clientHeight + 1));
      Matter.Body.setPosition(leftWall, Matter.Vector.create(-1, matterContainer.clientHeight / 2));
      Matter.Body.setPosition(rightWall, Matter.Vector.create(matterContainer.clientWidth + 1, matterContainer.clientHeight / 2));
    }

  })

  let isAnimationPlayed = false;

  window.addEventListener('scroll', ()=> {

    if (window.scrollY >= (window.innerHeight * 0.8) && !isAnimationPlayed) {
      isAnimationPlayed = true
      createItems()


      actionWow.reset()
      actionWow.play()

      actionWow.crossFadeFrom(actionIdle, 0.5)

      setTimeout(()=> {
        actionIdle.reset()
        actionIdle.play()
        actionIdle.crossFadeFrom(actionWow, 0.5)
      }, 2500)

    }


  })

}

