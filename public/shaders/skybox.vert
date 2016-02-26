precision highp float;

uniform mat4 inverseProjectionMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying vec3 eyeDirection;

mat3 transpose(mat3 m) {
	return mat3(vec3(m[0][0], m[1][0], m[2][0]), vec3(m[0][1], m[1][1], m[2][1]), vec3(m[0][2], m[1][2], m[2][2]));
}

void main() {
	// Adapted from: http://gamedev.stackexchange.com/a/60377/52260
    vec3 unprojectedPosition = (inverseProjectionMatrix * vec4(position, 1.0)).xyz;
    eyeDirection = transpose(mat3(modelViewMatrix)) * unprojectedPosition;
    gl_Position = vec4(position, 1.0);
}