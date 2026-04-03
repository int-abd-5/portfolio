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
    color: new THREE.Color("#201820"),
    roughness: 0.46,
    metalness: 0.1,
    emissive: new THREE.Color("#09070d"),
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide,
  });

  const hairGroup = new THREE.Group();
  hairGroup.name = "abdullah_custom_hair";

  const topHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.66, 26, 22, 0, Math.PI * 2, 0, Math.PI * 0.6),
    hairMaterial
  );
  topHair.position.set(0, 0.82, 0.08);
  topHair.scale.set(1.12, 0.72, 1.03);
  topHair.castShadow = true;
  topHair.frustumCulled = false;

  const leftTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 18, 14),
    hairMaterial
  );
  leftTop.position.set(-0.31, 0.85, 0.14);
  leftTop.scale.set(0.95, 0.78, 0.88);
  leftTop.castShadow = true;
  leftTop.frustumCulled = false;

  const rightTop = leftTop.clone();
  rightTop.position.x = 0.31;

  const fringeCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 18, 14),
    hairMaterial
  );
  fringeCenter.position.set(0, 0.52, 0.48);
  fringeCenter.scale.set(1.06, 0.42, 0.58);
  fringeCenter.castShadow = true;
  fringeCenter.frustumCulled = false;

  const fringeLeft = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 10),
    hairMaterial
  );
  fringeLeft.position.set(-0.2, 0.54, 0.43);
  fringeLeft.scale.set(0.68, 0.4, 0.5);
  fringeLeft.castShadow = true;
  fringeLeft.frustumCulled = false;

  const fringeRight = fringeLeft.clone();
  fringeRight.position.x = 0.2;

  const leftSide = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 12),
    hairMaterial
  );
  leftSide.position.set(-0.36, 0.52, 0.03);
  leftSide.scale.set(0.66, 0.95, 0.58);
  leftSide.castShadow = true;
  leftSide.frustumCulled = false;

  const rightSide = leftSide.clone();
  rightSide.position.x = 0.36;

  hairGroup.add(
    topHair,
    leftTop,
    rightTop,
    fringeCenter,
    fringeLeft,
    fringeRight,
    leftSide,
    rightSide
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
