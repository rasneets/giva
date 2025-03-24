import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeJSJewelryProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ThreeJSJewelry({ containerRef }: ThreeJSJewelryProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gemsGroupRef = useRef<THREE.Group | null>(null);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Jewelry Group
    const gemsGroup = new THREE.Group();
    gemsGroupRef.current = gemsGroup;
    scene.add(gemsGroup);
    
    // Gold ring
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 50);
    const goldMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37, 
      metalness: 1, 
      roughness: 0.3 
    });
    const ring = new THREE.Mesh(torusGeometry, goldMaterial);
    ring.rotation.x = Math.PI / 2;
    gemsGroup.add(ring);
    
    // Add gems
    const gemColors = [0x3CB4C5, 0xB76E79, 0xF44336];
    const gemGeometry = new THREE.OctahedronGeometry(0.3, 2);
    
    for (let i = 0; i < 6; i++) {
      const gemMaterial = new THREE.MeshStandardMaterial({ 
        color: gemColors[i % gemColors.length], 
        metalness: 0.3, 
        roughness: 0.2
      });
      
      const gem = new THREE.Mesh(gemGeometry, gemMaterial);
      
      // Position gems around the ring
      const angle = (i / 6) * Math.PI * 2;
      gem.position.x = Math.cos(angle) * 1.5;
      gem.position.y = Math.sin(angle) * 1.5;
      gem.position.z = 0.2;
      
      gem.rotation.x = Math.random() * Math.PI;
      gem.rotation.y = Math.random() * Math.PI;
      
      gemsGroup.add(gem);
    }
    
    // Animation function
    const animate = () => {
      if (gemsGroupRef.current) {
        gemsGroupRef.current.rotation.y += 0.005;
        gemsGroupRef.current.rotation.z += 0.002;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
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
      
      if (gemsGroupRef.current) {
        gemsGroupRef.current.clear();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [containerRef]);

  return null;
}
