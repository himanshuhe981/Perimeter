"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Flex } from "antd";
import TextArea from "antd/es/input/TextArea";
import Text from "antd/es/typography/Text";
import { useGeolocation } from "@/hooks/useGeolocation";
import { graphqlFetch } from "@/lib/graphqlFetch";
import { isWithinPerimeter } from "@/lib/geo";

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
      style={{ width: "100%", maxWidth: 384 }}
      extra={
        <Button
          type="text"
          size="small"
          loading={isRefreshing}
          onClick={() => startRefresh(() => router.refresh())}
        >
          Refresh
        </Button>
      }
      title="Status"
    >
      <Flex vertical gap="middle">
        {!perimeter && (
          <Alert
            type="warning"
            showIcon
            message="No perimeter has been configured by a manager yet — clock-in is disabled."
          />
        )}

        <Button loading={geoLoading} onClick={requestLocation}>
          {geoLoading ? "Getting location..." : "Check my location"}
        </Button>

        {geoError && <Alert type="error" showIcon message={geoError} />}

        {coords && perimeter && (
          <Alert
            type={withinPerimeter ? "success" : "warning"}
            showIcon
            message={
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

        {formError && <Alert type="error" showIcon message={formError} />}

        {isClockedIn ? (
          <Button
            type="primary"
            danger
            disabled={!coords}
            loading={submitting}
            onClick={() => handleSubmit(CLOCK_OUT_MUTATION)}
          >
            Clock out
          </Button>
        ) : (
          <Button
            type="primary"
            disabled={!coords || !withinPerimeter}
            loading={submitting}
            onClick={() => handleSubmit(CLOCK_IN_MUTATION)}
          >
            Clock in
          </Button>
        )}

        {initialActiveShift && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Clocked in at{" "}
            {new Date(initialActiveShift.clockInAt).toLocaleString()}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
