#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_speed;
uniform float u_distortion;
uniform sampler2D u_noise;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Scrolling UV for animated noise sampling
    vec2 scroll1 = uv + vec2(u_time * u_speed * 0.1, u_time * u_speed * 0.07);
    vec2 scroll2 = uv + vec2(-u_time * u_speed * 0.08, u_time * u_speed * 0.12);

    // Sample pre-computed noise texture (R, G, B channels = 3 independent noise fields)
    vec3 noise1 = texture(u_noise, scroll1 * 0.8).rgb;
    vec3 noise2 = texture(u_noise, scroll2 * 1.2).rgb;

    // Combine noise for distortion
    float distort = (noise1.r + noise2.g - 1.0) * u_distortion;
    vec2 distortedUV = uv + vec2(distort * 0.15, distort * 0.1);

    // Multi-color blending using distorted noise
    float blend1 = noise1.r * 0.5 + noise2.r * 0.5;
    float blend2 = noise1.g * 0.4 + noise2.b * 0.6;

    // Smooth 3-way gradient
    vec3 color = mix(u_color1, u_color2, smoothstep(0.2, 0.8, blend1 + distortedUV.x * 0.3));
    color = mix(color, u_color3, smoothstep(0.3, 0.7, blend2 + distortedUV.y * 0.2));

    // Subtle vignette
    float vignette = 1.0 - distance(uv, vec2(0.5)) * 0.4;
    color *= vignette;

    fragColor = vec4(color, 1.0);
}
