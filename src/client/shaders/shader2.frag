#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;

varying float t;

void main() {
	float a = sin((t - time) * 13.0) * 0.5;
	gl_FragColor = vec4(0.2, 0.3, 0.8, a);
}
