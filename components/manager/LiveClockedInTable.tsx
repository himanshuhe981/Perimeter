"use client";

import { Table } from "antd";
import { formatDateTime } from "@/lib/formatDate";

type ClockedInShift = {
  id: string;
  clockInAt: Date;
  clockInLat: number;
  clockInLng: number;
  user: { name: string | null; email: string };
};

export function LiveClockedInTable({
  shifts,
  compact = false,
}: {
  shifts: ClockedInShift[];
  compact?: boolean;
}) {
  return (
    <Table<ClockedInShift>
      rowKey="id"
      dataSource={shifts}
      pagination={false}
      scroll={{ x: true }}
      size={compact ? "small" : "middle"}
      columns={[
        {
          title: "Staff",
          key: "staff",
          render: (_, s) => s.user.name ?? s.user.email,
        },
        {
          title: "Clocked in at",
          dataIndex: "clockInAt",
          key: "clockInAt",
          sorter: (a, b) => a.clockInAt.getTime() - b.clockInAt.getTime(),
          render: (v: Date) => formatDateTime(v),
        },
        {
          title: "Status",
          key: "status",
          render: () => (
            <span
              className="pm-pill"
              style={{ background: "var(--green-soft)", color: "var(--green)" }}
            >
              Active
            </span>
          ),
        },
        ...(compact
          ? []
          : [
              {
                title: "Location",
                key: "location",
                render: (_: unknown, s: ClockedInShift) =>
                  `${s.clockInLat.toFixed(4)}, ${s.clockInLng.toFixed(4)}`,
              },
            ]),
      ]}
    />
  );
}
