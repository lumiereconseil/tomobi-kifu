import { getStore } from "./db";
import { byPriority, recipients, type Recipient } from "./recipients";

/**
 * Recipients with recorded donations added on top of their listed starting totals, in
 * listing priority order (domestic disaster areas and welfare facilities first).
 */
export async function recipientsWithStats(): Promise<Recipient[]> {
  return (await withStats()).sort(byPriority);
}

async function withStats(): Promise<Recipient[]> {
  let stats: Awaited<ReturnType<ReturnType<typeof getStore>["statsByRecipient"]>>;
  try {
    stats = await getStore().statsByRecipient();
  } catch (err) {
    console.error("failed to load donation totals", err);
    return [...recipients];
  }
  return recipients.map((r) => {
    const s = stats.get(r.slug);
    return s ? { ...r, raisedJpy: r.raisedJpy + s.raisedJpy, supporters: r.supporters + s.supporters } : r;
  });
}
