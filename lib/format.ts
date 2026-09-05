export function inr(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function inrExact(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${iso}T12:00:00+05:30`));
}

export function formatWeekday(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(new Date(`${isoDate}T12:00:00+05:30`));
}

export function formatHourClock(hour: number) {
  const period = hour >= 12 ? "pm" : "am";
  const h = hour % 12 || 12;
  return `${h} ${period}`;
}

export function isKolkataToday(isoDate: string) {
  return isoDate === kolkataDayKey(new Date().toISOString());
}

function kolkataDayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function shiftDayKey(yyyyMmDd: string, days: number) {
  const [year, month, day] = yyyyMmDd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  const nextYear = utc.getUTCFullYear();
  const nextMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(utc.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function formatVisit(iso: string) {
  const time = formatTime(iso);
  const visitDay = kolkataDayKey(iso);
  const today = kolkataDayKey(new Date().toISOString());
  if (visitDay === today) return `Today, ${time}`;
  if (visitDay === shiftDayKey(today, -1)) return `Yesterday, ${time}`;
  const date = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
  return `${date}, ${time}`;
}

export function gstPercent(rate: number) {
  return Math.round(rate * 1000) / 10;
}
