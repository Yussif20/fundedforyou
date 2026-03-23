"use client";

import { useState, useCallback, useMemo } from "react";

export type ColumnDef = {
  key: string;
  labelKey: string;
};

type ColumnPrefs = {
  visibility: Record<string, boolean>;
  order: string[];
};

function loadPrefs(storageKey: string): ColumnPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as ColumnPrefs;
  } catch {
    return null;
  }
}

function savePrefs(storageKey: string, prefs: ColumnPrefs) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function buildDefaults(columns: ColumnDef[]): ColumnPrefs {
  const visibility: Record<string, boolean> = {};
  const order: string[] = [];
  for (const col of columns) {
    visibility[col.key] = true;
    order.push(col.key);
  }
  return { visibility, order };
}

function mergeWithDefaults(
  stored: ColumnPrefs,
  columns: ColumnDef[],
): ColumnPrefs {
  const defaults = buildDefaults(columns);
  const allKeys = new Set(defaults.order);

  // Keep stored visibility for known keys, add new keys as visible
  const visibility: Record<string, boolean> = {};
  for (const key of allKeys) {
    visibility[key] = stored.visibility[key] ?? true;
  }

  // Keep stored order for known keys, append new keys at end
  const order = stored.order.filter((k) => allKeys.has(k));
  for (const key of defaults.order) {
    if (!order.includes(key)) order.push(key);
  }

  return { visibility, order };
}

export function useColumnCustomization(
  storageKey: string,
  columns: ColumnDef[],
) {
  const [prefs, setPrefs] = useState<ColumnPrefs>(() => {
    const stored = loadPrefs(storageKey);
    if (stored) return mergeWithDefaults(stored, columns);
    return buildDefaults(columns);
  });

  const updatePrefs = useCallback(
    (next: ColumnPrefs) => {
      setPrefs(next);
      savePrefs(storageKey, next);
    },
    [storageKey],
  );

  const toggleVisibility = useCallback(
    (key: string) => {
      const next = {
        ...prefs,
        visibility: { ...prefs.visibility, [key]: !prefs.visibility[key] },
      };
      updatePrefs(next);
    },
    [prefs, updatePrefs],
  );

  const reorder = useCallback(
    (activeKey: string, overKey: string) => {
      const oldIndex = prefs.order.indexOf(activeKey);
      const newIndex = prefs.order.indexOf(overKey);
      if (oldIndex === -1 || newIndex === -1) return;
      const newOrder = [...prefs.order];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeKey);
      updatePrefs({ ...prefs, order: newOrder });
    },
    [prefs, updatePrefs],
  );

  const setAllVisibility = useCallback(
    (visible: boolean) => {
      const newVisibility: Record<string, boolean> = {};
      for (const col of columns) {
        newVisibility[col.key] = visible;
      }
      updatePrefs({ ...prefs, visibility: newVisibility });
    },
    [columns, prefs, updatePrefs],
  );

  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaults(columns);
    updatePrefs(defaults);
  }, [columns, updatePrefs]);

  const orderedVisibleKeys = useMemo(
    () => prefs.order.filter((key) => prefs.visibility[key]),
    [prefs],
  );

  return {
    visibility: prefs.visibility,
    order: prefs.order,
    toggleVisibility,
    setAllVisibility,
    reorder,
    resetToDefaults,
    orderedVisibleKeys,
    columns,
  };
}
