#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_density;
uniform float u_speed;
uniform vec3 u_color;
uniform float u_opacity;

out vec4 fragColor;

// Simple hash function for grain noise
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Animated grain — changes every frame at u_speed rate
    float timeOffset = floor(u_time * u_speed * 10.0);
    float grain = hash(gl_FragCoord.xy + timeOffset);

    // Apply density — only show grain above threshold
    grain = step(1.0 - u_density, grain);

    // Mix grain with base color
    vec3 color = u_color;
    float alpha = grain * u_opacity;

    fragColor = vec4(color, alpha);
}
