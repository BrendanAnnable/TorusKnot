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
uniform bool uLighting;
uniform bool uAmbient;
uniform bool uDiffuse;
uniform bool uSpecular;
uniform bool debugNormals;
uniform bool debugLighting;

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
	vec3 normal = normalize(vNormal);

	if (debugNormals) {
		gl_FragColor = vec4(normal, 1.0);
		return;
	}

	float lighting = 0.0;

	if (uAmbient) {
		lighting += 0.2;
	}
	if (uDiffuse) {
		lighting += max(0.0, normal.z);
	}
	if (uSpecular) {
		lighting += pow(max(0.0, normal.z), shininess);
	}

	const float numColors = 3.0;
	float k = (numBumps * vParams.x / numColors) / M_TAU;
	vec3 color = mix3(firstColor.xyz, secondColor.xyz, thirdColor.xyz, k);

	if (!debugLighting) {
		lighting *= max(0.2, vPosition.z / 2.0 + 0.7);
	}

	if (uLighting) {
		color *= lighting;
	}

	if (debugLighting) {
		color = vec3(lighting);
	}

	gl_FragColor = vec4(color, 1.0);
}
