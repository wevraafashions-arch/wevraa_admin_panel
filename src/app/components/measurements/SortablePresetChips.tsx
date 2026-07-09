import { memo, useCallback, useId, useState, type CSSProperties } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DraggableAttributes,
  type SyntheticListenerMap,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ApiMeasurementPreset } from '../../api/types/measurementPreset';

function presetChipClasses(label: string, selected: boolean, dragging = false): string {
  const compact = label.length <= 3;
  const size = compact ? 'min-w-11 h-11 px-3 text-sm' : 'min-w-16 h-11 px-4 text-xs leading-tight';
  const state = selected
    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400'
    : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white hover:border-blue-400';
  const drag = dragging ? 'shadow-lg ring-2 ring-blue-400/60 scale-105 z-50 cursor-grabbing' : 'cursor-grab';
  return `inline-flex items-center justify-center rounded-full border font-medium transition-[transform,box-shadow,border-color,background-color] shrink-0 touch-none select-none ${size} ${state} ${drag}`;
}

function placeholderClasses(label: string): string {
  const compact = label.length <= 3;
  const size = compact ? 'min-w-11 h-11' : 'min-w-16 h-11';
  return `inline-flex items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shrink-0 ${size}`;
}

interface PresetChipProps {
  label: string;
  selected: boolean;
  dragging?: boolean;
  isPlaceholder?: boolean;
  onSelect?: () => void;
  style?: CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

const PresetChip = memo(function PresetChip({
  label,
  selected,
  dragging = false,
  isPlaceholder = false,
  onSelect,
  style,
  setNodeRef,
  attributes,
  listeners,
}: PresetChipProps) {
  if (isPlaceholder) {
    return <div className={placeholderClasses(label)} style={style} aria-hidden />;
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      onClick={onSelect}
      className={presetChipClasses(label, selected, dragging)}
      aria-pressed={selected}
      aria-label={`Size preset ${label}. Drag to reorder.`}
      role="listitem"
      {...attributes}
      {...listeners}
    >
      {label}
    </button>
  );
});

interface SortablePresetChipProps {
  preset: ApiMeasurementPreset;
  selected: boolean;
  onSelect: (preset: ApiMeasurementPreset) => void;
  disabled?: boolean;
}

const SortablePresetChip = memo(function SortablePresetChip({
  preset,
  selected,
  onSelect,
  disabled = false,
}: SortablePresetChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: preset.id,
    disabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0 : 1,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={placeholderClasses(preset.label)} aria-hidden>
        <span className="sr-only">Drop zone for {preset.label}</span>
      </div>
    );
  }

  return (
    <PresetChip
      label={preset.label}
      selected={selected}
      onSelect={() => onSelect(preset)}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  );
});

export interface SortablePresetChipsProps {
  presets: ApiMeasurementPreset[];
  selectedPresetId: string | null;
  onSelect: (preset: ApiMeasurementPreset) => void;
  onReorder: (reordered: ApiMeasurementPreset[]) => void | Promise<void>;
  disabled?: boolean;
}

export function SortablePresetChips({
  presets,
  selectedPresetId,
  onSelect,
  onReorder,
  disabled = false,
}: SortablePresetChipsProps) {
  const dndId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activePreset = activeId ? presets.find((p) => p.id === activeId) : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id || disabled) return;

      const oldIndex = presets.findIndex((p) => p.id === active.id);
      const newIndex = presets.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onReorder(arrayMove(presets, oldIndex, newIndex));
    },
    [disabled, onReorder, presets]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  if (!presets.length) return null;

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={{
        threshold: { x: 0.12, y: 0.12 },
        acceleration: 12,
        interval: 8,
        order: ['horizontal', 'vertical'],
      }}
    >
      <div
        className="overflow-x-auto overflow-y-visible -mx-1 px-1 pb-1 scrollbar-thin"
        role="list"
        aria-label="Size presets"
      >
        <SortableContext items={presets.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex items-center gap-2 flex-nowrap w-max min-h-11">
            {presets.map((preset) => (
              <SortablePresetChip
                key={preset.id}
                preset={preset}
                selected={selectedPresetId === preset.id}
                onSelect={onSelect}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)' }}>
        {activePreset ? (
          <PresetChip
            label={activePreset.label}
            selected={selectedPresetId === activePreset.id}
            dragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
