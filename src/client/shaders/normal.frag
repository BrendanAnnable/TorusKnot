#define M_TAU 6.2831853071795864769252867665590

precision highp float;

varying vec2 vUv;

void main() {
	float b = 0.1 * sin(50.0 * vUv.x * M_TAU) / 2.0 + 0.5;
	gl_FragColor = vec4(vec3(b), 1.0);
}
