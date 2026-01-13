export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h2 className="text-red-800 font-bold text-lg mb-2">Error</h2>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
}

