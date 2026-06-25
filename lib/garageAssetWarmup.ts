export async function warmGarageResources({
  signal,
}: {
  signal: AbortSignal;
}) {
  if (signal.aborted) return;

  await import("@/components/MCarShowcase");
}
