vec3 rgb2yuv(vec3 color) {
    return vec3(
        dot(vec3( 0.2126,  0.7152,  0.0722), color),
        dot(vec3(-0.1146, -0.3854,  0.5000), color),
        dot(vec3( 0.5000, -0.4542, -0.0458), color)
    );
}

vec3 yuv2rgb(vec3 yuv) {
    return vec3(
        dot(vec3(1,  0.0000,  1.5748), yuv),
        dot(vec3(1, -0.1873, -0.4681), yuv),
        dot(vec3(1,  1.8556,  0.0000), yuv)
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 color = texture(iChannel0, uv);
    vec3 yuv = rgb2yuv(color.rgb);
    yuv.x *= mix(1, 1 - fract(uv.y + 0.25*iTime), 0.5);
    fragColor = vec4(yuv2rgb(yuv), color.a);
}

