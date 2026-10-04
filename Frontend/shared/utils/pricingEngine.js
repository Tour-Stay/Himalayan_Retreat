/**
 * ===============================================================
 * THE KASAR HIMALAYAN HEIGHTS — YIELD & DYNAMIC PRICING ENGINE
 * ===============================================================
 * Automatically computes seasonal tariffs, snowfall multipliers,
 * and weekend surcharges across public hotel rooms and admin bookings.
 */

export function calculateStayTariff(basePricePerNight, checkInDate, checkOutDate, pricingRules = {}) {
  const basePrice = Number(basePricePerNight) || 0;
  if (!checkInDate || !checkOutDate || basePrice <= 0) {
    return {
      totalAmount: 0,
      avgPricePerNight: basePrice,
      nights: 0,
      hasSurcharge: false,
      activeSurchargeReason: '',
      breakdown: [],
    };
  }

  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = d2.getTime() - d1.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const weekendPercent = Number(pricingRules?.weekendSurchargePercent) || 0;
  const seasonalRules = Array.isArray(pricingRules?.seasonalRules) ? pricingRules.seasonalRules : [];

  let totalAmount = 0;
  const breakdown = [];
  let elevatedNightsCount = 0;
  let primaryReason = '';

  const currentDate = new Date(d1);

  for (let i = 0; i < nights; i++) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    // Check seasonal rule by MM-DD
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const curMMDD = `${mm}-${dd}`;

    let matchedSeason = null;
    for (const rule of seasonalRules) {
      if (rule.isActive === false) continue;
      const start = rule.startDate;
      const end = rule.endDate;

      if (!start || !end) continue;

      let inWindow = false;
      if (start <= end) {
        inWindow = curMMDD >= start && curMMDD <= end;
      } else {
        // Crosses year boundary (e.g. 12-15 to 01-15)
        inWindow = curMMDD >= start || curMMDD <= end;
      }

      if (inWindow) {
        matchedSeason = rule;
        break;
      }
    }

    let surchargePercent = 0;
    let reason = 'Standard Base Rate';

    if (matchedSeason) {
      surchargePercent = Number(matchedSeason.multiplierPercent) || 0;
      reason = `${matchedSeason.title} (+${surchargePercent}%)`;
      if (!primaryReason) primaryReason = reason;
      elevatedNightsCount++;
    } else if (isWeekend && weekendPercent > 0) {
      surchargePercent = weekendPercent;
      reason = `Weekend Tariff (+${weekendPercent}%)`;
      if (!primaryReason) primaryReason = reason;
      elevatedNightsCount++;
    }

    const nightRate = Math.round(basePrice * (1 + surchargePercent / 100));
    totalAmount += nightRate;

    breakdown.push({
      date: new Date(currentDate).toISOString().split('T')[0],
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
      baseRate: basePrice,
      surchargePercent,
      appliedRate: nightRate,
      reason,
    });

    // Advance to next night
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const avgPricePerNight = Math.round(totalAmount / nights);

  return {
    totalAmount,
    avgPricePerNight,
    nights,
    hasSurcharge: elevatedNightsCount > 0,
    activeSurchargeReason: primaryReason,
    breakdown,
  };
}
