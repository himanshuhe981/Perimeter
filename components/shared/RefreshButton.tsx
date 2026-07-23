"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { RefreshIcon } from "@/components/shared/icons";
import { IconButton } from "@/components/shared/IconButton";

export function RefreshButton({
  label = "Refresh",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const onClick = () => startTransition(() => router.refresh());

  if (compact) {
    return (
      <IconButton label={label} onClick={onClick}>
        <RefreshIcon spin={isPending} />
      </IconButton>
    );
  }

  return (
    <Button
      size="small"
      icon={<RefreshIcon spin={isPending} />}
      loading={isPending}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
