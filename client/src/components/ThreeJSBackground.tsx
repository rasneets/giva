import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeJSBackgroundProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ThreeJSBackground({ containerRef }: ThreeJSBackgroundProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Group | null>(null);
  const metroidObjectsRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Warm light (like gold)
    const warmLight = new THREE.PointLight(0xFFD700, 1.5, 10);
    warmLight.position.set(2, 3, 4);
    scene.add(warmLight);
    
    // Cool light for contrast
    const coolLight = new THREE.PointLight(0xFFFFFF, 1, 10);
    coolLight.position.set(-3, 1, 4);
    scene.add(coolLight);
    
    // Rim light for shine effect
    const rimLight = new THREE.PointLight(0xFFF8E0, 0.8, 10);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);
    
    // Moving spotlight
    const spotLight = new THREE.SpotLight(0xFFFACD, 1.5, 20, Math.PI / 6, 0.5);
    spotLight.position.set(5, 5, 5);
    scene.add(spotLight);
    
    // 3D Objects Group
    const objectsGroup = new THREE.Group();
    objectsGroupRef.current = objectsGroup;
    scene.add(objectsGroup);
    
    // Stars Group
    const starsGroup = new THREE.Group();
    starsGroupRef.current = starsGroup;
    scene.add(starsGroup);
    
    // Create starfield (particles)
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Positions: distribute stars in 3D space (further away to create depth)
      const i3 = i * 3;
      // Create a wider distribution with more variation
      positions[i3] = (Math.random() - 0.5) * 50; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 50; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 30 - 15; // z (mostly behind)
      
      // Randomize sizes
      starSizes[i] = Math.random() * 2 + 0.5;
      
      // Colors: gold-yellows with some variation
      starColors[i3] = 0.8 + Math.random() * 0.2; // R: gold (high)
      starColors[i3 + 1] = 0.7 + Math.random() * 0.3; // G: gold (medium-high)
      starColors[i3 + 2] = 0.1 + Math.random() * 0.3; // B: gold (low)
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starsGeometry, starMaterial);
    starsGroup.add(stars);
    
    // Metroid-like objects group
    const metroidObjects = new THREE.Group();
    metroidObjectsRef.current = metroidObjects;
    scene.add(metroidObjects);
    
    // Create floating metroid-like objects
    const metroidCount = 8;
    const metroidColors = [0xD4AF37, 0xF5E7A3, 0xFFD700, 0xDAA520];
    
    for (let i = 0; i < metroidCount; i++) {
      // Create a metroid-like object (small complex shape)
      const metroidGroup = new THREE.Group();
      
      // Main body (sphere)
      const bodyGeometry = new THREE.SphereGeometry(0.3, 12, 12);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: metroidColors[i % metroidColors.length],
        metalness: 0.7,
        roughness: 0.3,
        emissive: metroidColors[i % metroidColors.length],
        emissiveIntensity: 0.3
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      metroidGroup.add(body);
      
      // Spikes/tentacles
      const spikeCount = 4 + Math.floor(Math.random() * 3);
      for (let j = 0; j < spikeCount; j++) {
        const spikeGeometry = new THREE.ConeGeometry(0.1, 0.4, 5);
        const spikeMaterial = new THREE.MeshStandardMaterial({
          color: metroidColors[(i + j) % metroidColors.length],
          metalness: 0.6,
          roughness: 0.4
        });
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        
        // Position spikes around body
        const angle = (j / spikeCount) * Math.PI * 2;
        spike.position.set(
          Math.cos(angle) * 0.35,
          Math.sin(angle) * 0.35,
          0
        );
        
        // Orient spikes outward
        spike.lookAt(
          spike.position.x * 2,
          spike.position.y * 2,
          spike.position.z
        );
        
        metroidGroup.add(spike);
      }
      
      // Add glowing center
      const coreGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFD700,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      metroidGroup.add(core);
      
      // Position metroid in the scene (spread them out)
      metroidGroup.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 10
      );
      
      // Random scale variation
      const scale = 0.5 + Math.random() * 1.2;
      metroidGroup.scale.set(scale, scale, scale);
      
      // Random rotation
      metroidGroup.rotation.x = Math.random() * Math.PI;
      metroidGroup.rotation.y = Math.random() * Math.PI;
      metroidGroup.rotation.z = Math.random() * Math.PI;
      
      // Store movement parameters as userData
      metroidGroup.userData = {
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        speedZ: (Math.random() - 0.5) * 0.01,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulseSpeed: 0.5 + Math.random() * 0.5,
        sinOffset: Math.random() * Math.PI * 2
      };
      
      metroidObjects.add(metroidGroup);
    }
    
    // Main ring
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 50);
    const ringMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37, 
      metalness: 0.9, 
      roughness: 0.1 
    });
    const ring = new THREE.Mesh(torusGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    objectsGroup.add(ring);
    
    // Add second ring
    const torusGeometry2 = new THREE.TorusGeometry(2.0, 0.15, 16, 50);
    const ringMaterial2 = new THREE.MeshStandardMaterial({ 
      color: 0xF5E7A3, 
      metalness: 0.7, 
      roughness: 0.2 
    });
    const ring2 = new THREE.Mesh(torusGeometry2, ringMaterial2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    objectsGroup.add(ring2);
    
    // Add third ring
    const torusGeometry3 = new THREE.TorusGeometry(1.2, 0.1, 16, 50);
    const ringMaterial3 = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700, 
      metalness: 0.8, 
      roughness: 0.1 
    });
    const ring3 = new THREE.Mesh(torusGeometry3, ringMaterial3);
    ring3.rotation.x = Math.PI / 5;
    ring3.rotation.z = Math.PI / 3;
    objectsGroup.add(ring3);
    
    // Add orbs
    const orbColors = [0xD4AF37, 0xF5E7A3, 0xFFD700]; // Gold colors
    const orbGeometry = new THREE.OctahedronGeometry(0.3, 2);
    
    for (let i = 0; i < 6; i++) {
      const orbMaterial = new THREE.MeshStandardMaterial({ 
        color: orbColors[i % orbColors.length], 
        metalness: 0.3, 
        roughness: 0.2
      });
      
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      
      // Position orbs around the ring
      const angle = (i / 6) * Math.PI * 2;
      orb.position.x = Math.cos(angle) * 1.5;
      orb.position.y = Math.sin(angle) * 1.5;
      orb.position.z = 0.2;
      
      orb.rotation.x = Math.random() * Math.PI;
      orb.rotation.y = Math.random() * Math.PI;
      
      objectsGroup.add(orb);
    }
    
    // Time variables for animation
    let time = 0;
    const clock = new THREE.Clock();
    
    // Animation function
    const animate = () => {
      time += clock.getDelta() * 0.5;
      
      if (objectsGroupRef.current) {
        // Main group rotation
        objectsGroupRef.current.rotation.y += 0.003;
        objectsGroupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
        
        // Animate individual rings
        if (objectsGroupRef.current.children.length > 0) {
          // First ring
          const ring1 = objectsGroupRef.current.children[0];
          ring1.rotation.y = time * 0.3;
          ring1.position.y = Math.sin(time * 0.5) * 0.2;
          
          // Second ring
          const ring2 = objectsGroupRef.current.children[1];
          ring2.rotation.x = time * 0.2;
          ring2.rotation.z = time * 0.1;
          
          // Third ring
          const ring3 = objectsGroupRef.current.children[2];
          ring3.rotation.z = -time * 0.4;
          ring3.rotation.x = Math.sin(time * 0.3) * 0.2 + Math.PI / 5;
          
          // Animate orbs
          for (let i = 3; i < objectsGroupRef.current.children.length; i++) {
            const orb = objectsGroupRef.current.children[i];
            const idx = i - 3;
            orb.position.y = Math.sin(time + idx) * 0.3 + Math.sin(time * 0.5) * 1.5;
            orb.position.x = Math.cos(time + idx) * 0.3 + Math.cos(time * 0.5) * 1.5;
            orb.position.z = Math.sin(time * 0.2 + idx * 0.5) * 0.5;
            
            // Pulsating scale effect
            const scale = 0.8 + Math.sin(time * 3 + idx) * 0.2;
            orb.scale.set(scale, scale, scale);
          }
        }
      }
      
      // Move spotlight in circular motion
      if (sceneRef.current) {
        const spotLight = sceneRef.current.children.find(
          child => child instanceof THREE.SpotLight
        ) as THREE.SpotLight | undefined;
        
        if (spotLight) {
          const radius = 5;
          spotLight.position.x = Math.sin(time * 0.3) * radius;
          spotLight.position.z = Math.cos(time * 0.3) * radius;
          spotLight.position.y = 2 + Math.sin(time * 0.5) * 2;
          spotLight.lookAt(0, 0, 0);
        }
        
        // Animate point lights for shine effect
        const pointLights = sceneRef.current.children.filter(
          child => child instanceof THREE.PointLight
        ) as THREE.PointLight[];
        
        pointLights.forEach((light, idx) => {
          // Slightly change intensity to create shimmer
          light.intensity = 0.8 + Math.sin(time * (idx + 1) * 0.5) * 0.4;
          
          // Move lights subtly
          const lightRadius = 3 + idx;
          light.position.x = Math.sin(time * 0.2 + idx) * lightRadius;
          light.position.z = Math.cos(time * 0.2 + idx) * lightRadius;
        });
      }
      
      // Animate stars
      if (starsGroupRef.current && starsGroupRef.current.children.length > 0) {
        const stars = starsGroupRef.current.children[0] as THREE.Points;
        if (stars) {
          // Slowly rotate the entire starfield
          stars.rotation.y += 0.0005;
          stars.rotation.x += 0.0002;
          
          // Update star positions to create flowing effect
          const positions = stars.geometry.attributes.position.array as Float32Array;
          const count = positions.length / 3;
          
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // z-directional movement to create a flowing/space-travel effect
            positions[i3 + 2] += 0.02; // move stars toward viewer
            
            // If a star passes the camera, reset it far away
            if (positions[i3 + 2] > 15) {
              positions[i3] = (Math.random() - 0.5) * 50; // new x
              positions[i3 + 1] = (Math.random() - 0.5) * 50; // new y
              positions[i3 + 2] = -20; // put it far behind
            }
          }
          
          // Tell Three.js to update the geometry
          stars.geometry.attributes.position.needsUpdate = true;
        }
      }
      
      // Animate metroid-like objects
      if (metroidObjectsRef.current) {
        const metroids = metroidObjectsRef.current.children;
        
        metroids.forEach(metroid => {
          // Access saved movement parameters
          const { speedX, speedY, speedZ, rotationSpeed, pulseSpeed, sinOffset } = metroid.userData;
          
          // Update position
          metroid.position.x += speedX;
          metroid.position.y += speedY;
          metroid.position.z += speedZ;
          
          // Rotation animation
          metroid.rotation.x += rotationSpeed;
          metroid.rotation.y += rotationSpeed * 0.7;
          
          // Pulsating effect
          const pulseFactor = 0.85 + Math.sin(time * pulseSpeed + sinOffset) * 0.15;
          metroid.scale.setScalar(metroid.scale.x * pulseFactor);
          
          // Boundary check - if object goes too far away, bring it back
          const resetLimit = 25;
          if (
            Math.abs(metroid.position.x) > resetLimit ||
            Math.abs(metroid.position.y) > resetLimit ||
            metroid.position.z > 15 || metroid.position.z < -25
          ) {
            // Reset position to a random location far from camera
            metroid.position.set(
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              -20 - Math.random() * 5
            );
            
            // Reset scale
            const baseScale = 0.5 + Math.random() * 1.2;
            metroid.scale.set(baseScale, baseScale, baseScale);
            
            // Optional: randomize movement parameters again
            metroid.userData.speedX = (Math.random() - 0.5) * 0.05;
            metroid.userData.speedY = (Math.random() - 0.5) * 0.05;
            metroid.userData.speedZ = Math.random() * 0.03 + 0.01; // positive to move toward camera
          }
          
          // Make the core elements glow/pulse
          if (metroid.children.length > 0) {
            const core = metroid.children[metroid.children.length - 1];
            if (core && core.material) {
              // Typescript would need casting here, but for simplicity, accessing directly
              const coreMaterial = core.material as THREE.MeshStandardMaterial;
              coreMaterial.emissiveIntensity = 0.8 + Math.sin(time * 3 + sinOffset) * 0.5;
            }
          }
        });
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Make camera move slightly
        cameraRef.current.position.x = Math.sin(time * 0.3) * 0.7;
        cameraRef.current.position.y = Math.cos(time * 0.4) * 0.7;
        cameraRef.current.position.z = 5 + Math.sin(time * 0.2) * 0.5;
        cameraRef.current.lookAt(0, 0, 0);
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (objectsGroupRef.current) {
        objectsGroupRef.current.clear();
      }
      
      if (starsGroupRef.current) {
        starsGroupRef.current.clear();
      }
      
      if (metroidObjectsRef.current) {
        metroidObjectsRef.current.clear();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [containerRef]);

  return null;
}