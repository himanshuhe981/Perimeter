"use client";

import { useRouter, usePathname } from "next/navigation";
import { Select } from "antd";
import { FilterIcon } from "@/components/shared/icons";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
];

export function DashboardFilters({
  rangeDays,
  staffId,
  staff,
}: {
  rangeDays: number;
  staffId?: string;
  staff: { id: string; name: string | null; email: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams();
    params.set("range", String(rangeDays));
    if (staffId) params.set("staff", staffId);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span
        style={{ color: "var(--muted)", display: "flex", flexShrink: 0 }}
      >
        <FilterIcon size={15} />
      </span>
      <Select
        value={String(rangeDays)}
        className="flex-1 sm:flex-none"
        style={{ minWidth: 0, width: undefined }}
        popupMatchSelectWidth={false}
        options={RANGE_OPTIONS}
        onChange={(value) => updateParam("range", value)}
      />
      <Select
        value={staffId ?? "all"}
        className="flex-1 sm:flex-none"
        style={{ minWidth: 0, width: undefined }}
        popupMatchSelectWidth={false}
        options={[
          { value: "all", label: "All staff" },
          ...staff.map((s) => ({
            value: s.id,
            label: s.name ?? s.email,
          })),
        ]}
        onChange={(value) =>
          updateParam("staff", value === "all" ? undefined : value)
        }
      />
    </div>
  );
}
