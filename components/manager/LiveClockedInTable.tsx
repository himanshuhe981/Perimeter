"use client";

import { Table } from "antd";

type ClockedInShift = {
  id: string;
  clockInAt: Date;
  clockInLat: number;
  clockInLng: number;
  user: { name: string | null; email: string };
};

export function LiveClockedInTable({ shifts }: { shifts: ClockedInShift[] }) {
  return (
    <Table<ClockedInShift>
      rowKey="id"
      dataSource={shifts}
      pagination={false}
      scroll={{ x: true }}
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
          render: (v: Date) => v.toLocaleString(),
        },
        {
          title: "Location",
          key: "location",
          render: (_, s) =>
            `${s.clockInLat.toFixed(4)}, ${s.clockInLng.toFixed(4)}`,
        },
      ]}
    />
  );
}
