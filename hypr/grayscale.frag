#version 300 es

precision mediump float;
in vec2 v_texcoord;
layout(location = 0) out vec4 fragColor;
uniform sampler2D tex;

void main() {
    vec4 color = texture(tex, v_texcoord);
    float lightness = (2.0*color.r + 4.0*color.g + color.b) / 7.0;
	fragColor = vec4(lightness, lightness, lightness, 1.0);
}

