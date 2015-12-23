#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.2831853071795864769252867665590

precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
	vec3 normal = normalize(vNormal);
	float ambient = 0.1;
	float diffuse = max(0.0, normal.z);
	float shininess = 10.0;
	float specular = pow(max(0.0, normal.z), shininess);
	float lighting = ambient + diffuse + specular;
	float alpha = max(0.2, vPosition.z / 2.0 + 0.7);
	gl_FragColor = vec4(vec3(0.2, 0.3, 0.4) * lighting, alpha);
//	gl_FragColor = vec4(vec3(0.2, 0.3, 0.4) * lighting, vPosition.z);

//	float s = t / M_TAU;
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
//	float r = ((sin(8.0 * (t - M_TAU / 8.0 - (0.2 * time))) + 1.0) / 2.0);
//	gl_FragColor = vec4(r * vec3(0.2, 0.3, 0.4), 1.0);
//	gl_FragColor = vec4(0.2, 0.3 * r, 0.4, 1.0);
//	gl_FragColor = vec4(0.2 * r, 0.3 * (1.0 - r), 0.4, 0.5);
//	gl_FragColor = vec4(vec3(max(0.0, vNormal.z)), 1.0);
//	gl_FragColor = vec4(vNormal, float(normal.z > 0.0));
//	gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
//	gl_FragColor = vec4(normal.z);
//	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//	gl_FragColor = vec4(0.2, 0.3, 0.4, t / M_TAU);
}
