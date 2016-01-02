precision highp float;

uniform mat4 inverseProjectionMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying vec3 eyeDirection;

mat3 transpose(mat3 m) {
	vec3 x = m[0];
	vec3 y = m[1];
	vec3 z = m[2];
	return mat3(vec3(x.x, y.x, z.x), vec3(x.y, y.y, z.y), vec3(x.z, y.z, z.z));
}

void main() {
	// Adapted from: http://gamedev.stackexchange.com/a/60377/52260
    vec3 unprojectedPosition = (inverseProjectionMatrix * vec4(position, 1.0)).xyz;
    eyeDirection = transpose(mat3(modelViewMatrix)) * unprojectedPosition;
    gl_Position = vec4(position, 1.0);
}