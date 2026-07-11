import { memo, useCallback, useId, useState, type CSSProperties } from 'react';
import { Trash2 } from 'lucide-react';
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

function isDefaultPreset(label: string): boolean {
  return label.toLowerCase() === 'default';
}

function chipContainerClasses(label: string, selected: boolean, dragging = false): string {
  const compact = label.length <= 3;
  const width = compact ? 'min-w-[3.25rem]' : 'min-w-[4.5rem]';
  const state = selected
    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400'
    : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white hover:border-blue-400';
  const drag = dragging ? 'shadow-lg ring-2 ring-blue-400/60 scale-105 z-50' : '';
  return `inline-flex items-center h-11 rounded-full border font-medium transition-[transform,box-shadow,border-color,background-color] shrink-0 ${width} ${state} ${drag}`;
}

function placeholderClasses(label: string): string {
  const compact = label.length <= 3;
  const size = compact ? 'min-w-[3.25rem] h-11' : 'min-w-[4.5rem] h-11';
  return `inline-flex items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shrink-0 ${size}`;
}

interface PresetChipContentProps {
  label: string;
  selected: boolean;
  deletable?: boolean;
  dragging?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  style?: CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
}

const PresetChipContent = memo(function PresetChipContent({
  label,
  selected,
  deletable = false,
  dragging = false,
  disabled = false,
  onSelect,
  onDelete,
  style,
  setNodeRef,
  dragAttributes,
  dragListeners,
}: PresetChipContentProps) {
  const isDefault = isDefaultPreset(label);
  const compact = label.length <= 3;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={chipContainerClasses(label, selected, dragging)}
      role="listitem"
    >
      <button
        type="button"
        onClick={onSelect}
        className={`flex-1 h-full flex items-center justify-center touch-none cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded-full ${
          compact ? 'text-sm pl-3' : 'text-xs leading-tight pl-4'
        } ${deletable ? 'pr-0.5' : 'pr-3'}`}
        aria-pressed={selected}
        aria-label={`Size preset ${label}. Drag to reorder.`}
        {...dragAttributes}
        {...dragListeners}
      >
        {label}
      </button>

      {deletable && !isDefault && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          disabled={disabled}
          className="flex items-center justify-center w-7 h-7 mr-1 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label={`Delete size ${label}`}
          title={`Delete size ${label}`}
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}

      {isDefault && (
        <span
          className="w-2 shrink-0"
          title="Default preset cannot be deleted"
          aria-hidden
        />
      )}
    </div>
  );
});

interface SortablePresetChipProps {
  preset: ApiMeasurementPreset;
  selected: boolean;
  onSelect: (preset: ApiMeasurementPreset) => void;
  onDelete: (preset: ApiMeasurementPreset) => void;
  disabled?: boolean;
}

const SortablePresetChip = memo(function SortablePresetChip({
  preset,
  selected,
  onSelect,
  onDelete,
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
    <PresetChipContent
      label={preset.label}
      selected={selected}
      deletable
      disabled={disabled}
      onSelect={() => onSelect(preset)}
      onDelete={() => onDelete(preset)}
      setNodeRef={setNodeRef}
      style={style}
      dragAttributes={attributes}
      dragListeners={listeners}
    />
  );
});

export interface SortablePresetChipsProps {
  presets: ApiMeasurementPreset[];
  selectedPresetId: string | null;
  onSelect: (preset: ApiMeasurementPreset) => void;
  onReorder: (reordered: ApiMeasurementPreset[]) => void | Promise<void>;
  onDelete: (preset: ApiMeasurementPreset) => void;
  disabled?: boolean;
}

export function SortablePresetChips({
  presets,
  selectedPresetId,
  onSelect,
  onReorder,
  onDelete,
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
                onDelete={onDelete}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)' }}>
        {activePreset ? (
          <PresetChipContent
            label={activePreset.label}
            selected={selectedPresetId === activePreset.id}
            dragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
