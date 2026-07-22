type Shift = {
  id: string;
  user: { name: string | null; email: string };
  clockInAt: Date;
  clockInLat: number;
  clockInLng: number;
  clockInNote: string | null;
  clockOutAt: Date | null;
  clockOutLat: number | null;
  clockOutLng: number | null;
  clockOutNote: string | null;
};

export function StaffHistoryTable({ shifts }: { shifts: Shift[] }) {
  if (shifts.length === 0) {
    return <p className="text-sm text-zinc-500">No shifts recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/10">
            <th className="py-2 pr-4">Staff</th>
            <th className="py-2 pr-4">Clock in</th>
            <th className="py-2 pr-4">Clock out</th>
            <th className="py-2 pr-4">Notes</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr
              key={s.id}
              className="border-b border-black/5 align-top dark:border-white/5"
            >
              <td className="py-2 pr-4">{s.user.name ?? s.user.email}</td>
              <td className="py-2 pr-4">
                {s.clockInAt.toLocaleString()}
                <br />
                <span className="text-zinc-500">
                  {s.clockInLat.toFixed(4)}, {s.clockInLng.toFixed(4)}
                </span>
              </td>
              <td className="py-2 pr-4">
                {s.clockOutAt ? (
                  <>
                    {s.clockOutAt.toLocaleString()}
                    <br />
                    <span className="text-zinc-500">
                      {s.clockOutLat?.toFixed(4)}, {s.clockOutLng?.toFixed(4)}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-500">Still clocked in</span>
                )}
              </td>
              <td className="py-2 pr-4 text-zinc-500">
                {[s.clockInNote, s.clockOutNote].filter(Boolean).join(" / ") ||
                  "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
