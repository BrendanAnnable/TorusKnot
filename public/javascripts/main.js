(function (THREE) {
	'use strict';

	let canvas = document.getElementById('canvas');

	let random = new Random();

	let renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true,
		alpha: true
	});
	renderer.setClearColor('#000');

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
				'float distance = 0.8;',
				'float c = cos(position.x);',
				'float s = sin(position.x);',
				'mat4 transform = mat4(c, s, 0, 0,' +
									  '-s, c, 0, 0,' +
									  '0, 0, 1, 0,' +
									  '0, 0, 0, 1);',
				'vec4 polar = transform * vec4(0, position.y + distance, position.z, 1.0);',
				'gl_Position = projectionMatrix * modelViewMatrix * polar;',
				//'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
			'}'
		].join('\n'),
		fragmentShader: [
			'precision highp float;',
			'void main() {',
			'gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);',
			'}'
		].join('\n')
	});
	material.transparent = true;
	material.depthTest = false;
	material.depthWrite = false;
	material.blending = THREE.CustomBlending;
	material.blendSrc = THREE.SrcAlphaFactor;
	material.blendDst = THREE.OneFactor;
	material.blendEquation = THREE.AddEquation;

	let n = 200000;

	let geometry = new THREE.Geometry();

	for (let i = 0; i < n; i++) {
		let theta = random.uniform(0, 2 * Math.PI);
		let phi = random.uniform(0, 2 * Math.PI);
		let mean = 0.05 * Math.sin(7 * (phi - 4 * theta)) + 0.3;
		let distance = random.normal(mean, 0.005);
		let vector2 = new THREE.Vector3(theta, distance * Math.cos(phi), distance * Math.sin(phi));

		geometry.vertices.push(vector2);
	}

	let particles = new THREE.Points(geometry, material);
	scene.add(particles);

	let clock = new THREE.Clock();

	camera.position.z = 3.2;

	let transform = new THREE.Matrix4();

	requestAnimationFrame(render);

	function render() {
		requestAnimationFrame(render);
		let t = clock.getDelta();

		let vertices = geometry.vertices;
		for (let i = 0; i < n; i++) {
			let point = vertices[i];
			point.applyMatrix4(transform.makeRotationX(2 * Math.PI * t / 5));
		}
		geometry.verticesNeedUpdate = true;

		if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		}

		transform.makeRotationY(2 * Math.PI * t / 30);
		camera.position.applyMatrix4(transform);
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
	}
}(THREE));
