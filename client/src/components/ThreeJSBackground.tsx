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
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [containerRef]);

  return null;
}