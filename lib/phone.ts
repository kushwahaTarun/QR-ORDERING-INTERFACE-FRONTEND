export function indianDigits(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 10) return digits;
  return "";
}

export function formatIndianMobile(raw: string) {
  const digits = indianDigits(raw);
  if (!digits) return raw.trim();
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function telHref(raw: string) {
  const digits = indianDigits(raw);
  return digits ? `tel:+91${digits}` : null;
}

export function whatsappHref(raw: string, text?: string) {
  const digits = indianDigits(raw);
  if (!digits) return null;
  const url = `https://wa.me/91${digits}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}

export function guestInitials(name: string, mobile: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase();
  if (parts[0]) return `${parts[0][0]}${parts[0][0]}`.toUpperCase();
  const digits = indianDigits(mobile);
  return digits ? digits.slice(-2) : "G";
}
