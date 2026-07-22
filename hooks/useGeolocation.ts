"use client";

import { useCallback, useState } from "react";

type GeolocationState = {
  coords: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({
        coords: null,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({ coords: null, error: error.message, loading: false });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return { ...state, requestLocation };
}
