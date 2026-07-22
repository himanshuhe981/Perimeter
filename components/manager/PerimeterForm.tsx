"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { graphqlFetch } from "@/lib/graphqlFetch";

type Perimeter = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
} | null;

const SET_PERIMETER_MUTATION = /* GraphQL */ `
  mutation SetPerimeter(
    $label: String!
    $latitude: Float!
    $longitude: Float!
    $radiusMeters: Int!
  ) {
    setPerimeter(
      label: $label
      latitude: $latitude
      longitude: $longitude
      radiusMeters: $radiusMeters
    ) {
      id
    }
  }
`;

export function PerimeterForm({
  currentPerimeter,
}: {
  currentPerimeter: Perimeter;
}) {
  const router = useRouter();
  const [label, setLabel] = useState(currentPerimeter?.label ?? "");
  const [latitude, setLatitude] = useState(
    currentPerimeter?.latitude.toString() ?? "",
  );
  const [longitude, setLongitude] = useState(
    currentPerimeter?.longitude.toString() ?? "",
  );
  const [radiusKm, setRadiusKm] = useState(
    currentPerimeter ? (currentPerimeter.radiusMeters / 1000).toString() : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await graphqlFetch(SET_PERIMETER_MUTATION, {
        label,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radiusMeters: Math.round(parseFloat(radiusKm) * 1000),
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10"
    >
      {currentPerimeter && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Current: {currentPerimeter.label} —{" "}
          {(currentPerimeter.radiusMeters / 1000).toFixed(1)}km radius
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Label
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="rounded-lg border border-black/10 p-2 dark:border-white/10 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Radius (km)
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            required
            className="rounded-lg border border-black/10 p-2 dark:border-white/10 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Latitude
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="rounded-lg border border-black/10 p-2 dark:border-white/10 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Longitude
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="rounded-lg border border-black/10 p-2 dark:border-white/10 dark:bg-black"
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {submitting
          ? "Saving..."
          : currentPerimeter
            ? "Update perimeter"
            : "Set perimeter"}
      </button>
    </form>
  );
}
