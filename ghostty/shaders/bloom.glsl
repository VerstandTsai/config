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

vec3 threshold(vec2 p, vec2 a) {
    vec3 yuv = rgb2yuv(texture(iChannel0, p/a).rgb);
    return yuv.x > 0.1 ? yuv : vec3(0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord;
    vec2 a = iResolution.xy;
    vec4 color = texture(iChannel0, p/a);
    vec3 yuv = rgb2yuv(color.rgb);
    vec3 bloom =
        threshold(p, a) * 0.25 +
        threshold(p+vec2( 1,  0), a) * 0.125 +
        threshold(p+vec2(-1,  0), a) * 0.125 +
        threshold(p+vec2( 0,  1), a) * 0.125 +
        threshold(p+vec2( 0, -1), a) * 0.125 +
        threshold(p+vec2( 1,  1), a) * 0.0625 +
        threshold(p+vec2(-1,  1), a) * 0.0625 +
        threshold(p+vec2( 1, -1), a) * 0.0625 +
        threshold(p+vec2(-1, -1), a) * 0.0625;
    vec3 bloomed = mix(rgb2yuv(color.rgb), bloom, 0.75);
    if (bloomed.x < yuv.x) bloomed = yuv;
    fragColor = vec4(yuv2rgb(bloomed), color.a);
}

