import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 20, 100);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		// Contrôles d'Orbit
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minDistance = 10;
		controls.maxDistance = 500;

		// Lumière
		const sunLight = new THREE.PointLight(0xffffff, 1.5, 0, 0);
		sunLight.position.set(0, 0, 0); // Positionné au soleil
		scene.add(sunLight);

		const ambientLight = new THREE.AmbientLight(0x202020); // Lumière ambiante faible pour les ombres douces
		scene.add(ambientLight);

		const textureLoader = new THREE.TextureLoader();

		// Soleil
		const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
		const sunMaterial = new THREE.MeshBasicMaterial({
			map: textureLoader.load('textures/Sun.jpg'),
			emissive: 0xffff00,
			emissiveIntensity: 0.5
		});
		const sun = new THREE.Mesh(sunGeometry, sunMaterial);
		scene.add(sun);

		// Planètes
		const planets = [
			{ name: 'Mercure', texture: 'textures/Mercury.jpg', size: 0.383, distance: 7, speed: 0.004 },
			{ name: 'Vénus', texture: 'textures/Venus.jpg', size: 0.949, distance: 10, speed: 0.003 },
			{ name: 'Terre', texture: 'textures/Earth.jpg', size: 1, distance: 15, speed: 0.002 },
			{ name: 'Mars', texture: 'textures/Mars.jpg', size: 0.532, distance: 20, speed: 0.0015 },
			{ name: 'Jupiter', texture: 'textures/Jupiter.jpg', size: 11.21, distance: 40, speed: 0.0015 },
			{ name: 'Saturne', texture: 'textures/Saturn.jpg', size: 9.45, distance: 70, speed: 0.0009 },
			{ name: 'Uranus', texture: 'textures/Uranus.jpg', size: 4, distance: 85, speed: 0.0004 },
			{ name: 'Neptune', texture: 'textures/Neptune.jpg', size: 3.88, distance: 95, speed: 0.0003 }
		];

		planets.forEach(planet => {
			const texture = textureLoader.load(planet.texture);
			const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
			const material = new THREE.MeshStandardMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = planet.distance; // Position initiale
			scene.add(mesh);
			planet.mesh = mesh; // Stocker la mesh dans l'objet planète pour l'animation

			if (planet.name === 'Saturne') {
				const ringGeometry = new THREE.RingGeometry(planet.size * 1.2, planet.size * 2, 64);
				const ringMaterial = new THREE.MeshBasicMaterial({
					color: 0x9c9c9c,
					side: THREE.DoubleSide,
					map: textureLoader.load('textures/SaturnRing.png') // texture pour les anneaux
				});
				const rings = new THREE.Mesh(ringGeometry, ringMaterial);

				rings.rotation.x = Math.PI / 2; // Rotation pour que les anneaux soient horizontaux

				//  anneaux enfant de l'objet Saturne
				mesh.add(rings);

				planet.rings = rings; // referencement des anneaux de saturne
			}
		});

		// Étoiles
		const starsGeometry = new THREE.BufferGeometry();
		const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });
		const starPositions = [];
		for (let i = 0; i < 10000; i++) {
			starPositions.push(THREE.MathUtils.randFloatSpread(2000), THREE.MathUtils.randFloatSpread(2000), THREE.MathUtils.randFloatSpread(2000));
		}
		starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
		const stars = new THREE.Points(starsGeometry, starsMaterial);
		scene.add(stars);

		// Animation
		const animate = () => {
			requestAnimationFrame(animate);

			sun.rotateY(0.004); // Rotation du soleil

			planets.forEach(planet => {
				const { mesh, speed, distance } = planet;
				planet.angle = (planet.angle || 0) + speed;
				mesh.position.x = Math.cos(planet.angle) * distance;
				mesh.position.z = Math.sin(planet.angle) * distance;
				mesh.rotateY(0.003); // Rotation de la planète sur elle-même
			});

			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		// Nettoyage
		return () => {
			document.body.removeChild(renderer.domElement);
			// Ici, on pourrait également nettoyer les ressources Three.js (géométrie, matériaux, textures)
		};
	}, []);

	return <div />;
};

export default SolarSystem;
