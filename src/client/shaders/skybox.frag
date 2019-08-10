precision highp float;

uniform samplerCube tCube;

varying vec3 eyeDirection;

void main() {
    gl_FragColor = textureCube(tCube, eyeDirection);
}