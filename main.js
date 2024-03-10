import "./style.css";
import * as THREE from "three";

//canvas
const canvas = document.querySelector("#webgl");

//シーン
const scene = new THREE.Scene();

// 背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("bg/bg.jpg");
// bgTexture.aspectRatio = window.innerWidth / window.innerHeight;
// bgTexture.magFilter = THREE.LinearFilter;
// bgTexture.minFilter = THREE.LinearMipMapLinearFilter;
// bgTexture.wrapS = THREE.ClampToEdgeWrapping;
// bgTexture.wrapT = THREE.ClampToEdgeWrapping;
// 背景をクリアに↓
bgTexture.magFilter = THREE.NearestFilter;
bgTexture.minFilter = THREE.NearestFilter;

scene.background = bgTexture;

//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

// 線形補間で滑らかに移動させる
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scaleParcent(start, end) {
  return (scrollPercent - start) / (end - start);
}

// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function: () => {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40));
    torus.position.z = lerp(10, -20, scaleParcent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function: () => {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scaleParcent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function: () => {
    camera.lookAt(box.position);
camera.position.x = lerp(0, -15, scaleParcent(60, 80));
camera.position.y = lerp(1, 15, scaleParcent(60, 80));
camera.position.z = lerp(10, 25, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 100,
  function: () => {
    camera.lookAt(box.position);
camera.position.x = lerp(0, -15, scaleParcent(60, 80));
box.rotation.x += 0.02;
box.rotation.y += 0.02;
  },
});

// アニメーションを開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent <= animation.end) {
      animation.function();
    }
  });
}

// ブラウザのスクロール率を取得
let scrollPercent = 0;

document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  console.log(scrollPercent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();

  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // 新しい画面サイズを取得
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアスペクト比を更新
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのサイズを更新
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
