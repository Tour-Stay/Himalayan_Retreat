export const StatusBadge = ({ status, type = 'booking', dueDate = null, reason = '' }) => {
  const normalized = String(status ?? '').toLowerCase();

  let styles = 'bg-[#F5EFE6] text-[#5C5350] border-[#C5A059]/40';

  if (type === 'booking') {
    switch (normalized) {
      case 'confirmed':
        styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        break;
      case 'pending':
        styles = 'bg-amber-50 text-amber-800 border-amber-300';
        break;
      case 'completed':
        styles = 'bg-sky-50 text-sky-800 border-sky-300';
        break;
      case 'cancelled':
        styles = 'bg-rose-50 text-rose-800 border-rose-300';
        break;
      default:
        styles = 'bg-[#F5EFE6] text-[#5C5350] border-[#C5A059]/40';
    }
  } else if (type === 'payment') {
    switch (normalized) {
      case 'paid':
        styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        break;
      case 'pending':
        styles = 'bg-amber-50 text-amber-800 border-amber-300';
        break;
      case 'refunded':
        styles = 'bg-purple-50 text-purple-800 border-purple-300';
        break;
      case 'failed':
        styles = 'bg-rose-50 text-rose-800 border-rose-300';
        break;
      default:
        styles = 'bg-[#F5EFE6] text-[#5C5350] border-[#C5A059]/40';
    }
  } else if (type === 'availability') {
    if (status === true || normalized === 'true' || normalized === 'available' || normalized === 'active') {
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    } else {
      styles = 'bg-amber-50 text-amber-900 border-amber-300';
    }
  } else if (type === 'review') {
    if (status === true || normalized === 'true' || normalized === 'approved') {
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    } else {
      styles = 'bg-amber-50 text-amber-800 border-amber-300';
    }
  }

  let formattedDueDate = '';
  if (dueDate) {
    try {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) {
        formattedDueDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch (e) {
      formattedDueDate = String(dueDate);
    }
  }

  const label =
    type === 'availability'
      ? status === true || normalized === 'true'
        ? 'Active / Available'
        : formattedDueDate
        ? `Unavailable (Till ${formattedDueDate})`
        : 'Unavailable / Sold Out'
      : type === 'review'
      ? status === true || normalized === 'true'
        ? 'Approved'
        : 'Pending Approval'
      : (status || 'Unknown');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-cinzel font-semibold tracking-wider border uppercase shadow-2xs whitespace-nowrap ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
