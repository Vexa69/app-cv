import { useEffect } from 'react';
import * as THREE from 'three';

const Galaxy = ({ onTransition }) => {
	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 0, 1);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		const textureLoader = new THREE.TextureLoader();
		const galaxyTexture = textureLoader.load('/textures/milkyway.png');
		const geometry = new THREE.SphereGeometry(500, 64, 64);
		const material = new THREE.MeshBasicMaterial({ map: galaxyTexture, side: THREE.BackSide });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		const animate = () => {
			requestAnimationFrame(animate);
			sphere.rotation.y += 0.0001;
			renderer.render(scene, camera);
		};

		renderer.domElement.addEventListener('click', () => {
			onTransition(); // Notifie l'événement sur le click sur le canvas
		});

		animate();

		return () => {
			document.body.removeChild(renderer.domElement);
		};
	}, [onTransition]);

	return null; // ce composant ne fait aucun rendu tout seul
};

export default Galaxy;
