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
    color: new THREE.Color("#19131f"),
    roughness: 0.62,
    metalness: 0.12,
  });

  const hairGroup = new THREE.Group();
  hairGroup.name = "abdullah_custom_hair";

  const topHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.56, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.56),
    hairMaterial
  );
  topHair.position.set(0, 0.45, 0.05);
  topHair.scale.set(1.08, 0.75, 1);
  topHair.castShadow = true;

  const fringe = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
    hairMaterial
  );
  fringe.position.set(0, 0.18, 0.34);
  fringe.scale.set(0.95, 0.52, 0.68);
  fringe.castShadow = true;

  const leftSide = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    hairMaterial
  );
  leftSide.position.set(-0.28, 0.17, 0.05);
  leftSide.scale.set(0.8, 1.2, 0.65);
  leftSide.castShadow = true;

  const rightSide = leftSide.clone();
  rightSide.position.x = 0.28;

  hairGroup.add(topHair, fringe, leftSide, rightSide);
  headAnchor.add(hairGroup);
};

const applyFitBodyProportions = (character: THREE.Object3D) => {
  const scaleBone = (name: string, x: number, y: number, z: number) => {
    const bone = character.getObjectByName(name);
    if (bone) {
      bone.scale.set(x, y, z);
    }
  };

  scaleBone("spine004", 1.06, 1.04, 1.05);
  scaleBone("spine003", 1.04, 1.02, 1.03);
  scaleBone("spine002", 0.97, 1.02, 0.97);
  scaleBone("upper_armL", 1.07, 1.03, 1.04);
  scaleBone("upper_armR", 1.07, 1.03, 1.04);
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
