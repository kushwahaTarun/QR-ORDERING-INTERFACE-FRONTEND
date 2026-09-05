"use client";

import { FormEvent, useState } from "react";
import { Buildings } from "@phosphor-icons/react";
import { toast } from "sonner";
import { EmptyState } from "@/components/house/empty-state";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { useAuth } from "@/components/house/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { houseSend } from "@/lib/api";
import { useHouse } from "@/lib/use-house";

type PlatformRestaurant = {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  isActive: boolean;
  tables: number;
  orders: number;
  menuItems: number;
  staff: number;
};

export default function RestaurantsPage() {
  const { isSuper, selectRestaurant } = useAuth();
  const { data, error, loading, reload } = useHouse<{
    restaurants: PlatformRestaurant[];
  }>(isSuper ? "/admin/restaurants" : null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    location: "",
    tagline: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  if (!isSuper) {
    return (
      <EmptyState
        title="This page is for the main account"
        body="Only the person who looks after every restaurant can add a new one here."
      />
    );
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await houseSend("/admin/restaurants", "POST", form);
      toast.success(`${form.name} is ready`);
      setForm({
        name: "",
        slug: "",
        location: "",
        tagline: "",
        description: "",
        ownerName: "",
        ownerEmail: "",
        ownerPassword: "",
      });
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not create.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Buildings}
        title="All restaurants"
        description="Open one to run kitchen and menu, or add a new owner below."
      />
      <LoadState loading={loading} error={error}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Restaurant</th>
                <th className="px-5 py-3">Place</th>
                <th className="px-5 py-3">Dishes</th>
                <th className="px-5 py-3">Tables</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Team</th>
              </tr>
            </thead>
            <tbody>
              {(data?.restaurants ?? []).map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="press cursor-pointer text-left font-medium hover:text-primary"
                      onClick={() => void selectRestaurant(row.id)}
                    >
                      {row.name}
                    </button>
                    {!row.isActive ? <Badge>Paused</Badge> : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.location ?? "—"}
                  </td>
                  <td className="px-4 py-3">{row.menuItems}</td>
                  <td className="px-4 py-3">{row.tables}</td>
                  <td className="px-4 py-3">{row.orders}</td>
                  <td className="px-4 py-3">{row.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoadState>

      <form
        onSubmit={onCreate}
        className="mt-16 grid max-w-3xl gap-5 border-t border-primary/20 pt-10 md:grid-cols-2"
      >
        <h2 className="font-heading text-2xl md:col-span-2">Add a restaurant</h2>
        <Field label="Name" htmlFor="r-name">
          <Input
            id="r-name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
        </Field>
        <Field
          label="Short name for the link"
          htmlFor="r-slug"
          hint="Small letters, like shagun or civil-lines. Guests never type this."
        >
          <Input
            id="r-slug"
            placeholder="shagun"
            value={form.slug}
            onChange={(event) =>
              setForm((current) => ({ ...current, slug: event.target.value }))
            }
            required
          />
        </Field>
        <Field label="Location" htmlFor="r-loc">
          <Input
            id="r-loc"
            value={form.location}
            onChange={(event) =>
              setForm((current) => ({ ...current, location: event.target.value }))
            }
          />
        </Field>
        <Field label="Tagline" htmlFor="r-tag">
          <Input
            id="r-tag"
            value={form.tagline}
            onChange={(event) =>
              setForm((current) => ({ ...current, tagline: event.target.value }))
            }
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description" htmlFor="r-desc">
            <Textarea
              id="r-desc"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </Field>
        </div>
        <Field label="Owner name" htmlFor="o-name">
          <Input
            id="o-name"
            value={form.ownerName}
            onChange={(event) =>
              setForm((current) => ({ ...current, ownerName: event.target.value }))
            }
            required
          />
        </Field>
        <Field label="Owner email" htmlFor="o-email">
          <Input
            id="o-email"
            type="email"
            value={form.ownerEmail}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                ownerEmail: event.target.value,
              }))
            }
            required
          />
        </Field>
        <Field label="Owner password" htmlFor="o-pass">
          <Input
            id="o-pass"
            type="password"
            minLength={8}
            value={form.ownerPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                ownerPassword: event.target.value,
              }))
            }
            required
          />
        </Field>
        <div className="flex items-end">
          <Button type="submit">Add restaurant</Button>
        </div>
      </form>
    </div>
  );
}
