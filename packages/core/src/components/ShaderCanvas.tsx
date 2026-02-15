'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  createWebGLContext, createProgram, createFullscreenQuad,
  getUniformLocations, setUniform, disposeResources,
  DEFAULT_VERTEX_SHADER, DEFAULT_VERTEX_SHADER_V1,
} from '../lib/shader-utils';
import { PerformanceMonitor, DOWNGRADE_EVENT } from '../lib/performance-monitor';
import type { ShaderCanvasProps, ShaderResources } from './shader-canvas-types';

export type { ShaderCanvasProps, ShaderFrameContext, ShaderInitContext } from './shader-canvas-types';

const CONTAINER_STYLE = { position: 'relative' as const, overflow: 'hidden' as const };
const CANVAS_STYLE = { display: 'block', width: '100%', height: '100%', position: 'absolute' as const, top: 0, left: 0 };

export function ShaderCanvas({
  fragmentShader, vertexShader, uniformNames = [],
  onFrame, onInit, fallback, className, style, speed = 1.0,
}: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const rafIdRef = useRef<number>(0);
  const resourcesRef = useRef<ShaderResources | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handler = () => setUseFallback(true);
    window.addEventListener(DOWNGRADE_EVENT, handler);
    return () => window.removeEventListener(DOWNGRADE_EVENT, handler);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      resourcesRef.current?.gl.viewport(0, 0, w, h);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxResult = createWebGLContext(canvas);
    if (!ctxResult) { setUseFallback(true); return; }

    const { gl, isWebGL2 } = ctxResult;
    const vs = vertexShader ?? (isWebGL2 ? DEFAULT_VERTEX_SHADER : DEFAULT_VERTEX_SHADER_V1);
    const fs = isWebGL2 ? fragmentShader : fragmentShader.replace(/^#version\s+300\s+es\s*/m, '');

    let program: WebGLProgram;
    try { program = createProgram(gl, vs, fs); }
    catch (err) { console.error('[ShaderCanvas]', err); setUseFallback(true); return; }

    gl.useProgram(program);
    const buffer = createFullscreenQuad(gl, program);
    const allUniforms = [...new Set(['u_time', 'u_resolution', 'u_mouse', ...uniformNames])];
    const uniformLocations = getUniformLocations(gl, program, allUniforms);
    resourcesRef.current = { gl, program, buffer, uniformLocations, isWebGL2 };
    resizeCanvas();
    onInit?.({ gl, program, uniformLocations, isWebGL2 });

    const monitor = new PerformanceMonitor();
    let startTime = performance.now();
    let lastTime = startTime;

    const render = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      if (!monitor.recordFrame(dt)) return;
      const effectiveSpeed = prefersReducedMotion.current ? 0 : speed;
      const elapsed = (now - startTime) * 0.001 * effectiveSpeed;
      const c = canvasRef.current;
      if (!c) return;
      setUniform(gl, uniformLocations, 'u_time', { type: '1f', value: elapsed });
      setUniform(gl, uniformLocations, 'u_resolution', { type: '2f', value: [c.width, c.height] });
      onFrame?.({
        gl, program, uniformLocations, time: elapsed,
        deltaTime: dt * 0.001, resolution: [c.width, c.height],
        setUniform: (name, value) => setUniform(gl, uniformLocations, name, value),
      });
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafIdRef.current = requestAnimationFrame(render);
    };
    rafIdRef.current = requestAnimationFrame(render);

    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);

    const handleLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(rafIdRef.current); };
    const handleRestored = () => {
      setTimeout(() => {
        const ctx2 = createWebGLContext(canvas);
        if (!ctx2) { setUseFallback(true); return; }
        let prog2: WebGLProgram;
        try { prog2 = createProgram(ctx2.gl, vs, fs); } catch { setUseFallback(true); return; }
        ctx2.gl.useProgram(prog2);
        const buf2 = createFullscreenQuad(ctx2.gl, prog2);
        const loc2 = getUniformLocations(ctx2.gl, prog2, allUniforms);
        resourcesRef.current = { gl: ctx2.gl, program: prog2, buffer: buf2, uniformLocations: loc2, isWebGL2: ctx2.isWebGL2 };
        resizeCanvas(); monitor.reset();
        startTime = performance.now(); lastTime = startTime;
        rafIdRef.current = requestAnimationFrame(render);
      }, 100);
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
      if (resourcesRef.current) {
        const r = resourcesRef.current;
        disposeResources(r.gl, { program: r.program, buffer: r.buffer });
        resourcesRef.current = null;
        // Defer loseContext to avoid React Strict Mode double-invoke conflicts.
        // In StrictMode (DEV), React unmounts and remounts immediately — if we
        // loseContext() synchronously, the second mount finds a lost context and
        // fails shader compilation. By deferring, the second mount runs first.
        const ext = r.gl.getExtension('WEBGL_lose_context');
        if (ext) {
          setTimeout(() => ext.loseContext(), 0);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragmentShader, vertexShader]);

  const containerStyle = { ...CONTAINER_STYLE, ...style };
  if (useFallback) {
    return <div ref={containerRef} className={className} style={containerStyle}>{fallback}</div>;
  }
  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <canvas ref={canvasRef} style={CANVAS_STYLE} />
    </div>
  );
}
