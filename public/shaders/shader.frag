#define M_TAU 6.2831853071795864769252867665590

precision highp float;

varying float t;

void main() {
	float s = t / M_TAU;
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
	float r = ((sin(4.0 * t - M_TAU / 4.0) + 1.0) / 2.0);
	gl_FragColor = vec4(r * vec3(0.2, 0.3, 0.4), 1.0);
	gl_FragColor = vec4(0.2, 0.3 * r, 0.4, 1.0);
	gl_FragColor = vec4(0.2 * r, 0.3 * (1.0 - r), 0.4, 1.0);
}
