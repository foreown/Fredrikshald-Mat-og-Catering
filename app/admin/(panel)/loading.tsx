import { Spinner } from '@/components/ui/Spinner';

export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="flex items-center gap-3 text-sm text-ink-muted">
        <Spinner className="h-5 w-5 text-pine" />
        Laster …
      </span>
    </div>
  );
}
