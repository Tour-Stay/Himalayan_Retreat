/**
 * ===============================================================
 * THE KASAR HIMALAYAN HEIGHTS & EXPEDITIONS — BACKEND PRICING ENGINE
 * ===============================================================
 * Authoritative server-side calculation for room tariffs and cab fares.
 * Prevents client-side price tampering before saving to MongoDB.
 */

/**
 * Calculates authoritative room stay tariff based on base rate and seasonal rules.
 * @param {number} basePricePerNight Base room price per night
 * @param {string|Date} checkInDate Check-in date
 * @param {string|Date} checkOutDate Check-out date
 * @param {object} pricingRules Pricing rules from SiteSettings
 * @returns {object} { totalAmount, nights }
 */
function calculateStayTariff(basePricePerNight, checkInDate, checkOutDate, pricingRules = {}) {
  const basePrice = Number(basePricePerNight) || 0;
  if (!checkInDate || !checkOutDate || basePrice <= 0) {
    return { totalAmount: 0, nights: 0 };
  }

  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = d2.getTime() - d1.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const weekendPercent = Number(pricingRules?.weekendSurchargePercent) || 0;
  const seasonalRules = Array.isArray(pricingRules?.seasonalRules) ? pricingRules.seasonalRules : [];

  let totalAmount = 0;
  const currentDate = new Date(d1);

  for (let i = 0; i < nights; i++) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

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
        // Crosses year boundary (e.g. 12-20 to 01-10)
        inWindow = curMMDD >= start || curMMDD <= end;
      }

      if (inWindow) {
        matchedSeason = rule;
        break;
      }
    }

    let surchargePercent = 0;
    if (matchedSeason) {
      surchargePercent = Number(matchedSeason.multiplierPercent) || 0;
    } else if (isWeekend && weekendPercent > 0) {
      surchargePercent = weekendPercent;
    }

    const nightRate = Math.round(basePrice * (1 + surchargePercent / 100));
    totalAmount += nightRate;

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { totalAmount, nights };
}

/**
 * Calculates authoritative cab fare based on distance, vehicle fleet rates, and driver batta.
 * @param {object} bookingData { vehicleType, circuit, tripDays, travelers }
 * @param {object} siteSettings Full SiteSettings document
 * @returns {number} Authoritative calculated fare
 */
function calculateCabFare({ vehicleType = '6-seater', circuit = '', tripDays = 1, travelers = 2 } = {}, siteSettings = {}) {
  const days = Math.max(1, parseInt(tripDays, 10) || 1);
  const fleetList = siteSettings?.cabFleet || [];

  // Match vehicle from fleet settings
  const matchedFleet = fleetList.find(
    (f) =>
      f.id === vehicleType ||
      f.model?.toLowerCase() === vehicleType?.toLowerCase() ||
      f.title?.toLowerCase().includes(vehicleType?.toLowerCase())
  );

  let perKmRate = matchedFleet?.perKmRate;
  if (!perKmRate) {
    if (vehicleType?.includes('4-seater') || vehicleType?.includes('sedan')) perKmRate = 14;
    else if (vehicleType?.includes('12-seater') || vehicleType?.includes('urbania')) perKmRate = 32;
    else perKmRate = 20; // 6-seater / Innova default
  }

  // Extract or infer distance from circuit string (e.g. "Kainchi Dham (45 km, ...)")
  let km = 45;
  const kmMatch = circuit.match(/(\d+)\s*km/i);
  if (kmMatch && kmMatch[1]) {
    km = parseInt(kmMatch[1], 10);
  } else if (siteSettings?.destinations) {
    const dest = siteSettings.destinations.find((d) =>
      circuit.toLowerCase().includes(d.name?.toLowerCase())
    );
    if (dest?.kmFromAlmora) km = dest.kmFromAlmora;
  }

  // Billable km logic
  const isRoundTrip = days > 1 || circuit.toLowerCase().includes('round');
  let billableDistance = 0;

  if (isRoundTrip) {
    billableDistance = Math.max(km * 2, 150 * days);
  } else {
    if (km <= 25) billableDistance = Math.max(km, 25);
    else if (km <= 95) billableDistance = Math.round(km * 1.5);
    else billableDistance = Math.round(km * 1.7);
  }

  const distanceFare = billableDistance * perKmRate;

  // Driver allowances
  const tp = siteSettings?.travelPolicies;
  const driverDailyAllowance = tp?.driverAllowancePerDay !== undefined ? Number(tp.driverAllowancePerDay) : 500;
  const driverShortTripAllowance = tp?.driverShortTripAllowance !== undefined ? Number(tp.driverShortTripAllowance) : 250;
  const driverLongDayDropAllowance = tp?.driverLongDayDropAllowance !== undefined ? Number(tp.driverLongDayDropAllowance) : 450;
  const driverNightHaltCharge = tp?.driverNightHaltCharge !== undefined ? Number(tp.driverNightHaltCharge) : 300;

  let driverBatta = 0;
  if (isRoundTrip) {
    const nights = Math.max(0, days - 1);
    driverBatta = driverDailyAllowance * days + nights * driverNightHaltCharge;
  } else {
    driverBatta = km > 70 ? driverLongDayDropAllowance : driverShortTripAllowance;
  }

  const calculatedTotal = Math.round(distanceFare + driverBatta);
  return Math.max(calculatedTotal, 1200); // Minimum safe mountain transfer fare floor
}

module.exports = {
  calculateStayTariff,
  calculateCabFare,
};
