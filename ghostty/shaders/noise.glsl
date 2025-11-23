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

float floatConstruct(uint m) {
    const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
    const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
    m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
    m |= ieeeOne;                          // Add fractional part to 1.0
    float f = uintBitsToFloat(m);          // Range [1:2]
    return f - 1.0;                        // Range [0:1]
}

uint hash(uint x) {
    x += x << 10;
    x ^= x >> 6;
    x += x << 3;
    x ^= x >> 11;
    x += x << 15;
    return x;
}

float rand(vec3 u) {
    uvec3 v = floatBitsToUint(u);
    return floatConstruct(hash(hash(hash(v.x) ^ v.y) ^ v.z));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 color = texture(iChannel0, uv);
    vec3 yuv = rgb2yuv(color.rgb);
    yuv.x *= mix(1, rand(vec3(floor(fragCoord / 4), iTime)), 0.5);
    fragColor = vec4(yuv2rgb(yuv), color.a);
}

