const MAP = {
  Diajukan:  { cls: "badge-pending",  icon: "📝" },
  Diproses:  { cls: "badge-process",  icon: "⏳" },
  Disetujui: { cls: "badge-approved", icon: "✅" },
  Ditolak:   { cls: "badge-rejected", icon: "❌" },
  Selesai:   { cls: "badge-done",     icon: "🎉" },
};

export default function StatusBadge({ status }) {
  const m = MAP[status] || { cls: "badge-pending", icon: "•" };
  return (
    <span className={`badge ${m.cls}`}>
      <span>{m.icon}</span> {status}
    </span>
  );
}
