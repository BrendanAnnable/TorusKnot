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

	let stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';
	document.body.appendChild(stats.domElement);

	var gui = new dat.GUI();

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

	var settings = {
		'pointSize': 10,
		'lighting': true,
		'firstColor': '#6300aa',
		'secondColor': '#000048',
		'thirdColor': '#0a550a',
		'shininess': 5,
		'epsilon': 1E-3,
		'tubeRadius': 0.18,
		'torusKnotRadius': 1,
		'numBumps': 3,
		'bumpSize': 0.04,
		'bumpShift': 5,
		'numTwists': 64,
		'numCoils': 3,
		'numLoops': 8,
		'spinningSpeed': 1 / 4
	};
	let material = new THREE.RawShaderMaterial({
		uniforms: {
			time: {type: 'f'},
			epsilon: {type: 'f', value: settings.epsilon},
			pointSize: {type: 'f', value: settings.pointSize},
			uLighting: {type: 'f', value: settings.lighting},
			firstColor: {type: '4f', value: new THREE.Color(settings.firstColor).toArray()},
			secondColor: {type: '4f', value: new THREE.Color(settings.secondColor).toArray()},
			thirdColor: {type: '4f', value: new THREE.Color(settings.thirdColor).toArray()},
			shininess: {type: 'f', value: settings.shininess},
			tubeRadius: {type: 'f', value: settings.tubeRadius},
			torusKnotRadius: {type: 'f', value: settings.torusKnotRadius},
			numBumps: {type: 'f', value: settings.numBumps},
			bumpShift: {type: 'f', value: settings.bumpShift},
			bumpSize: {type: 'f', value: settings.bumpSize},
			numTwists: {type: 'f', value: settings.numTwists},
			numCoils: {type: 'f', value: settings.numCoils},
			numLoops: {type: 'f', value: settings.numLoops},
			spinningSpeed: {type: 'f', value: settings.spinningSpeed}
		},
		vertexShader: get('shaders/shader.vert'),
		fragmentShader: get('shaders/shader.frag')
	});
	material.transparent = true;
	//material.depthTest = false;
	//material.depthWrite = false;
	//material.blending = THREE.CustomBlending;
	//material.blendSrc = THREE.SrcAlphaFactor;
	//material.blendDst = THREE.OneMinusSrcAlphaFactor;
	//material.blendEquation = THREE.AddEquation;
	gui.add(settings, 'spinningSpeed', 0, 1).onChange(function (value) {
		material.uniforms.spinningSpeed.value = value;
	});
	gui.add(settings, 'pointSize', 1, 100).onChange(function (value) {
		material.uniforms.pointSize.value = value;
	});
	gui.add(settings, 'lighting').onChange(function (value) {
		material.uniforms.uLighting.value = value;
	});
	gui.add(settings, 'numBumps', 0, 10).step(1).onChange(function (value) {
		material.uniforms.numBumps.value = value;
	});
	gui.add(settings, 'bumpSize', 0.001, 0.2).onChange(function (value) {
		material.uniforms.bumpSize.value = value;
	});
	gui.add(settings, 'bumpShift', 2, 30).onChange(function (value) {
		material.uniforms.bumpShift.value = value;
	});
	gui.add(settings, 'numTwists', 0, 256).step(1).onChange(function (value) {
		material.uniforms.numTwists.value = value;
	});
	gui.add(settings, 'tubeRadius', 0, 1).onChange(function (value) {
		material.uniforms.tubeRadius.value = value;
	});
	gui.add(settings, 'torusKnotRadius', 0, 2).onChange(function (value) {
		material.uniforms.torusKnotRadius.value = value;
	});
	gui.add(settings, 'shininess', 0, 5).onChange(function (value) {
		material.uniforms.shininess.value = value;
	});
	gui.add(settings, 'numLoops', 1, 20).step(1).onChange(function (value) {
		material.uniforms.numLoops.value = value;
	});
	gui.add(settings, 'numCoils', 1, 10).step(1).onChange(function (value) {
		material.uniforms.numCoils.value = value;
	});
	gui.add(settings, 'epsilon', 1E-3, 1).onChange(function (value) {
		material.uniforms.epsilon.value = value;
	});
	gui.addColor(settings, 'firstColor').onChange(function (value) {
		material.uniforms.firstColor.value = new THREE.Color(value).toArray();
	});
	gui.addColor(settings, 'secondColor').onChange(function (value) {
		material.uniforms.secondColor.value = new THREE.Color(value).toArray();
	});
	gui.addColor(settings, 'thirdColor').onChange(function (value) {
		material.uniforms.thirdColor.value = new THREE.Color(value).toArray();
	});

	//let n = 100000;
	let n = 1000000;

	let geometry = new THREE.Geometry();

	for (let i = 0; i < n; i++) {
		let theta = random.uniform(0, Math.TAU);
		let phi = random.uniform(0, Math.TAU);
		//let delta = random.uniform(0, Math.TAU);
		let delta = random.uniform(0, 1);
		//let delta = random.normal(1.0, 0.3);
		//let mean = 0.05;//0.05 * Math.sin(7 * (phi - 4 * theta)) + 0.3;
		//let mean = 0.01 * Math.sin(7 * (phi - 16 * theta)) + 0.20;
		//let mean = 0.01 * Math.sin(7 * (phi - 16 * theta)) + 0.20;
		//let mean = 0.2;
		//let distance = 0.2;// random.normal(mean, 0.05);
		let vector = new THREE.Vector3(theta, phi, delta);

		geometry.vertices.push(vector);
	}

	let particles = new THREE.Points(geometry, material);
	scene.add(particles);

	let n2 = 500000;

	let geometry2 = new THREE.Geometry();

	for (let i = 0; i < n2; i++) {
		let theta = random.uniform(0, 2 * Math.PI);
		let phi = random.uniform(0, Math.TAU);
		//let mean = 0.05;//0.05 * Math.sin(7 * (phi - 4 * theta)) + 0.3;
		let distance = 0.0; //random.normal(0.3, 0.00);
		let vector = new THREE.Vector3(theta, distance * Math.cos(phi), distance * Math.sin(phi));

		geometry2.vertices.push(vector);
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

	camera.position.z = 8.5;

	let transform = new THREE.Matrix4();

	let controls = new THREE.OrbitControls(camera, canvas);


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
