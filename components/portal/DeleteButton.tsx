'use client';

export function DeleteButton({
  label,
  confirmMessage,
  endpoint,
  body,
  redirectTo,
}: {
  label: string;
  confirmMessage: string;
  endpoint: string;
  body: Record<string, unknown>;
  redirectTo: string;
}) {
  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      window.location.href = redirectTo;
    } else {
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border border-red-300 px-6 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
    >
      {label}
    </button>
  );
}
