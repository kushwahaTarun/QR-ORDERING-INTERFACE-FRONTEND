"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch-on-mount is the API subscription */
import { useCallback, useEffect, useRef, useState } from "react";
import { houseGet } from "@/lib/api";

export function useHouse<T>(path: string | null, tick = 0) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const dataRef = useRef(data);

  const load = useCallback(async () => {
    if (!path) {
      setLoading(false);
      return;
    }
    if (!dataRef.current) {
      setLoading(true);
    }
    try {
      const next = await houseGet<T>(path);
      dataRef.current = next;
      setData(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load, tick]);

  return { data, error, loading, reload: load, setData };
}
