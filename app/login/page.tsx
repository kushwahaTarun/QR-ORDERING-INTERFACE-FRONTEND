"use client";

import { FormEvent, useState } from "react";
import { CookingPot, ForkKnife, QrCode } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "@/components/house/auth-provider";
import { IconWell } from "@/components/house/icon-well";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("owner@shagun.local");
  const [password, setPassword] = useState("HouseDemo@123");
  const [pending, setPending] = useState(false);
  const reduce = useReducedMotion();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await login(email, password);
    } catch (caught) {
      toast.error(
        caught instanceof ApiError
          ? caught.message
          : "Email or password is wrong.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80)",
          }}
          animate={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 18, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c] via-[#100e0c]/70 to-[#100e0c]/30" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
            Dining House
          </p>
          <h1 className="mt-3 max-w-md font-heading text-5xl leading-tight">
            Kitchen, menu, and table cards — in one place.
          </h1>
          <div className="mt-8 flex gap-3">
            <IconWell icon={CookingPot} />
            <IconWell icon={ForkKnife} />
            <IconWell icon={QrCode} />
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-14">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
              Dining House
            </p>
            <h2 className="mt-2 font-heading text-3xl">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For the owner and the kitchen. Guests scan the card on their table.
            </p>
          </div>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Opening…" : "Open the restaurant"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Try owner@shagun.local · kitchen@shagun.local
            <br />
            Password HouseDemo@123
          </p>
        </form>
      </section>
    </main>
  );
}
