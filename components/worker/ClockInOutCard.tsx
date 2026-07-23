"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Flex } from "antd";
import TextArea from "antd/es/input/TextArea";
import Text from "antd/es/typography/Text";
import { useGeolocation } from "@/hooks/useGeolocation";
import { graphqlFetch } from "@/lib/graphqlFetch";
import { isWithinPerimeter } from "@/lib/geo";
import { formatDateTime } from "@/lib/formatDate";
import { IconButton } from "@/components/shared/IconButton";
import { RefreshIcon, LocationIcon, ClockIcon } from "@/components/shared/icons";

type Perimeter = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
} | null;

type ActiveShift = {
  id: string;
  clockInAt: string;
} | null;

const CLOCK_IN_MUTATION = /* GraphQL */ `
  mutation ClockIn($lat: Float!, $lng: Float!, $note: String) {
    clockIn(lat: $lat, lng: $lng, note: $note) {
      id
    }
  }
`;

const CLOCK_OUT_MUTATION = /* GraphQL */ `
  mutation ClockOut($lat: Float!, $lng: Float!, $note: String) {
    clockOut(lat: $lat, lng: $lng, note: $note) {
      id
    }
  }
`;

function useElapsed(since: string | null) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!since) {
      setLabel("");
      return;
    }
    const start = new Date(since).getTime();
    function tick() {
      const mins = Math.max(0, Math.floor((Date.now() - start) / 60000));
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      setLabel(h > 0 ? `${h}h ${m}m` : `${m}m`);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [since]);

  return label;
}

export function ClockInOutCard({
  initialActiveShift,
  perimeter,
}: {
  initialActiveShift: ActiveShift;
  perimeter: Perimeter;
}) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const {
    coords,
    error: geoError,
    loading: geoLoading,
    requestLocation,
  } = useGeolocation();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isClockedIn = Boolean(initialActiveShift);
  const elapsed = useElapsed(initialActiveShift?.clockInAt ?? null);

  const withinPerimeter =
    coords && perimeter ? isWithinPerimeter(coords, perimeter) : null;

  async function handleSubmit(mutation: string) {
    if (!coords) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await graphqlFetch(mutation, {
        lat: coords.lat,
        lng: coords.lng,
        note: note || null,
      });
      setNote("");
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      style={{ width: "100%" }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        className={isClockedIn ? "pm-gradient-lime" : undefined}
        style={{
          padding: "22px 24px",
          borderRadius: "18px 18px 0 0",
          background: isClockedIn ? undefined : "var(--surface-2)",
        }}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={10}>
            <div>
              <Text
                strong
                style={{
                  fontSize: 16,
                  color: isClockedIn ? "inherit" : "var(--foreground)",
                }}
              >
                {isClockedIn ? "Clocked in" : "Not clocked in"}
              </Text>
              {isClockedIn && (
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {elapsed ? `${elapsed} ago` : "Just now"} · since{" "}
                  {formatDateTime(new Date(initialActiveShift!.clockInAt))}
                </div>
              )}
            </div>
          </Flex>
          <IconButton
            label="Refresh"
            onClick={() => startRefresh(() => router.refresh())}
          >
            <RefreshIcon spin={isRefreshing} />
          </IconButton>
        </Flex>
      </div>

      <Flex vertical gap={16} style={{ padding: 24 }}>
        {!perimeter && (
          <Alert
            type="warning"
            showIcon
            title="No perimeter has been configured by a manager yet — clock-in is disabled."
          />
        )}

        <Button
          icon={<LocationIcon size={16} />}
          loading={geoLoading}
          onClick={requestLocation}
        >
          {geoLoading ? "Getting location..." : "Check my location"}
        </Button>

        {geoError && <Alert type="error" showIcon title={geoError} />}

        {coords && perimeter && (
          <Alert
            type={withinPerimeter ? "success" : "warning"}
            showIcon
            title={
              withinPerimeter
                ? `You're inside the ${perimeter.label} perimeter.`
                : `You're outside the ${perimeter.label} perimeter — you can't clock in from here.`
            }
          />
        )}

        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          rows={2}
        />

        {formError && <Alert type="error" showIcon title={formError} />}

        {isClockedIn ? (
          <Button
            type="primary"
            danger
            size="large"
            disabled={!coords}
            loading={submitting}
            onClick={() => handleSubmit(CLOCK_OUT_MUTATION)}
          >
            Clock out
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            disabled={!coords || !withinPerimeter}
            loading={submitting}
            onClick={() => handleSubmit(CLOCK_IN_MUTATION)}
          >
            Clock in
          </Button>
        )}
      </Flex>
    </Card>
  );
}
