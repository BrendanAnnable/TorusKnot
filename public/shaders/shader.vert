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
	gl_PointSize = 1.2;
	float distance = 0.8;
//	float c = cos(position.x * M_TAU);
//	float s = sin(position.x * M_TAU);
//	mat4 transform = mat4(c, s, 0, 0,
//						  -s, c, 0, 0,
//						  0, 0, 1, 0,
//						  0, 0, 0, 1);
//	vec4 polar = transform * vec4(0, position.y + distance, position.z, 1.0);
//	gl_Position = projectionMatrix * modelViewMatrix * polar;

//	float t = position.x;
//	float x = sin(t) + 2.0 * sin(2.0 * t);
//	float y = cos(t) - 2.0 * cos(2.0 * t);
//	float z = -sin(3.0 * t);
//	gl_Position = projectionMatrix * modelViewMatrix * vec4(0.3 * vec3(x, y, z), 1.0);
	t = mod((position.x + (time * M_TAU / 100.0)), M_TAU);
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

	float c = cos(time * M_TAU / 3.0);
	float s = sin(time * M_TAU / 3.0);
	mat3 transform2 = mat3(1, 0, 0,
						  0, c, -s,
						  0, s, c);

	vec3 point = transform * transform2 * vec3(0, position.yz);

		//	point.setX((point.x + 2 * Math.PI * t / 100) % (2 * Math.PI));
	gl_Position = projectionMatrix * modelViewMatrix * vec4(0.35 * pos + point, 1.0);
//	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
