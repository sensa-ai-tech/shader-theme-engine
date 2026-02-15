import type { Metadata } from 'next';
import { EditorPage } from '@/components/editor/EditorPage';

export const metadata: Metadata = {
  title: 'ShaderTheme Editor',
  description: 'Visual editor for creating and customizing WebGL shader themes',
};

export default function EditorRoute() {
  return <EditorPage />;
}
