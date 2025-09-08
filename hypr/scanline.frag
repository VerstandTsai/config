#version 300 es

precision mediump float;
in vec2 v_texcoord;
layout(location = 0) out vec4 fragColor;
uniform sampler2D tex;

void main() {
    vec4 color = texture(tex, v_texcoord);
	color.rgb += 0.02 * sin(v_texcoord.y * 1250.0);
	fragColor = color;
}

