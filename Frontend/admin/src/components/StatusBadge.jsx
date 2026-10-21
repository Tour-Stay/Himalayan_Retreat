export const StatusBadge = ({ status, type = 'booking', dueDate = null, reason = '' }) => {
  const normalized = String(status ?? '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-300';

  if (type === 'booking') {
    switch (normalized) {
      case 'confirmed':
        styles = 'bg-emerald-50 text-emerald-800 border-emerald-400';
        break;
      case 'checked_in':
        styles = 'bg-teal-50 text-teal-800 border-teal-400';
        break;
      case 'checked_out':
        styles = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
      case 'pending':
        styles = 'bg-amber-50 text-amber-800 border-amber-400';
        break;
      case 'completed':
        styles = 'bg-blue-50 text-blue-800 border-blue-400';
        break;
      case 'cancelled':
        styles = 'bg-rose-50 text-rose-800 border-rose-400';
        break;
      default:
        styles = 'bg-slate-100 text-slate-700 border-slate-300';
    }
  } else if (type === 'payment') {
    switch (normalized) {
      case 'paid':
        styles = 'bg-emerald-50 text-emerald-800 border-emerald-400';
        break;
      case 'pending':
        styles = 'bg-amber-50 text-amber-800 border-amber-400';
        break;
      case 'refunded':
        styles = 'bg-purple-50 text-purple-800 border-purple-400';
        break;
      case 'failed':
        styles = 'bg-rose-50 text-rose-800 border-rose-400';
        break;
      default:
        styles = 'bg-slate-100 text-slate-700 border-slate-300';
    }
  } else if (type === 'availability') {
    if (status === true || normalized === 'true' || normalized === 'available' || normalized === 'active') {
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-400';
    } else {
      styles = 'bg-amber-50 text-amber-900 border-amber-400';
    }
  } else if (type === 'review') {
    if (status === true || normalized === 'true' || normalized === 'approved') {
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-400';
    } else {
      styles = 'bg-amber-50 text-amber-800 border-amber-400';
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
        ? 'Active / Open'
        : formattedDueDate
        ? `Blocked (Till ${formattedDueDate})`
        : 'Unavailable'
      : type === 'review'
      ? status === true || normalized === 'true'
        ? 'Approved'
        : 'Pending Approval'
      : (status || 'Unknown');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-cinzel font-bold tracking-wider uppercase border whitespace-nowrap shadow-2xs ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
