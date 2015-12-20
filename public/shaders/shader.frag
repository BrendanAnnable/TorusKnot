#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;

varying float t;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
//	float s = t / M_TAU;
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
	float r = ((sin(10.0 * (t - M_TAU / 8.0 - (time / 4.0))) + 1.0) / 2.0);
	float g = ((sin(4.0 * (t - M_TAU / 4.0 - (time) + M_PI / 2.0)) + 1.0) / 2.0);
//	gl_FragColor = vec4(r * vec3(0.2, 0.3, 0.4), 1.0);
//	gl_FragColor = vec4(0.2, 0.3 * r, 0.4, 1.0);
//	gl_FragColor = vec4(0.2 * r, 0.3 * (1.0 - r), 0.4, 1.0);
//	gl_FragColor = vec4(0.8 * r, 0.8 * (1.0 - r), 0.4, 1.0);
	gl_FragColor = vec4(hsv2rgb(vec3(sin(4.0 * M_TAU * (time - 15.0 * t) / 15.0) * 2.0 + 0.5, 1.0, 1.0)), 0.3);
//	gl_FragColor = vec4(0.2, 0.0, 0.4, 1.0);
//	gl_FragColor = vec4(0.3, 0.1, 0.8, 1.0);
//	gl_FragColor = vec4(0.3, 0.1, 0.8 * (sin(4.0 * t - time) * 2.0 + 0.5), 1.0);
//	gl_FragColor = vec4(0.2, 0.0, 0.8 * r, 0.3);
//	gl_FragColor = vec4(0.2, 0.5 * g, 0.8 * r, 1.0);
//	gl_FragColor = vec4(0.8, 0.8, 1.0, 1.0);
}
