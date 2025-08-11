#version 300 es

precision mediump float;
in vec2 v_texcoord;
layout(location = 0) out vec4 fragColor;
uniform sampler2D tex;

void main() {

    vec4 pixColor = texture(tex, v_texcoord);

    pixColor[0] = 0.0;
    pixColor[1] = 0.0;

    fragColor = pixColor;
}
