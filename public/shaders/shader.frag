#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;

varying float t;

void main() {
//	float s = t / M_TAU;
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
	float r = ((sin(8.0 * (t - M_TAU / 8.0 - (0.1 * time))) + 1.0) / 2.0);
//	gl_FragColor = vec4(r * vec3(0.2, 0.3, 0.4), 1.0);
//	gl_FragColor = vec4(0.2, 0.3 * r, 0.4, 1.0);
	gl_FragColor = vec4(0.2 * r, 0.3 * (1.0 - r), 0.4, 1.0);
}
