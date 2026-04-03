import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const findHeadAnchor = (character: THREE.Object3D) => {
  const preferred = [
    "head",
    "Head",
    "spine006",
    "spine005",
    "neck",
    "Neck",
  ];
  for (const name of preferred) {
    const found = character.getObjectByName(name);
    if (found) return found;
  }

  let fallback: THREE.Object3D | null = null;
  character.traverse((obj: any) => {
    if (fallback) return;
    if (obj?.isBone && typeof obj.name === "string") {
      const n = obj.name.toLowerCase();
      if (n.includes("head") || n.includes("neck")) {
        fallback = obj;
      }
    }
  });
  return fallback ?? character;
};

const addHairLayer = (character: THREE.Object3D) => {
  if (character.getObjectByName("abdullah_custom_hair")) return;

  const headAnchor = findHeadAnchor(character);

  if (!headAnchor) return;

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1c131c"),
    roughness: 0.42,
    metalness: 0.06,
    emissive: new THREE.Color("#09070d"),
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
  });

  const hairGroup = new THREE.Group();
  hairGroup.name = "abdullah_custom_hair";

  const topHair = new THREE.Mesh(new THREE.SphereGeometry(0.78, 28, 24), hairMaterial);
  topHair.position.set(0, 0.98, 0.03);
  topHair.scale.set(1.14, 0.56, 1.08);
  topHair.castShadow = true;
  topHair.frustumCulled = false;

  const leftTop = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), hairMaterial);
  leftTop.position.set(-0.32, 0.95, 0.12);
  leftTop.scale.set(0.9, 0.75, 0.84);
  leftTop.castShadow = true;
  leftTop.frustumCulled = false;

  const rightTop = leftTop.clone();
  rightTop.position.x = 0.31;

  const fringeCenter = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), hairMaterial);
  fringeCenter.position.set(0, 0.58, 0.44);
  fringeCenter.scale.set(1.08, 0.34, 0.5);
  fringeCenter.castShadow = true;
  fringeCenter.frustumCulled = false;

  const fringeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), hairMaterial);
  fringeLeft.position.set(-0.23, 0.59, 0.38);
  fringeLeft.scale.set(0.62, 0.34, 0.44);
  fringeLeft.castShadow = true;
  fringeLeft.frustumCulled = false;

  const fringeRight = fringeLeft.clone();
  fringeRight.position.x = 0.2;

  const leftSide = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), hairMaterial);
  leftSide.position.set(-0.35, 0.63, 0.0);
  leftSide.scale.set(0.58, 0.82, 0.5);
  leftSide.castShadow = true;
  leftSide.frustumCulled = false;

  const rightSide = leftSide.clone();
  rightSide.position.x = 0.36;

  const crownSpike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.34, 16), hairMaterial);
  crownSpike.position.set(0.02, 1.18, 0.05);
  crownSpike.rotation.set(0.12, 0.05, -0.08);
  crownSpike.castShadow = true;
  crownSpike.frustumCulled = false;

  hairGroup.add(
    topHair,
    leftTop,
    rightTop,
    fringeCenter,
    fringeLeft,
    fringeRight,
    leftSide,
    rightSide,
    crownSpike
  );
  headAnchor.add(hairGroup);
};

const applyFitBodyProportions = (character: THREE.Object3D) => {
  const scaleBone = (name: string, x: number, y: number, z: number) => {
    const bone = character.getObjectByName(name);
    if (bone) {
      bone.scale.set(x, y, z);
    }
  };

  scaleBone("spine006", 0.97, 1.02, 0.96);
  scaleBone("spine005", 0.98, 1.03, 0.97);
  scaleBone("spine004", 0.94, 1.04, 0.94);
  scaleBone("spine003", 0.93, 1.02, 0.93);
  scaleBone("spine002", 0.9, 1.01, 0.9);
  scaleBone("upper_armL", 0.95, 1.02, 0.95);
  scaleBone("upper_armR", 0.95, 1.02, 0.95);
  scaleBone("thighL", 0.98, 1.01, 0.98);
  scaleBone("thighR", 0.98, 1.01, 0.98);
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc?v=2",
          "MyCharacter12"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                const meshName = mesh.name.toLowerCase();

                // Hide hat-style accessories.
                if (
                  meshName.includes("hat") ||
                  meshName.includes("cap") ||
                  meshName.includes("helmet")
                ) {
                  mesh.visible = false;
                  return;
                }

                // Change clothing colors to match site theme
                if (mesh.material) {
                  if (mesh.name === "BODY.SHIRT") {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#1C2A56");
                    newMat.roughness = 0.84;
                    mesh.material = newMat;
                  } else if (mesh.name === "Pant" || meshName.includes("pant")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#111A34");
                    newMat.roughness = 0.92;
                    mesh.material = newMat;
                  } else if (meshName.includes("shoe") || meshName.includes("footwear")) {
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#2A1A1A");
                    mesh.material = newMat;
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            applyFitBodyProportions(character);
            addHairLayer(character);

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
