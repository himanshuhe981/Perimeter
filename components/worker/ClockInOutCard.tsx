"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
      {!perimeter && (
        <p className="text-sm text-amber-600">
          No perimeter has been configured by a manager yet — clock-in is
          disabled.
        </p>
      )}

      <button
        type="button"
        onClick={requestLocation}
        disabled={geoLoading}
        className="rounded-full border border-black/20 px-4 py-2 text-sm disabled:opacity-50 dark:border-white/20"
      >
        {geoLoading ? "Getting location..." : "Check my location"}
      </button>

      {geoError && <p className="text-sm text-red-600">{geoError}</p>}

      {coords && perimeter && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {withinPerimeter
            ? `You're inside the ${perimeter.label} perimeter.`
            : `You're outside the ${perimeter.label} perimeter — you can't clock in from here.`}
        </p>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note"
        rows={2}
        className="rounded-lg border border-black/10 p-2 text-sm dark:border-white/10 dark:bg-black"
      />

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      {isClockedIn ? (
        <button
          type="button"
          onClick={() => handleSubmit(CLOCK_OUT_MUTATION)}
          disabled={!coords || submitting}
          className="rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? "Clocking out..." : "Clock out"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleSubmit(CLOCK_IN_MUTATION)}
          disabled={!coords || !withinPerimeter || submitting}
          className="rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? "Clocking in..." : "Clock in"}
        </button>
      )}
    </div>
  );
}
