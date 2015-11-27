(function () {
	'use strict';

	let canvas = document.getElementById('canvas');

	var random = new Random();

	let renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});

	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
	//let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

	let material = new THREE.RawShaderMaterial({
		vertexShader: [
			'precision highp float;',
			'uniform mat4 projectionMatrix;',
			'uniform mat4 modelViewMatrix;',
			'attribute vec3 position;',
			'void main() {',
			'gl_PointSize = 1.0;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
			'}'
		].join('\n'),
		fragmentShader: [
			'precision highp float;',
			'void main() {',
			'gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);',
			'}'
		].join('\n')
	});

	let n = 200000;

	let geometry = new THREE.Geometry();
	for (let i = 0; i < n; i++) {
		let vector = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
		geometry.vertices.push(vector);
	}

	let angularVelocities = [];
	for (let i = 0; i < n; i++) {
		let vector = new THREE.Vector3(0, 0, random.normal(0.1, 0.1));
		angularVelocities.push(vector);
	}

	let particles = new THREE.Points(geometry, material);
	scene.add(particles);

	let clock = new THREE.Clock();

	camera.position.z = 3;

	requestAnimationFrame(render);

	function clamp(value) {
		return Math.min(1, Math.max(-1, value));
	}

	function render() {
		requestAnimationFrame(render);
		let t = clock.getDelta();

		let vertices = geometry.vertices;
		for (let i = 0; i < n; i++) {
			var a = Math.PI * 2 * t * angularVelocities[i].z;
			let ca = Math.cos(a);
			let sa = Math.sin(a);
			vertices[i].set(
				ca * vertices[i].x - sa * vertices[i].y,
				sa * vertices[i].x + ca * vertices[i].y,
				vertices[i].z
			);
		}
		geometry.verticesNeedUpdate = true;

		if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		}

		renderer.render(scene, camera);
	}
}());
