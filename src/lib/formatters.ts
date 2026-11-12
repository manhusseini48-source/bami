/**
 * Format numbers with thousand separators
 */
export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '۰';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency in USD with $ prefix
 */
export function formatUSD(amount: number, decimals: number = 0): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(decimals > 0 ? decimals : 1)}M`;
  }
  if (amount >= 10_000) {
    return `$${new Intl.NumberFormat('en-US').format(amount)}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: 3 })}`;
}

/**
 * Format share price in USD (supports fractions like $0.010, $0.025, $15.00)
 */
export function formatSharePrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) return '$0.00';
  if (price < 0.1) {
    return `$${price.toFixed(3)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate remaining time until target date (years, months, days)
 */
export function getRemainingTime(
  targetDateStr?: string,
  status?: string
): {
  text: string;
  isPast: boolean;
  years: number;
  months: number;
  days: number;
  formattedDate: string;
} {
  if (status === 'completed') {
    return {
      text: 'تکمیل شده',
      isPast: true,
      years: 0,
      months: 0,
      days: 0,
      formattedDate: targetDateStr || 'تکمیل شده',
    };
  }

  if (!targetDateStr) {
    return {
      text: 'در حال برنامه‌ریزی',
      isPast: false,
      years: 0,
      months: 0,
      days: 0,
      formattedDate: '-',
    };
  }

  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) {
    return {
      text: targetDateStr,
      isPast: false,
      years: 0,
      months: 0,
      days: 0,
      formattedDate: targetDateStr,
    };
  }

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  const formattedDate = target.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (diffMs <= 0) {
    return {
      text: 'موعد فرارسیده',
      isPast: true,
      years: 0,
      months: 0,
      days: 0,
      formattedDate,
    };
  }

  // Calculate years, months, days
  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  let days = target.getDate() - now.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} سال`);
  if (months > 0) parts.push(`${months} ماه`);
  if (days > 0 || parts.length === 0) parts.push(`${days} روز`);

  return {
    text: `${parts.join(' و ')} مانده`,
    isPast: false,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    formattedDate,
  };
}
