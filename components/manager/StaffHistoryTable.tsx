"use client";

import { Table } from "antd";
import Text from "antd/es/typography/Text";

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
  return (
    <Table<Shift>
      rowKey="id"
      dataSource={shifts}
      scroll={{ x: true }}
      pagination={{ pageSize: 10 }}
      columns={[
        {
          title: "Staff",
          key: "staff",
          render: (_, s) => s.user.name ?? s.user.email,
        },
        {
          title: "Clock in",
          dataIndex: "clockInAt",
          key: "clockInAt",
          sorter: (a, b) => a.clockInAt.getTime() - b.clockInAt.getTime(),
          defaultSortOrder: "descend",
          render: (_, s) => (
            <>
              {s.clockInAt.toLocaleString()}
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {s.clockInLat.toFixed(4)}, {s.clockInLng.toFixed(4)}
              </Text>
            </>
          ),
        },
        {
          title: "Clock out",
          key: "clockOut",
          render: (_, s) =>
            s.clockOutAt ? (
              <>
                {s.clockOutAt.toLocaleString()}
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {s.clockOutLat?.toFixed(4)}, {s.clockOutLng?.toFixed(4)}
                </Text>
              </>
            ) : (
              <Text type="secondary">Still clocked in</Text>
            ),
        },
        {
          title: "Notes",
          key: "notes",
          render: (_, s) => (
            <Text type="secondary">
              {[s.clockInNote, s.clockOutNote].filter(Boolean).join(" / ") ||
                "—"}
            </Text>
          ),
        },
      ]}
    />
  );
}
