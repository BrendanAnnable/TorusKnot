(function () {
	'use strict';

	let canvas = document.getElementById('canvas');

	var random = new Random();

	let renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});

	let scene = new THREE.Scene();
	//let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
	let camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);

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
		let vector = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
		geometry.vertices.push(vector);
	}

	let angularVelocities = [];
	for (let i = 0; i < n; i++) {
		let vector = new THREE.Vector3(0, 0, Math.max(0.1, random.normal(0.5, 0.341)));
		angularVelocities.push(vector);
	}

	let particles = new THREE.Points(geometry, material);
	scene.add(particles);

	let clock = new THREE.Clock();

	camera.position.z = 1;

	requestAnimationFrame(render);

	function clamp(value) {
		return Math.min(0.5, Math.max(-0.5, value));
	}

	function render() {
		requestAnimationFrame(render);
		let t = clock.getDelta();

		let vertices = geometry.vertices;
		for (let i = 0, len = vertices.length; i < len; i++) {
			let a = 2 * Math.PI * Math.random();
			let ca = Math.cos(a);
			let sa = Math.sin(a);

			ca = vertices[i].y;
			sa = -vertices[i].x;
			//
			//vertices[i].x = (((vertices[i].x + (t * ca / period)) + 0.5) % 1) - 0.5;
			//vertices[i].y = (((vertices[i].y + (t * sa / period)) + 0.5) % 1) - 0.5;

			vertices[i].x = clamp(vertices[i].x + t * ca * angularVelocities[i].z);
			vertices[i].y = clamp(vertices[i].y + t * sa * angularVelocities[i].z);
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
