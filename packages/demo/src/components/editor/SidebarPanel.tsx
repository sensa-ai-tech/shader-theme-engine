'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeMetaEditor } from './ThemeMetaEditor';
import { ColorsEditor } from './ColorsEditor';
import { PerformanceEditor } from './PerformanceEditor';
import { SectionEditor } from './SectionEditor';
import { useEditorContext } from '@/hooks/useThemeEditor';

export function SidebarPanel() {
  const { state, dispatch } = useEditorContext();
  const sectionNames = Object.keys(state.theme.sections);
  const [newSectionName, setNewSectionName] = useState('');

  const addSection = useCallback(() => {
    const name = newSectionName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name) return;
    dispatch({ type: 'ADD_SECTION', payload: { name } });
    setNewSectionName('');
  }, [dispatch, newSectionName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') addSection();
    },
    [addSection],
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-1">
        <Accordion
          type="multiple"
          defaultValue={['meta', 'colors', ...sectionNames.slice(0, 1)]}
          className="w-full"
        >
          <AccordionItem value="meta">
            <AccordionTrigger className="text-sm font-medium py-2">
              Theme Info
            </AccordionTrigger>
            <AccordionContent>
              <ThemeMetaEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="colors">
            <AccordionTrigger className="text-sm font-medium py-2">
              Colors
            </AccordionTrigger>
            <AccordionContent>
              <ColorsEditor />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="performance">
            <AccordionTrigger className="text-sm font-medium py-2">
              Performance
            </AccordionTrigger>
            <AccordionContent>
              <PerformanceEditor />
            </AccordionContent>
          </AccordionItem>

          {sectionNames.map((name) => (
            <AccordionItem key={name} value={name}>
              <AccordionTrigger className="text-sm font-medium py-2 capitalize">
                {name}
              </AccordionTrigger>
              <AccordionContent>
                <SectionEditor section={name} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add section */}
        <div className="flex items-center gap-2 pt-2">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Section name..."
            className="h-8 text-xs"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={addSection}
            disabled={!newSectionName.trim()}
            aria-label="Add section"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
