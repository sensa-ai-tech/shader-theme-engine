'use client';

import { type ReactNode, type CSSProperties } from 'react';

export interface FallbackWrapperProps {
  /** CSS fallback styling (e.g., background gradient) */
  fallbackStyle?: CSSProperties;
  /** CSS fallback class name */
  fallbackClassName?: string;
  /** Content to render inside the fallback */
  children?: ReactNode;
}

/**
 * Simple CSS-only fallback for when WebGL is unavailable.
 * Used as the `fallback` prop of ShaderCanvas.
 */
export function FallbackWrapper({
  fallbackStyle,
  fallbackClassName,
  children,
}: FallbackWrapperProps) {
  return (
    <div
      className={fallbackClassName}
      style={{
        width: '100%',
        height: '100%',
        ...fallbackStyle,
      }}
    >
      {children}
    </div>
  );
}
