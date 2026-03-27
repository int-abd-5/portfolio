import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const addHairLayer = (character: THREE.Object3D) => {
  if (character.getObjectByName("abdullah_custom_hair")) return;

  const headAnchor =
    character.getObjectByName("spine006") ||
    character.getObjectByName("head") ||
    character.getObjectByName("Head");

  if (!headAnchor) return;

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1f1725"),
    roughness: 0.58,
    metalness: 0.18,
  });

  const hairGroup = new THREE.Group();
  hairGroup.name = "abdullah_custom_hair";

  const topHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.53, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.57),
    hairMaterial
  );
  topHair.position.set(0, 0.42, 0.03);
  topHair.scale.set(1.04, 0.7, 0.98);
  topHair.castShadow = true;

  const leftTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 12),
    hairMaterial
  );
  leftTop.position.set(-0.24, 0.48, 0.09);
  leftTop.scale.set(0.95, 0.75, 0.85);
  leftTop.castShadow = true;

  const rightTop = leftTop.clone();
  rightTop.position.x = 0.24;

  const fringeCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 12),
    hairMaterial
  );
  fringeCenter.position.set(0, 0.18, 0.31);
  fringeCenter.scale.set(1, 0.42, 0.55);
  fringeCenter.castShadow = true;

  const fringeLeft = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 14, 10),
    hairMaterial
  );
  fringeLeft.position.set(-0.16, 0.2, 0.29);
  fringeLeft.scale.set(0.7, 0.42, 0.5);
  fringeLeft.castShadow = true;

  const fringeRight = fringeLeft.clone();
  fringeRight.position.x = 0.16;

  const leftSide = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    hairMaterial
  );
  leftSide.position.set(-0.29, 0.13, 0.04);
  leftSide.scale.set(0.72, 1.04, 0.6);
  leftSide.castShadow = true;

  const rightSide = leftSide.clone();
  rightSide.position.x = 0.28;

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

const addFacialHairDetails = (character: THREE.Object3D) => {
  if (character.getObjectByName("abdullah_custom_beard")) return;

  const headAnchor =
    character.getObjectByName("spine006") ||
    character.getObjectByName("head") ||
    character.getObjectByName("Head");

  if (!headAnchor) return;

  const beardMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#221922"),
    roughness: 0.74,
    metalness: 0.08,
  });

  const beardGroup = new THREE.Group();
  beardGroup.name = "abdullah_custom_beard";

  const mustache = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 14, 10),
    beardMaterial
  );
  mustache.position.set(0, -0.04, 0.42);
  mustache.scale.set(1.6, 0.35, 0.45);
  mustache.castShadow = true;

  const chinPatch = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 14, 10),
    beardMaterial
  );
  chinPatch.position.set(0, -0.22, 0.37);
  chinPatch.scale.set(1, 0.5, 0.4);
  chinPatch.castShadow = true;

  beardGroup.add(mustache, chinPatch);
  headAnchor.add(beardGroup);
};

const applyFitBodyProportions = (character: THREE.Object3D) => {
  const scaleBone = (name: string, x: number, y: number, z: number) => {
    const bone = character.getObjectByName(name);
    if (bone) {
      bone.scale.set(x, y, z);
    }
  };

  scaleBone("spine006", 0.97, 1.02, 0.97);
  scaleBone("spine005", 1.01, 1.04, 1.01);
  scaleBone("spine004", 1.05, 1.04, 1.04);
  scaleBone("spine003", 1.03, 1.02, 1.03);
  scaleBone("spine002", 0.96, 1.02, 0.96);
  scaleBone("upper_armL", 1.06, 1.03, 1.03);
  scaleBone("upper_armR", 1.06, 1.03, 1.03);
  scaleBone("thighL", 1.03, 1.02, 1.03);
  scaleBone("thighR", 1.03, 1.02, 1.03);
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

                // Hide hat/cap geometry to better match Abdullah's look.
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
            addFacialHairDetails(character);

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
