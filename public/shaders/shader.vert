#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;
uniform float pointSize;
uniform float epsilon;
uniform float torusKnotRadius;
uniform float tubeRadius;
uniform float numBumps;
uniform float bumpSize;
uniform float bumpShift;
uniform float numTwists;
uniform float numCoils;
uniform float numLoops;
uniform float spinningSpeed;

attribute vec3 position;

varying vec3 vParams;
varying vec3 vPosition;
varying vec3 vNormal;

//const float EPS = 0.0001;

mat3 frenet_frame(vec3 a, vec3 b) {
	vec3 tangent = a - b;
	vec3 binormal = normalize(cross(tangent, a + b));
	vec3 normal = normalize(cross(binormal, tangent));
	return mat3(tangent, binormal, normal);
}

mat3 make_rotation_x(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(1, 0, 0, 0, c, -s, 0, s, c);
}

mat3 make_rotation_y(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(c, 0, -s, 0, 1, 0, s, 0, c);
}

mat3 make_rotation_z(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(c, s, 0, -s, c, 0, 0, 0, 1);
}

vec2 from_polar(float r, float angle) {
	return vec2(r * cos(angle), r * sin(angle));
}

float wave(float x, float min, float max) {
    return (sin(x) + 1.0) / 2.0 * (max - min) + min;
}

vec3 torus_knot(float p, float q, float k, float time) {
	float o = spinningSpeed * time * M_TAU;
//	o = 0.0;
	float qk = q * k - o;
	float pk = p * k - o;
	float r = torusKnotRadius * cos(qk) + 2.0;
	float x = r * cos(pk);
	float y = r * sin(pk);
	float z = torusKnotRadius * -sin(qk);
//	z = 0.0;
	return vec3(x, y, z);
}

vec3 twisted_torus(float theta, float k) {
//	float wave_offset = bumpSize * sin(numBumps * (theta - numTwists * k));
//	float r = tubeRadius + wave_offset;

	float distance = max(epsilon, tubeRadius + bumpSize * cos(numBumps * theta));// * wave(16.0 * theta, 1.0, 1.2));
	float angle = bumpShift * sin(2.0 * numBumps * theta) + (theta - numTwists * k);
	return vec3(0, from_polar(distance, angle));
}

vec3 twisted_torus_knot(float p, float q, float theta, float k, float time, float speed) {
//	float k_offset = mod(k + (speed * time / 256.0), M_TAU);
	float k_offset = k;
	vec3 pos = torus_knot(p, q, k_offset, time);
	vec3 pos2 = torus_knot(p, q, k_offset - epsilon, time);
	vec3 pos3 = torus_knot(p, q, k_offset + epsilon, time);
	mat3 frame = frenet_frame(pos2, pos3);
//	mat3 rotation = make_rotation_x(spinningSpeed * -time * M_TAU);
	mat3 rotation = make_rotation_x(0.0);
	vec3 point = pos + frame * rotation * twisted_torus(theta, k_offset);
//	return make_rotation_y(time * M_TAU / 20.0) * point;
	return make_rotation_z(spinningSpeed * time * M_TAU) * point;
//	return point;
}

void main() {

	vParams = position;
	float theta = position.x;
	float k = position.y;
	float speed = position.z * 5.0;

	float p = numCoils;
	float q = numLoops;
	vec3 point = twisted_torus_knot(p, q, theta, k, time, speed);

	vec3 theta_dx = twisted_torus_knot(p, q, theta - epsilon, k, time, speed) - twisted_torus_knot(p, q, theta + epsilon, k, time, speed);
	vec3 k_dx = twisted_torus_knot(p, q, theta, k - epsilon, time, speed) - twisted_torus_knot(p, q, theta, k + epsilon, time, speed);

	vec3 normal = normalize(cross(theta_dx, k_dx));

	vNormal = normalMatrix * normal;

	vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
//	vec4 mvPosition = modelViewMatrix * vec4(k, from_polar(0.1, theta), 1.0);
//	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

//	gl_PointSize = pointSize / length(mvPosition.xyz);

//	vPosition = mvPosition.xyz;
	vPosition = mat3(modelViewMatrix) * point;
//	vPosition = point;

	gl_Position = projectionMatrix * mvPosition;
}
