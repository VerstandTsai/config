void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 c = vec2(0.5);
    vec2 uv = fragCoord / iResolution.xy;
    vec2 r = uv - c;
    fragColor = texture(iChannel0, uv + dot(r, r) * r / 16);
}

