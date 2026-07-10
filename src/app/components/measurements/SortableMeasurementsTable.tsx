import { memo, useCallback, useId, useState, type CSSProperties, type ReactNode } from 'react';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Edit,
  GripVertical,
  Image as ImageIcon,
  Ruler,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';
import type { ApiMeasurement } from '../../api/types/measurement';

interface MeasurementRowContentProps {
  measurement: ApiMeasurement;
  submitting: boolean;
  onSelect: (measurement: ApiMeasurement) => void;
  onToggleStatus: (measurement: ApiMeasurement) => void;
  onEdit: (measurement: ApiMeasurement) => void;
  onDelete: (id: string) => void;
  dragHandle?: ReactNode;
  isOverlay?: boolean;
}

const MeasurementRowContent = memo(function MeasurementRowContent({
  measurement,
  submitting,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
  dragHandle,
  isOverlay = false,
}: MeasurementRowContentProps) {
  return (
    <>
      <td className="w-10 px-3 py-4 whitespace-nowrap">{dragHandle}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onSelect(measurement)}
          className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
          tabIndex={isOverlay ? -1 : 0}
        >
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{measurement.name}</span>
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
        {measurement.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{measurement.unit}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onToggleStatus(measurement)}
          disabled={submitting || isOverlay}
          className="flex items-center gap-2 text-sm disabled:opacity-50"
          tabIndex={isOverlay ? -1 : 0}
        >
          {measurement.status === 'ENABLED' ? (
            <>
              <ToggleRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-400 font-medium">Enabled</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-6 h-6 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 font-medium">Disabled</span>
            </>
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => onEdit(measurement)}
            disabled={submitting || isOverlay}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
            tabIndex={isOverlay ? -1 : 0}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(measurement.id)}
            disabled={submitting || isOverlay}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
            tabIndex={isOverlay ? -1 : 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </>
  );
});

interface SortableMeasurementRowProps {
  measurement: ApiMeasurement;
  submitting: boolean;
  disabled?: boolean;
  onSelect: (measurement: ApiMeasurement) => void;
  onToggleStatus: (measurement: ApiMeasurement) => void;
  onEdit: (measurement: ApiMeasurement) => void;
  onDelete: (id: string) => void;
}

const SortableMeasurementRow = memo(function SortableMeasurementRow({
  measurement,
  submitting,
  disabled = false,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
}: SortableMeasurementRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: measurement.id,
    disabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const dragHandle = (
    <button
      ref={setActivatorNodeRef}
      type="button"
      className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 touch-none"
      aria-label={`Drag to reorder ${measurement.name}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-5 h-5" />
    </button>
  );

  if (isDragging) {
    return (
      <tr
        ref={setNodeRef}
        style={style}
        className="bg-white dark:bg-gray-800"
        aria-hidden
      >
        <td colSpan={6} className="px-3 py-2">
          <div className="h-14 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/40 dark:bg-blue-900/20" />
        </td>
      </tr>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
        measurement.status === 'DISABLED' ? 'opacity-60' : ''
      }`}
      data-measurement-id={measurement.id}
    >
      <MeasurementRowContent
        measurement={measurement}
        submitting={submitting}
        onSelect={onSelect}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandle={dragHandle}
      />
    </tr>
  );
});

export interface SortableMeasurementsTableProps {
  measurements: ApiMeasurement[];
  submitting: boolean;
  reordering?: boolean;
  onReorder: (reordered: ApiMeasurement[]) => void | Promise<void>;
  onSelectMeasurement: (measurement: ApiMeasurement) => void;
  onToggleStatus: (measurement: ApiMeasurement) => void;
  onEdit: (measurement: ApiMeasurement) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function SortableMeasurementsTable({
  measurements,
  submitting,
  reordering = false,
  onReorder,
  onSelectMeasurement,
  onToggleStatus,
  onEdit,
  onDelete,
  emptyMessage = 'No measurements yet.',
}: SortableMeasurementsTableProps) {
  const dndId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeMeasurement = activeId ? measurements.find((m) => m.id === activeId) : null;
  const dragDisabled = reordering || submitting;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id || dragDisabled) return;

      const oldIndex = measurements.findIndex((m) => m.id === active.id);
      const newIndex = measurements.findIndex((m) => m.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onReorder(arrayMove(measurements, oldIndex, newIndex));
    },
    [dragDisabled, measurements, onReorder]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        autoScroll={{
          threshold: { x: 0.1, y: 0.12 },
          acceleration: 12,
          interval: 8,
          order: ['vertical', 'horizontal'],
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-10 px-3 py-3" aria-label="Reorder" />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Measurement Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <SortableContext items={measurements.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {measurements.map((measurement) => (
                  <SortableMeasurementRow
                    key={measurement.id}
                    measurement={measurement}
                    submitting={submitting}
                    disabled={dragDisabled}
                    onSelect={onSelectMeasurement}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </div>

        <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)' }}>
          {activeMeasurement ? (
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-blue-200 dark:ring-blue-800">
              <tbody>
                <tr className="scale-[1.01] shadow-lg">
                  <MeasurementRowContent
                    measurement={activeMeasurement}
                    submitting={submitting}
                    onSelect={onSelectMeasurement}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    dragHandle={
                      <span className="p-1.5 inline-flex cursor-grabbing text-gray-500">
                        <GripVertical className="w-5 h-5" />
                      </span>
                    }
                    isOverlay
                  />
                </tr>
              </tbody>
            </table>
          ) : null}
        </DragOverlay>
      </DndContext>

      {!measurements.length && (
        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">{emptyMessage}</div>
      )}
    </div>
  );
}
