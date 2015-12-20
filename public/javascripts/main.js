(function (jQuery, THREE) {
	'use strict';

	if (Math.TAU === undefined) {
		Math.TAU = Math.PI * 2;
	}

	function get (url) {
		var content = '';
		jQuery.ajax({
			url: url,
			success: function (response) {
				content = response;
			},
			async: false
		});
		return content;
	}

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
		uniforms: {
			time: {type: 'f'}
		},
		vertexShader: get('shaders/shader.vert'),
		fragmentShader: get('shaders/shader.frag')
	});
	material.transparent = true;
	//material.depthTest = false;
	//material.depthWrite = false;
	material.blending = THREE.CustomBlending;
	material.blendSrc = THREE.SrcAlphaFactor;
	material.blendDst = THREE.OneFactor;
	material.blendEquation = THREE.AddEquation;

	let n = 2000000;
	//let n = 150000;
	//let n = 30000;

	let geometry = new THREE.Geometry();

	for (let i = 0; i < n; i++) {
		let theta = random.uniform(0, 2 * Math.PI);
		let phi = random.uniform(0, Math.TAU);
		//let mean = 0.05;//0.05 * Math.sin(7 * (phi - 4 * theta)) + 0.3;
		//let mean = 0.05 * Math.sin(8 * (phi - 32 * theta)) + 0.05;
		let mean = 0.02 * Math.sin(16 * (phi - 8 * theta)) + 0.10;
		let distance = random.normal(mean, 0.001);
		let vector2 = new THREE.Vector3(theta, distance * Math.cos(phi), distance * Math.sin(phi));

		geometry.vertices.push(vector2);
	}

	let particles = new THREE.Points(geometry, material);
	scene.add(particles);

	let n2 = 60000;
	//let n2 = 20000;

	let geometry2 = new THREE.Geometry();

	for (let i = 0; i < n2; i++) {
		let theta = random.uniform(0, 2 * Math.PI);
		let phi = random.uniform(0, Math.TAU);
		//let mean = 0.05;//0.05 * Math.sin(7 * (phi - 4 * theta)) + 0.3;
		let distance = random.normal(0.02, 0.01);
		let vector2 = new THREE.Vector3(theta, distance * Math.cos(phi), distance * Math.sin(phi));

		geometry2.vertices.push(vector2);
	}

	let material2 = new THREE.RawShaderMaterial({
		uniforms: {
			time: {type: 'f'}
		},
		vertexShader: get('shaders/shader2.vert'),
		fragmentShader: get('shaders/shader2.frag')
	});
	material2.transparent = true;
	//material.depthTest = false;
	//material.depthWrite = false;
	material2.blending = THREE.CustomBlending;
	material2.blendSrc = THREE.SrcAlphaFactor;
	material2.blendDst = THREE.OneFactor;
	material2.blendEquation = THREE.AddEquation;

	let particles2 = new THREE.Points(geometry2, material2);
	//scene.add(particles2);

	let clock = new THREE.Clock();

	camera.position.z = 3.2;

	let transform = new THREE.Matrix4();

	let controls = new THREE.OrbitControls(camera);

	let stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';
	document.body.appendChild(stats.domElement);

	requestAnimationFrame(render);

	function render() {
		requestAnimationFrame(render);

		stats.begin();
		let t = clock.getDelta();

		material.uniforms.time.value = clock.getElapsedTime();
		material2.uniforms.time.value = clock.getElapsedTime();

		if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		}

		//particles.rotation.z += Math.TAU * t / 20;
		//particles2.rotation.z += Math.TAU * t / 20;
		//transform.makeRotationX(Math.TAU * t / 30);
		//camera.position.applyMatrix4(transform);
		//transform.makeRotationY(Math.TAU * t / 30);
		//camera.position.applyMatrix4(transform);
		//transform.makeRotationZ(Math.TAU * t / 70);
		//camera.position.applyMatrix4(transform);
		camera.lookAt(scene.position);
		controls.update();
		renderer.render(scene, camera);
		stats.end();
	}
}(jQuery, THREE));
