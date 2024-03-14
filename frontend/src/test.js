import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './SolarSystem.css'; // Assurez-vous d'avoir le CSS nécessaire pour positionner votre barre latérale

const SolarSystem = () => {
	const [speedFactor, setSpeedFactor] = useState(1);
	const speedFactorRef = useRef(speedFactor);

	useEffect(() => {
		speedFactorRef.current = speedFactor; // Mettez à jour la référence quand speedFactor change
	}, [speedFactor]);

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 20, 100);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minDistance = 10;
		controls.maxDistance = 500;

		const sunLight = new THREE.PointLight(0xffffff, 1.5, 0, 0);
		sunLight.position.set(0, 0, 0);
		scene.add(sunLight);

		const ambientLight = new THREE.AmbientLight(0x202020);
		scene.add(ambientLight);

		const textureLoader = new THREE.TextureLoader();

		const sunGeometry = new THREE.SphereGeometry(80, 32, 32);
		const sunMaterial = new THREE.MeshBasicMaterial({
			map: textureLoader.load('textures/Sun.jpg'),
			emissive: 0xffff00,
			emissiveIntensity: 0.5
		});
		const sun = new THREE.Mesh(sunGeometry, sunMaterial);
		scene.add(sun);

		// Planètes
		const planets = [
			{ name: 'Mercure', texture: 'textures/Mercury.jpg', size: 0.383, distance: 100, speed: 0.002 },
			{ name: 'Vénus', texture: 'textures/Venus.jpg', size: 0.949, distance: 120, speed: 0.0018 },
			{
				name: 'Terre',
				texture: 'textures/Earth.webp',
				size: 1,
				distance: 140,
				speed: 0.0016,
				moons: [
					{
						name: 'Lune',
						texture: 'textures/Moon.jpg',
						size: 0.27,
						distance: 2.5,
						speed: 0.004
					}
				]
			},
			{ name: 'Mars', texture: 'textures/Mars.jpg', size: 0.732, distance: 160, speed: 0.0014 },
			{ name: 'Jupiter', texture: 'textures/Jupiter.jpg', size: 11.21, distance: 200, speed: 0.0012 },
			{ name: 'Saturne', texture: 'textures/Saturn.jpg', size: 9.45, distance: 280, speed: 0.0008 },
			{ name: 'Uranus', texture: 'textures/Uranus.jpg', size: 4, distance: 330, speed: 0.0004 },
			{ name: 'Neptune', texture: 'textures/Neptune.jpg', size: 3.88, distance: 350, speed: 0.0003 }
		];

		planets.forEach(planet => {
			const texture = textureLoader.load(planet.texture);
			const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
			const material = new THREE.MeshStandardMaterial({ map: texture });
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = planet.distance; // Position initiale
			scene.add(mesh);
			planet.mesh = mesh; // Stocker la mesh dans l'objet planète pour l'animation

			if (planet.moons) {
				planet.moons.forEach(moon => {
					const moonTexture = textureLoader.load(moon.texture);
					const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 32);
					const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
					const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
					mesh.add(moonMesh); // Ajouter la Lune comme enfant de la Terre
					moon.mesh = moonMesh;
					moonMesh.position.x = moon.distance;
				});
			}

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

		const animate = () => {
			requestAnimationFrame(animate);

			sun.rotateY(0.004); // Rotation du soleil

			planets.forEach(planet => {
				const { mesh, distance } = planet;
				planet.angle = (planet.angle || 0) + planet.speed * speedFactor;
				mesh.position.x = Math.cos(planet.angle) * distance;
				mesh.position.z = Math.sin(planet.angle) * distance;
				mesh.rotateY(0.003 * speedFactor); // Rotation de la planète sur elle-même
			});

			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		return () => {
			document.body.removeChild(renderer.domElement);
			// Nettoyage des ressources Three.js si nécessaire
		};
	}, []);

	const handleSpeedChange = event => {
		setSpeedFactor(Number(event.target.value));
	};

	return (
		<>
			<div className='control-panel'>
				<input type='range' min='0.1' max='5' value={speedFactor} step='0.1' onChange={handleSpeedChange} className='speed-control' />
			</div>
			<div id='solar-system-canvas'></div>
		</>
	);
};

export default SolarSystem;
