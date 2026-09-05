"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ForkKnife, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import { EmptyState } from "@/components/house/empty-state";
import { FilterChip } from "@/components/house/filter-chip";
import { LoadState } from "@/components/house/load-state";
import { MenuDishCard } from "@/components/house/menu-dish-card";
import { PageHeader } from "@/components/house/page-header";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { houseSend } from "@/lib/api";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type MenuPayload = {
  categories: MenuCategory[];
  items: MenuItem[];
};

const emptyItem = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  image: "",
  diet: "veg" as MenuItem["diet"],
  available: true,
  popular: false,
  chefPick: false,
};

export default function MenuPage() {
  const { data, error, loading, reload, setData } = useHouse<MenuPayload>(
    "/admin/menu",
  );
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [categoryForm, setCategoryForm] = useState({ name: "", nameHi: "" });
  const formRef = useRef<HTMLFormElement>(null);

  const items = useMemo(() => {
    const list = data?.items ?? [];
    const term = query.trim().toLowerCase();
    return list.filter((item) => {
      if (!term && section !== "all" && item.categoryId !== section) {
        return false;
      }
      if (
        term &&
        !`${item.name} ${item.categoryName}`.toLowerCase().includes(term)
      ) {
        return false;
      }
      return true;
    });
  }, [data?.items, query, section]);

  const grouped = useMemo(() => {
    const cats = data?.categories ?? [];
    return cats
      .map((category) => ({
        category,
        dishes: items.filter((item) => item.categoryId === category.id),
      }))
      .filter((group) => group.dishes.length > 0);
  }, [data?.categories, items]);

  const hiddenCount = data?.items.filter((item) => !item.available).length ?? 0;

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm({
      ...emptyItem,
      categoryId: section !== "all" ? section : (data?.categories[0]?.id ?? ""),
    });
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function openEdit(item: MenuItem) {
    setCreating(false);
    setEditing(item);
    setForm({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
      diet: item.diet,
      available: item.available,
      popular: item.popular,
      chefPick: item.chefPick,
    });
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      diet: form.diet,
      available: form.available,
      popular: form.popular,
      chefPick: form.chefPick,
    };
    try {
      if (editing) {
        await houseSend(`/admin/menu/items/${editing.id}`, "PATCH", payload);
        toast.success("Dish saved");
      } else {
        await houseSend("/admin/menu/items", "POST", payload);
        toast.success("Dish added to the menu");
      }
      closeForm();
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  async function toggleAvailable(item: MenuItem) {
    const next = !item.available;
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.map((row) =>
              row.id === item.id ? { ...row, available: next } : row,
            ),
          }
        : current,
    );
    try {
      await houseSend(`/admin/menu/items/${item.id}`, "PATCH", {
        available: next,
      });
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update.");
      await reload();
    }
  }

  async function removeItem(item: MenuItem) {
    if (!window.confirm(`Take ${item.name} off the menu?`)) return;
    try {
      await houseSend(`/admin/menu/items/${item.id}`, "DELETE");
      toast.success("Dish removed");
      if (editing?.id === item.id) closeForm();
      setData((current) =>
        current
          ? {
              ...current,
              items: current.items.filter((row) => row.id !== item.id),
            }
          : current,
      );
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not remove.");
    }
  }

  async function addCategory(event: FormEvent) {
    event.preventDefault();
    try {
      await houseSend("/admin/menu/categories", "POST", {
        name: categoryForm.name,
        slug: categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        nameHi: categoryForm.nameHi || categoryForm.name,
      });
      setCategoryForm({ name: "", nameHi: "" });
      setAddingSection(false);
      toast.success("Section added");
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not add.");
    }
  }

  const showForm = creating || editing;

  return (
    <div>
      <PageHeader
        icon={ForkKnife}
        title="Menu"
        description="This is what guests see after they scan a table card. Hide a dish tonight, or change the price."
        actions={
          <Button onClick={openCreate} disabled={!data?.categories.length}>
            <Plus size={16} weight="bold" />
            Add a dish
          </Button>
        }
      />
      <LoadState loading={loading} error={error}>
        {!data ? null : (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              {data.items.length} dishes
              {hiddenCount ? ` · ${hiddenCount} hidden tonight` : ""}
              {` · ${data.categories.length} sections`}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <MagnifyingGlass
                  className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-primary"
                  size={18}
                  weight="duotone"
                />
                <Input
                  className="pl-7"
                  placeholder="Find a dish"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Find a dish"
                />
              </label>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAddingSection((open) => !open)}
              >
                <Plus size={16} weight="bold" />
                Add section
              </Button>
            </div>

            {addingSection ? (
              <form
                onSubmit={addCategory}
                className="surface grid gap-5 rounded-md p-5 sm:grid-cols-[1fr_1fr_auto]"
              >
                <Field
                  label="Section name"
                  htmlFor="cat-name"
                  hint="Starters, mains, drinks…"
                >
                  <Input
                    id="cat-name"
                    value={categoryForm.name}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </Field>
                <Field label="Hindi name" htmlFor="cat-hi">
                  <Input
                    id="cat-hi"
                    value={categoryForm.nameHi}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        nameHi: event.target.value,
                      }))
                    }
                  />
                </Field>
                <div className="flex items-end gap-2">
                  <Button type="submit">Save section</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAddingSection(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}

            {!query.trim() ? (
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Menu section"
              >
                <FilterChip
                  active={section === "all"}
                  onClick={() => setSection("all")}
                >
                  All
                </FilterChip>
                {data.categories.map((category) => (
                  <FilterChip
                    key={category.id}
                    active={section === category.id}
                    onClick={() => setSection(category.id)}
                  >
                    {category.name}
                  </FilterChip>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "match" : "matches"} for “
                {query.trim()}”
              </p>
            )}

            {showForm ? (
              <form
                ref={formRef}
                onSubmit={saveItem}
                className="surface grid gap-5 rounded-md p-5 md:grid-cols-[1fr_14rem]"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <h2 className="font-heading text-2xl md:col-span-2">
                    {editing ? `Edit ${editing.name}` : "New dish"}
                  </h2>
                  <Field label="Name" htmlFor="item-name">
                    <Input
                      id="item-name"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Price (₹)" htmlFor="item-price">
                    <Input
                      id="item-price"
                      type="number"
                      min={0}
                      step="1"
                      value={form.price}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Section" htmlFor="item-cat">
                    <select
                      id="item-cat"
                      className="min-h-12 w-full border-0 border-b border-input bg-transparent px-0 text-base"
                      value={form.categoryId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          categoryId: event.target.value,
                        }))
                      }
                    >
                      {data.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Veg or non-veg" htmlFor="item-diet">
                    <select
                      id="item-diet"
                      className="min-h-12 w-full border-0 border-b border-input bg-transparent px-0 text-base"
                      value={form.diet}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          diet: event.target.value as MenuItem["diet"],
                        }))
                      }
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-veg</option>
                      <option value="egg">Egg</option>
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Short description" htmlFor="item-desc">
                      <Textarea
                        id="item-desc"
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
                  <div className="md:col-span-2">
                    <Field
                      label="Photo link"
                      htmlFor="item-image"
                      hint="Paste a photo link for now."
                    >
                      <Input
                        id="item-image"
                        value={form.image}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            image: event.target.value,
                          }))
                        }
                      />
                    </Field>
                  </div>
                  <label className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          available: event.target.checked,
                        }))
                      }
                    />
                    Show on the menu
                  </label>
                  <label className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          popular: event.target.checked,
                        }))
                      }
                    />
                    Mark as popular
                  </label>
                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    <Button type="submit">Save dish</Button>
                    <Button type="button" variant="ghost" onClick={closeForm}>
                      Cancel
                    </Button>
                    {editing ? (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => void removeItem(editing)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="hidden md:block">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image}
                      alt=""
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center border border-dashed border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Photo
                    </div>
                  )}
                </div>
              </form>
            ) : null}

            {items.length === 0 ? (
              <EmptyState
                title="No dishes here"
                body={
                  data.items.length === 0
                    ? "Add a section first, then add a dish."
                    : "Nothing matches this search. Clear the box to see the section again."
                }
              />
            ) : query.trim() || section !== "all" ? (
              <DishGrid
                dishes={items}
                onEdit={openEdit}
                onToggle={toggleAvailable}
              />
            ) : (
              <div className="space-y-10">
                {grouped.map((group) => (
                  <section key={group.category.id}>
                    <div className="mb-4 flex items-baseline justify-between gap-3">
                      <h2 className="font-heading text-2xl">
                        {group.category.name}
                      </h2>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {group.dishes.length}{" "}
                        {group.dishes.length === 1 ? "dish" : "dishes"}
                      </p>
                    </div>
                    <DishGrid
                      dishes={group.dishes}
                      onEdit={openEdit}
                      onToggle={toggleAvailable}
                    />
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </LoadState>
    </div>
  );
}

function DishGrid({
  dishes,
  onEdit,
  onToggle,
}: {
  dishes: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onToggle: (item: MenuItem) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {dishes.map((item) => (
        <li key={item.id}>
          <MenuDishCard
            item={item}
            onEdit={() => onEdit(item)}
            onToggle={() => void onToggle(item)}
          />
        </li>
      ))}
    </ul>
  );
}
