export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-4 h-8 w-12 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="h-32 rounded-2xl border border-slate-200 bg-white" />
      <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}
