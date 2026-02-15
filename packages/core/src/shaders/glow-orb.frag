#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_glowColor;
uniform float u_intensity;
uniform float u_radius;
uniform float u_speed;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

    // Mouse position in UV space (default to center if no mouse)
    vec2 mouse = u_mouse / u_resolution;
    if (u_mouse.x <= 0.0 && u_mouse.y <= 0.0) {
        mouse = vec2(0.5);
    }

    // Subtle animation — orb drifts slowly
    float drift = u_time * u_speed;
    vec2 orbCenter = mouse + vec2(sin(drift * 0.7) * 0.02, cos(drift * 0.9) * 0.02);

    // Distance from orb center (aspect-corrected)
    float dist = distance(uv * aspect, orbCenter * aspect);

    // Smooth radial falloff
    float normalizedRadius = u_radius / u_resolution.x;
    float glow = exp(-dist * dist / (normalizedRadius * normalizedRadius * 2.0));
    glow *= u_intensity;

    // Soft color
    vec3 color = u_glowColor * glow;
    float alpha = glow;

    fragColor = vec4(color, alpha);
}
