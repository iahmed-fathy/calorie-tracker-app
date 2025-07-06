export function formatDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toLocaleDateString("en-CA");
}
