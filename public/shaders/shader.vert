#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying float t;

vec3 torus_knot(float p, float q, float t) {
	float qt = q * t;
	float pt = p * t;
	float r = cos(qt) + 2.0;
	float x = r * cos(pt);
	float y = r * sin(pt);
	float z = -sin(qt);
	return vec3(x, y, z);
}

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

void main() {
	gl_PointSize = 1.0;
	float distance = 0.8;

	t = mod((position.x + (time * M_TAU / 100.0)), M_TAU);

	float p = 3.0;
	float q = 8.0;
	vec3 pos = torus_knot(p, q, t);
	vec3 pos2 = torus_knot(p, q, t - 0.001);
	vec3 pos3 = torus_knot(p, q, t + 0.001);
	mat3 frame = frenet_frame(pos2, pos3);

	mat3 rotation = make_rotation_x(time * M_TAU / 3.0);

	vec3 point = frame * rotation * vec3(0, position.yz);

		//	point.setX((point.x + 2 * Math.PI * t / 100) % (2 * Math.PI));
	gl_Position = projectionMatrix * modelViewMatrix * vec4(0.35 * pos + point, 1.0);
//	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
