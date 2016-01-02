(function (jQuery, THREE) {
	'use strict';

	if (Math.TAU === undefined) {
		Math.TAU = Math.PI * 2;
	}

	function get (url) {
		let content = '';
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

	function generateNormalMap () {
		let renderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			magFilter: THREE.LinearFilter,
			minFilter: THREE.LinearMipMapLinearFilter,
			anisotropy: renderer.getMaxAnisotropy(),
			depthBuffer: false,
			stencilBuffeR: false
		});

		let camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2);
		camera.position.z = 1;
		let scene = new THREE.Scene();
		let geometry = new THREE.PlaneBufferGeometry(1, 1);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0));
		let material = new THREE.RawShaderMaterial({
			vertexShader: get('shaders/normal.vert'),
			fragmentShader: get('shaders/normal.frag')
		});
		let mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
		renderer.render(scene, camera, renderTarget);
		return renderTarget;
	}

	let stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';
	document.body.appendChild(stats.domElement);

	let rendererStats   = new THREEx.RendererStats();
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.left = '0px';
	rendererStats.domElement.style.bottom   = '0px';
	document.body.appendChild(rendererStats.domElement);

	let gui = new dat.GUI();

	let renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});
	renderer.sortObjects = false;
	//renderer.getContext().getExtension('OES_standard_derivatives');
	//renderer.getContext().getExtension('OES_texture_float');
	//renderer.getContext().getExtension('OES_texture_float_linear');
	//renderer.setClearColor('#7F99B3');
	//renderer.setClearColor('#050505');
	renderer.setClearColor('#000');

	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
	//let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
	camera.position.z = 8;

	let settings = {
		'pointSize': 10,
		'lighting': true,
		//'lighting': false,
		'ambient': true,
		'diffuse': true,
		'specular': true,
		'debugLighting': false,
		'debugNormals': false,
		'firstColor': '#7a7a7a',
		//'firstColor': '#ff0000',
		'secondColor': '#0a002a',
		//'secondColor': '#00ff00',
		'thirdColor': '#002a00',
		//'thirdColor': '#0000ff',
		'shininess': 30,
		'epsilon': 1E-2,
		'tubeRadius': 0.15,
		'torusKnotRadius': 1,
		'numBumps': 3,
		'bumpSize': 0.1,
		'bumpShift': 1 / 2,
		'numTwists': 56,
		'numCoils': 3,
		'numLoops': 7,
		'spinningSpeed': 0.1,
		'wireframe': false
	};
	let material = new THREE.RawShaderMaterial({
		uniforms: {
			time: {type: 'f'},
			epsilon: {type: 'f', value: settings.epsilon},
			pointSize: {type: 'f', value: settings.pointSize},
			uLighting: {type: 'f', value: settings.lighting},
			debugLighting: {type: 'f', value: settings.debugLighting},
			uAmbient: {type: 'f', value: settings.ambient},
			uDiffuse: {type: 'f', value: settings.diffuse},
			uSpecular: {type: 'f', value: settings.specular},
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
			spinningSpeed: {type: 'f', value: settings.spinningSpeed},
			debugNormals: {type: 'i', value: settings.debugNormals},
			mouseX: {type: 'f', value: 1E5},
			normalMap: {type: 't', value: generateNormalMap()}
		},
		vertexShader: get('shaders/shader.vert'),
		fragmentShader: get('shaders/shader.frag'),
		side: THREE.FrontSide
	});
	gui.add(settings, 'lighting').onChange(function (value) {
		material.uniforms.uLighting.value = value;
	});
	gui.add(settings, 'spinningSpeed', 0, 1).onChange(function (value) {
		material.uniforms.spinningSpeed.value = value;
	});
	//gui.add(settings, 'pointSize', 1, 100).onChange(function (value) {
	//	material.uniforms.pointSize.value = value;
	//});
	gui.add(settings, 'bumpSize', 0.001, 0.2).onChange(function (value) {
		material.uniforms.bumpSize.value = value;
	});
	gui.add(settings, 'bumpShift', 0, 1).onChange(function (value) {
		material.uniforms.bumpShift.value = value;
	});
	gui.add(settings, 'numBumps', 0, 10).step(1).onChange(function (value) {
		material.uniforms.numBumps.value = value;
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
	gui.add(settings, 'numLoops', 1, 20).step(1).onChange(function (value) {
		material.uniforms.numLoops.value = value;
	});
	gui.add(settings, 'numCoils', 1, 10).step(1).onChange(function (value) {
		material.uniforms.numCoils.value = value;
	});
	gui.add(settings, 'shininess', 1, 100).onChange(function (value) {
		material.uniforms.shininess.value = value;
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

	let debug = gui.addFolder('Debug');
	debug.open();
	debug.add(settings, 'wireframe').onChange(function (value) {
		material.wireframe = value;
	});
	debug.add(settings, 'ambient').onChange(function (value) {
		material.uniforms.uAmbient.value = value;
	});
	debug.add(settings, 'diffuse').onChange(function (value) {
		material.uniforms.uDiffuse.value = value;
	});
	debug.add(settings, 'specular').onChange(function (value) {
		material.uniforms.uSpecular.value = value;
	});
	debug.add(settings, 'debugLighting').onChange(function (value) {
		material.uniforms.debugLighting.value = value;
	});
	debug.add(settings, 'debugNormals').onChange(function (value) {
		material.uniforms.debugNormals.value = value;
	});
	debug.add(settings, 'epsilon', 1E-5, 1E-1).onChange(function (value) {
		material.uniforms.epsilon.value = value;
	});

	let box = new THREE.PlaneBufferGeometry(2, 2);
	let tCube = new THREE.CubeTextureLoader().load([
		'images/skybox/sky_right1.png',
		'images/skybox/sky_left2.png',
		'images/skybox/sky_top3.png',
		'images/skybox/sky_bottom4.png',
		'images/skybox/sky_front5.png',
		'images/skybox/sky_back6.png'
	]);

	let skybox = new THREE.Mesh(box, new THREE.RawShaderMaterial({
		uniforms: {
			inverseProjectionMatrix: {type: 'm4', value: new THREE.Matrix4()},
			tCube: {type: 't', value: tCube}
		},
		vertexShader: get('shaders/skybox.vert'),
		fragmentShader: get('shaders/skybox.frag'),
		side: THREE.FrontSide,
		depthWrite: false
	}));
	scene.add(skybox);

	let geometry = new THREE.PlaneBufferGeometry(Math.TAU, Math.TAU, 80, 5000);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(Math.PI, Math.PI, 0));
	let mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	let clock = new THREE.Clock();

	let controls = new THREE.OrbitControls(camera, canvas);

	requestAnimationFrame(render);

	jQuery(canvas).mousemove(function (e) {
		let parentOffset = $(this).parent().offset();
		material.uniforms.mouseX.value = e.pageX - parentOffset.left;
	});

	function render() {
		requestAnimationFrame(render);

		stats.begin();

		if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		}

		material.uniforms.time.value = clock.getElapsedTime();
		skybox.material.uniforms.inverseProjectionMatrix.value.getInverse(camera.projectionMatrix);

		controls.update();
		renderer.render(scene, camera);
		stats.end();
		rendererStats.update(renderer);
	}

	window.renderer = renderer;
}(jQuery, THREE));
