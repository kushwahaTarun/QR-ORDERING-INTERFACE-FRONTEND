"use client";

import { FormEvent, useState } from "react";
import { GearSix } from "@phosphor-icons/react";
import { toast } from "sonner";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { houseSend } from "@/lib/api";
import { gstPercent } from "@/lib/format";
import { useHouse } from "@/lib/use-house";

type RestaurantSettings = {
  name: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  cuisine: string | null;
  location: string | null;
  hours: string | null;
  loyaltyProgramName: string | null;
  loyaltyTagline: string | null;
  taxRate: number;
  estimatedPrepMinutes: number;
};

export default function SettingsPage() {
  const { data, error, loading, reload } = useHouse<RestaurantSettings>(
    "/admin/restaurant",
  );
  const [form, setForm] = useState<RestaurantSettings | null>(null);
  const [seededFrom, setSeededFrom] = useState<RestaurantSettings | null>(null);
  if (data && data !== seededFrom) {
    setSeededFrom(data);
    setForm(data);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    try {
      await houseSend("/admin/restaurant", "PATCH", {
        ...form,
        taxRate: Number(form.taxRate),
        estimatedPrepMinutes: Number(form.estimatedPrepMinutes),
      });
      toast.success("Restaurant details saved");
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  function set<K extends keyof RestaurantSettings>(
    key: K,
    value: RestaurantSettings[K],
  ) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={GearSix}
        title="Restaurant"
        description="Name, hours, and photos guests see after they scan a table card."
      />
      <LoadState loading={loading} error={error}>
        {form ? (
          <form onSubmit={onSubmit} className="grid max-w-2xl gap-7">
            <Field label="Restaurant name" htmlFor="name">
              <Input
                id="name"
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
                required
              />
            </Field>
            <Field label="One-line welcome" htmlFor="tagline">
              <Input
                id="tagline"
                value={form.tagline ?? ""}
                onChange={(event) => set("tagline", event.target.value)}
              />
            </Field>
            <Field label="About the place" htmlFor="description">
              <Textarea
                id="description"
                value={form.description ?? ""}
                onChange={(event) => set("description", event.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Area / address" htmlFor="location">
                <Input
                  id="location"
                  value={form.location ?? ""}
                  onChange={(event) => set("location", event.target.value)}
                />
              </Field>
              <Field label="Open hours" htmlFor="hours">
                <Input
                  id="hours"
                  value={form.hours ?? ""}
                  onChange={(event) => set("hours", event.target.value)}
                />
              </Field>
              <Field label="Kind of food" htmlFor="cuisine">
                <Input
                  id="cuisine"
                  value={form.cuisine ?? ""}
                  onChange={(event) => set("cuisine", event.target.value)}
                />
              </Field>
              <Field
                label="Time we tell guests (minutes)"
                htmlFor="prep"
                hint="How long food usually takes."
              >
                <Input
                  id="prep"
                  type="number"
                  min={5}
                  max={180}
                  value={form.estimatedPrepMinutes}
                  onChange={(event) =>
                    set("estimatedPrepMinutes", Number(event.target.value))
                  }
                />
              </Field>
              <Field
                label="GST (%)"
                htmlFor="tax"
                hint="For example 5 for five percent."
              >
                <Input
                  id="tax"
                  type="number"
                  min={0}
                  max={40}
                  step="0.5"
                  value={gstPercent(form.taxRate)}
                  onChange={(event) =>
                    set("taxRate", Number(event.target.value) / 100)
                  }
                />
              </Field>
              <Field label="Rewards name" htmlFor="loyalty">
                <Input
                  id="loyalty"
                  value={form.loyaltyProgramName ?? ""}
                  onChange={(event) =>
                    set("loyaltyProgramName", event.target.value)
                  }
                />
              </Field>
            </div>
            <Field
              label="Logo photo"
              htmlFor="logo"
              hint="Paste a photo link for now."
            >
              <Input
                id="logo"
                value={form.logo ?? ""}
                onChange={(event) => set("logo", event.target.value)}
              />
            </Field>
            <Field
              label="Cover photo"
              htmlFor="cover"
              hint="The big photo at the top of the guest menu."
            >
              <Input
                id="cover"
                value={form.coverImage ?? ""}
                onChange={(event) => set("coverImage", event.target.value)}
              />
            </Field>
            <Field label="Rewards line" htmlFor="loyalty-tag">
              <Input
                id="loyalty-tag"
                value={form.loyaltyTagline ?? ""}
                onChange={(event) => set("loyaltyTagline", event.target.value)}
              />
            </Field>
            <Button type="submit" className="w-fit">
              Save
            </Button>
          </form>
        ) : null}
      </LoadState>
    </div>
  );
}
