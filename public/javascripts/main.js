var canvas = document.getElementById('canvas');

var renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
});

var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
var camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);

//var geometry = new THREE.BoxGeometry(1, 1, 1);
//var material = new THREE.MeshBasicMaterial({
//	color: '#f00'
//});
//var box = new THREE.Mesh(geometry, material);
//scene.add(box);

//var geometry = new THREE.PlaneBufferGeometry(1, 1);
//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0.5));
var geometry = new THREE.TextGeometry('1260', {
	size: 0.05,
	height: 0.000
});
geometry.center();
var material = new THREE.RawShaderMaterial({
	vertexShader: [
		'precision highp float;',
		'uniform mat4 projectionMatrix;',
		'uniform mat4 modelViewMatrix;',
		'attribute vec3 position;',
		'attribute vec2 uv;',
		'varying vec2 vUv;',
		'void main() {',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
			'vUv = uv;',
		'}'
	].join('\n'),
	fragmentShader: [
		'precision highp float;',
		'varying vec2 vUv;',
		'void main() {',
			//'gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);',
			'gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);',
		'}'
	].join('\n')
});
var plane = new THREE.Mesh(geometry, material);
//plane.position.set(0.5, 0.5, 0);
scene.add(plane);

var pointCloudGeometry = new THREE.Geometry();
var n = 200000;
for (var i = 0; i < n; i++) {
	var vector = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
	pointCloudGeometry.vertices.push(vector);
}
var pointCloudMaterial = new THREE.PointsMaterial({
	color: '#334D66', //'#700',
	size: 1,
	sizeAttenuation: false
});
var pointCloud = new THREE.Points(pointCloudGeometry, pointCloudMaterial);
scene.add(pointCloud);

var clock = new THREE.Clock();

camera.position.z = 1;

requestAnimationFrame(render);

function clamp (value) {
	return Math.min(0.5, Math.max(-0.5, value));
}

function render() {
	requestAnimationFrame(render);
	var t = clock.getDelta();

	var vertices = pointCloudGeometry.vertices;
	var period = 2;
	for (var i = 0, len = vertices.length; i < len; i++) {
		var a = 2 * Math.PI * Math.random();
		var ca = Math.cos(a);
		var sa = Math.sin(a);

		ca = vertices[i].y;
		sa = -vertices[i].x;
		//
		//vertices[i].x = (((vertices[i].x + (t * ca / period)) + 0.5) % 1) - 0.5;
		//vertices[i].y = (((vertices[i].y + (t * sa / period)) + 0.5) % 1) - 0.5;

		vertices[i].x = clamp(vertices[i].x + t * ca / period);
		vertices[i].y = clamp(vertices[i].y + t * sa / period);
	}
	pointCloudGeometry.verticesNeedUpdate = true;

	//plane.rotation.x += Math.PI * 2 * t / 3;
	plane.rotation.y += Math.PI * 2 * t / 13;
	//plane.rotation.z += Math.PI * 2 * t / 7;

	//box.rotation.x += Math.PI * 2 * t / 3;
	//box.rotation.y += Math.PI * 2 * t / 5;
	//box.rotation.z += Math.PI * 2 * t / 7;

	if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	}

	renderer.render(scene, camera);
}
