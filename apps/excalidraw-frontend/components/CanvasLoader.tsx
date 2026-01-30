export const CanvasLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(222,47%,11%)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(174,72%,56%)] border-t-transparent" />
        <p className="text-sm text-[hsl(215,20%,65%)]">
          Preparing canvas…
        </p>
      </div>
    </div>
  );
};
