type ClockedInShift = {
  id: string;
  clockInAt: Date;
  clockInLat: number;
  clockInLng: number;
  user: { name: string | null; email: string };
};

export function LiveClockedInTable({ shifts }: { shifts: ClockedInShift[] }) {
  if (shifts.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No one is currently clocked in.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/10">
            <th className="py-2 pr-4">Staff</th>
            <th className="py-2 pr-4">Clocked in at</th>
            <th className="py-2 pr-4">Location</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr
              key={s.id}
              className="border-b border-black/5 dark:border-white/5"
            >
              <td className="py-2 pr-4">{s.user.name ?? s.user.email}</td>
              <td className="py-2 pr-4">{s.clockInAt.toLocaleString()}</td>
              <td className="py-2 pr-4">
                {s.clockInLat.toFixed(4)}, {s.clockInLng.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
