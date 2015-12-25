#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;

uniform vec4 firstColor;
uniform vec4 secondColor;
uniform vec4 thirdColor;

uniform float shininess;
uniform float numBumps;
uniform float numTwists;
uniform float uLighting;

varying vec3 vParams;
varying vec3 vPosition;
varying vec3 vNormal;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 hex2rgb(int v) {
	float r = mod(float(v) / 256.0 / 256.0, 256.0);
	float g = mod(float(v) / 256.0, 256.0);
	float b = mod(float(v), 256.0);
	return vec3(r / 255.0, g / 255.0, b / 255.0);
}

//vec3 mix3(vec3 a, vec3 b, vec3 c, float t) {
//	float n = 3.0;
//	float m = n - 1.0;
//	float wa = 1.0 - min(1.0, abs(t * m - 0.0));
//	float wb = 1.0 - min(1.0, abs(t * m - 1.0));
//	float wc = 1.0 - min(1.0, abs(t * m - 2.0));
//	return wa * a + wb * b + wc * c;
//}

float mod_dist(float a, float b, float m) {
	float diff = abs(b - a);
	return min(diff, m - diff);
}

vec3 mix3(vec3 a, vec3 b, vec3 c, float t) {
	float n = 3.0;
	float s = mod(t, 1.0) * n;
	float wa = 1.0 - min(1.0, mod_dist(s, 0.0, n));
	float wb = 1.0 - min(1.0, mod_dist(s, 1.0, n));
	float wc = 1.0 - min(1.0, mod_dist(s, 2.0, n));
	return wa * a + wb * b + wc * c;
}

void main() {
	if (length(gl_PointCoord * 2.0 - 1.0) > 1.0) {
		discard;
	}

	vec3 normal = normalize(vNormal);
	float ambient = 0.1;
	float diffuse = max(0.0, normal.z);
	float specular = pow(max(0.0, normal.z), shininess);
	float lighting = max(1.0 - uLighting, ambient + diffuse + specular);
	float alpha = max(1.0 - uLighting, max(0.2, vPosition.z / 2.0 + 0.7));
//	lighting = 1.0;
//	alpha = 1.0;
//	gl_FragColor = vec4(vec3(0.2, 0.3, 0.4) * lighting, alpha);
//	vec3 color = hsv2rgb(vec3(1.0 * (vParams.x - 64.0 * vParams.y - M_TAU / 4.0) / M_TAU, 1.0, 1.0));
//	float w = (vParams.x - 64.0 * vParams.y - M_TAU / 4.0) / M_TAU;
//	float w = (vParams.x - numTwists * vParams.y + M_TAU / 4.0) / M_TAU;
	float w = (vParams.x - numTwists * vParams.y) / M_TAU;
//	float w = (vParams.x - 82.0 * vParams.y) / M_TAU;
//	float w = vParams.y / M_TAU;
//	vec3 color = mix3(hex2rgb(0xaaaaaa), hex2rgb(0x690000), hex2rgb(0x009900), w);
	vec3 color = mix3(firstColor.xyz, secondColor.xyz, thirdColor.xyz, w);
//	vec3 color = mix3(hex2rgb(float(0xff0000)), hex2rgb(float(0x00ff00)), hex2rgb(float(0x0000ff)), vParams.y / M_TAU);
//	vec3 color = mix3(hex2rgb(float(0xff0000)), hex2rgb(float(0x00ff00)), hex2rgb(float(0x0000ff)), mod((vParams.x - 64.0 * vParams.y) / M_TAU, 1.0));
//	vec3 color = vec3(0.2, 0.3, 0.4) + 0.2;
//	vec3 color = vec3(0.5, 0.3, 0.7);
	gl_FragColor = vec4(color * lighting, alpha);
//	gl_FragColor = vec4(color, 1.0);
//	gl_FragColor = vec4(vec3(0.2, 0.3, 0.4) * lighting, vPosition.z);

//	float s = t / M_TAU;
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
//	float r = ((sin(8.0 * (t - M_TAU / 8.0 - (0.2 * time))) + 1.0) / 2.0);
//	gl_FragColor = vec4(r * vec3(0.2, 0.3, 0.4), 1.0);
//	gl_FragColor = vec4(0.2, 0.3 * r, 0.4, 1.0);
//	gl_FragColor = vec4(0.2 * r, 0.3 * (1.0 - r), 0.4, 0.5);
//	gl_FragColor = vec4(vec3(max(0.0, vNormal.z)), 1.0);
//	gl_FragColor = vec4(vNormal, float(normal.z > 0.0));
//	gl_FragColor = vec4(vNormal, alpha);
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
//	gl_FragColor = vec4(normal.z);
//	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//	gl_FragColor = vec4(0.2, 0.3, 0.4, t / M_TAU);
}
