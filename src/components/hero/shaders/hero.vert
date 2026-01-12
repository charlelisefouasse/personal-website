varying vec2 vTextureCoord;

void main() {
    vTextureCoord = uv;
    // Position is -1..1 if using PlaneGeometry(2, 2)
    gl_Position = vec4(position, 1.0);
}
