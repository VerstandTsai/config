#version 300 es

precision mediump float;
in vec2 v_texcoord;
layout(location = 0) out vec4 fragColor;
uniform sampler2D tex;

void main() {
    vec4 color = texture(tex, v_texcoord);
    float lightness = (0.2126*color.r + 0.7152*color.g + 0.0722*color.b);
    fragColor = vec4(lightness, lightness, lightness, 1.0);
}

