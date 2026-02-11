export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
