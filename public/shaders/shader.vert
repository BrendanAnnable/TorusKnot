#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;

varying vec3 vPosition;
varying vec3 vNormal;

const float EPS = 0.00001;

vec3 torus_knot(float p, float q, float k) {
	float qk = q * k;
	float pk = p * k;
	float r = cos(qk) + 2.0;
	float x = r * cos(pk);
	float y = r * sin(pk);
	float z = -sin(qk);
//	z = 0.0;
	return vec3(x, y, z);
}

mat3 frenet_frame(vec3 a, vec3 b) {
	vec3 tangent = a - b;
	vec3 binormal = normalize(cross(tangent, a + b));
	vec3 normal = normalize(cross(binormal, tangent));
	return mat3(tangent, binormal, normal);
}

mat3 make_rotation_y(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(c, 0, -s, 0, 1, 0, s, 0, c);
}

mat3 make_rotation_x(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(1, 0, 0, 0, c, -s, 0, s, c);
}

vec2 from_polar(float r, float angle) {
	return vec2(r * cos(angle), r * sin(angle));
}

vec3 twisted_torus(float theta, float k) {
	float num_bumps = 2.0;
	float bump_size = 0.05;
	float torus_radius = 0.2;
	float num_twists = 64.0;
	float wave_offset = bump_size * sin(num_bumps * (theta - num_twists * k));
	float r = torus_radius + wave_offset;
//	float r = torus_radius;
	return vec3(0, from_polar(r, theta));
}

vec3 twisted_torus_knot(float p, float q, float theta, float k, float time, float speed) {
	float k_offset = mod(k + (speed * time / 256.0), M_TAU);
//	float k_offset = k;
	vec3 pos = torus_knot(p, q, k_offset);
	vec3 pos2 = torus_knot(p, q, k_offset - 0.001);
	vec3 pos3 = torus_knot(p, q, k_offset + 0.001);
	mat3 frame = frenet_frame(pos2, pos3);
	mat3 rotation = make_rotation_x(-time * M_TAU / 3.0);
//	mat3 rotation = make_rotation_x(0.0);
	vec3 point = pos + frame * rotation * twisted_torus(theta, k_offset);
//	return make_rotation_y(time * M_TAU / 20.0) * point;
	return point;
}

void main() {
	float theta = position.x;
	float k = position.y;
	float speed = position.z * 5.0;

	float p = 2.0;
	float q = 5.0;
	vec3 point = twisted_torus_knot(p, q, theta, k, time, speed);

	vec3 theta_dx = twisted_torus_knot(p, q, theta - EPS, k, time, speed) - twisted_torus_knot(p, q, theta + EPS, k, time, speed);
	vec3 k_dx = twisted_torus_knot(p, q, theta, k - EPS, time, speed) - twisted_torus_knot(p, q, theta, k + EPS, time, speed);

	vec3 normal = normalize(cross(theta_dx, k_dx));

	vNormal = normalMatrix * normal;

	vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);

	float size = 1.0;
	float scale = 5.0;
	gl_PointSize = size * (scale / length(mvPosition.xyz));

//	vPosition = mvPosition.xyz;
	vPosition = mat3(modelViewMatrix) * point;
//	vPosition = point;

	gl_Position = projectionMatrix * mvPosition;
}
