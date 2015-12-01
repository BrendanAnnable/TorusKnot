#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying float t;

vec3 torus_knot(float p, float q, float t) {
	float r = cos(q * t) + 2.0;
	float x = r * cos(p * t);
	float y = r * sin(p * t);
	float z = -sin(q * t);
	return vec3(x, y, z);
}

void main() {
	gl_PointSize = 1.0;
	float distance = 0.8;
	t = mod((position.x + (time * M_TAU / 30.0)), M_TAU);
	float p = 3.0;
	float q = 8.0;
	vec3 pos = torus_knot(p, q, t);
	vec3 pos2 = torus_knot(p, q, t + 0.001);
	vec3 tangent = pos - pos2;
	vec3 n = pos + pos2;
	vec3 bitan = cross(tangent, n);
	n = cross(bitan, tangent);
	bitan = normalize(bitan);
	n = normalize(n);

	mat3 transform = mat3(tangent, bitan, n);

	vec3 point = transform * vec3(0, position.yz);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(0.35 * pos + point, 1.0);
}
