// Las fechas de estreno se guardan a medianoche UTC: formatear en UTC evita que en Argentina
// (UTC-3) se muestre el dia anterior.
const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function formatYear(isoDate: string): number {
  return new Date(isoDate).getUTCFullYear();
}

export function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
