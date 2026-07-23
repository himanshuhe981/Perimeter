"use client";

import { Table } from "antd";
import Text from "antd/es/typography/Text";
import { formatDateTime } from "@/lib/formatDate";

type Shift = {
  id: string;
  clockInAt: Date;
  clockInNote: string | null;
  clockOutAt: Date | null;
  clockOutNote: string | null;
};

function StatusPill({ done }: { done: boolean }) {
  return (
    <span
      className="pm-pill"
      style={
        done
          ? { background: "var(--surface-2)", color: "var(--muted)" }
          : { background: "var(--green-soft)", color: "var(--green)" }
      }
    >
      {done ? "Completed" : "In progress"}
    </span>
  );
}

export function MyHistoryTable({ shifts }: { shifts: Shift[] }) {
  return (
    <Table<Shift>
      rowKey="id"
      dataSource={shifts}
      scroll={{ x: true }}
      pagination={{ pageSize: 8 }}
      size="small"
      columns={[
        {
          title: "Status",
          key: "status",
          render: (_, s) => <StatusPill done={Boolean(s.clockOutAt)} />,
        },
        {
          title: "Clock in",
          dataIndex: "clockInAt",
          key: "clockInAt",
          sorter: (a, b) => a.clockInAt.getTime() - b.clockInAt.getTime(),
          defaultSortOrder: "descend",
          render: (v: Date) => formatDateTime(v),
        },
        {
          title: "Clock out",
          key: "clockOut",
          render: (_, s) =>
            s.clockOutAt ? formatDateTime(s.clockOutAt) : <Text type="secondary">—</Text>,
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
