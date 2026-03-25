import type { AccessoryOption, AccessorySubOption, AddonConfiguration } from '@/app/api/types/addon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { cn } from './ui/utils';

function accessoryDisplayName(options: AccessoryOption[], id: string): string {
  return options.find((o) => o.id === id)?.name ?? id;
}

function subOptionDisplayName(
  options: AccessoryOption[],
  optionIdToSubOptions: Record<string, AccessorySubOption[]>,
  id: string
): string {
  for (const opt of options) {
    const subs = optionIdToSubOptions[opt.id] ?? opt.subOptions ?? [];
    const s = subs.find((x) => x.id === id);
    if (s) return s.name;
  }
  return id;
}

interface AddonConfigurationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AddonConfiguration | null;
  loading: boolean;
  error: string | null;
  categoryLabel: string;
  subCategoryLabel: string;
  accessoryOptions: AccessoryOption[];
  optionIdToSubOptions: Record<string, AccessorySubOption[]>;
}

function ImageStrip({ label, urls }: { label: string; urls: string[] }) {
  if (!urls.length) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <a
            key={`${url}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 overflow-hidden hover:opacity-90"
          >
            <img src={url} alt="" className="h-20 w-20 object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function AddonConfigurationDetailDialog({
  open,
  onOpenChange,
  config,
  loading,
  error,
  categoryLabel,
  subCategoryLabel,
  accessoryOptions,
  optionIdToSubOptions,
}: AddonConfigurationDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-3xl',
          'bg-white text-gray-900 border-gray-200'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">Configuration details</DialogTitle>
          <DialogDescription className="text-gray-600">
            Full read-only view of this add-on configuration.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="py-12 text-center text-sm text-gray-500">Loading details…</div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        )}

        {!loading && !error && config && (
          <div className="space-y-6 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
                <p className="mt-1 font-medium text-gray-900">{config.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                <p className="mt-1">
                  <span
                    className={cn(
                      'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full',
                      (config.status || '').toUpperCase() === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {config.status ?? '—'}
                  </span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</p>
                <p className="mt-1 font-mono text-xs text-gray-700 break-all">{config.id}</p>
              </div>
              {(config.createdAt || config.updatedAt) && (
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  {config.createdAt && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</p>
                      <p className="mt-1 text-gray-700">{new Date(config.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                  {config.updatedAt && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Updated</p>
                      <p className="mt-1 text-gray-700">{new Date(config.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Category</p>
              <div className="grid gap-2 sm:grid-cols-2 text-gray-800">
                <div>
                  <span className="text-gray-500">Parent: </span>
                  {categoryLabel}
                  {config.categoryId && (
                    <span className="block font-mono text-xs text-gray-500 mt-0.5">{config.categoryId}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500">Sub-category: </span>
                  {subCategoryLabel}
                  {config.subCategoryId && (
                    <span className="block font-mono text-xs text-gray-500 mt-0.5">{config.subCategoryId}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Images</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {config.fabricImageUrl && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Fabric</p>
                    <a
                      href={config.fabricImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={config.fabricImageUrl}
                        alt="Fabric"
                        className="h-32 w-full max-w-[200px] object-cover"
                      />
                    </a>
                  </div>
                )}
                {config.drawingImageUrl && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Drawing</p>
                    <a
                      href={config.drawingImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={config.drawingImageUrl}
                        alt="Drawing"
                        className="h-32 w-full max-w-[200px] object-cover"
                      />
                    </a>
                  </div>
                )}
              </div>
              <ImageStrip label="Design images" urls={config.designImageUrls ?? []} />
              <ImageStrip label="Hanging images" urls={config.hangingImageUrls ?? []} />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Accessories</p>
              {(config.accessories?.length ?? 0) === 0 ? (
                <p className="text-gray-500">None</p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-gray-800">
                  {config.accessories!.map((a) => (
                    <li key={a.accessoryOptionId}>
                      {accessoryDisplayName(accessoryOptions, a.accessoryOptionId)}
                      <span className="text-gray-500"> — {a.isRequired ? 'Required' : 'Optional'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected sub-options</p>
              {(config.selectedSubOptionIds?.length ?? 0) === 0 ? (
                <p className="text-gray-500">None</p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-gray-800">
                  {config.selectedSubOptionIds!.map((id) => (
                    <li key={id}>{subOptionDisplayName(accessoryOptions, optionIdToSubOptions, id)}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
