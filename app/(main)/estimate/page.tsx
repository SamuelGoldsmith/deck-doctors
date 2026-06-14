"use client";

import { useState } from "react";
import Link from "next/link";
import {
  submitEstimateRequest,
  type EstimateRequestInput,
  type ServiceType,
} from "@/lib/utils";
import { Field, inputClass } from "@/components/ui/form-field";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

type FormData = EstimateRequestInput;

const SERVICE_TYPES: { value: ServiceType; label: string; description: string }[] = [
  {
    value: "restoration",
    label: "Restoration",
    description: "Bring a tired deck back to life — cleaning, repairs & refinishing",
  },
  {
    value: "new_build",
    label: "New Build",
    description: "Design and build a brand-new deck from the ground up",
  },
  {
    value: "repair",
    label: "Repair",
    description: "Fix specific issues — boards, railings, stairs, structural",
  },
  {
    value: "staining_sealing",
    label: "Staining & Sealing",
    description: "Protect and refresh your deck's finish",
  },
  {
    value: "inspection",
    label: "Inspection",
    description: "Get a professional assessment of your deck's condition",
  },
];

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  serviceType: "",
  message: "",
};

export default function EstimatePage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.serviceType) newErrors.serviceType = "Select a service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceSelect = (value: ServiceType) => {
    setForm((prev) => ({ ...prev, serviceType: value }));
    if (errors.serviceType) setErrors((prev) => ({ ...prev, serviceType: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const ok = await submitEstimateRequest(form);
      if (!ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Container className="flex min-h-[70vh] items-center justify-center py-20">
        <div className="card w-full max-w-md space-y-4 p-10 text-center">
          <div className="text-5xl">🛠️</div>
          <h2 className="font-display text-h3 font-bold text-primary">Request Received</h2>
          <p className="text-sm text-muted-foreground">
            Thanks, {form.firstName}! We&apos;ll review your project details and reach out within
            1 business day to schedule your free estimate.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setForm(initialForm);
            }}
            className="primary mt-4 rounded-md px-6 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Submit Another Request
          </button>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <Container className="max-w-2xl space-y-10">
        <Reveal>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Free Estimate
            </p>
            <h1 className="font-display text-h2 font-bold text-primary">
              Let&apos;s Talk About Your Deck
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tell us a bit about your project and we&apos;ll get back to you with next steps —
              no obligation, no pressure.
            </p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Service type selector */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              What do you need? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_TYPES.map((service) => {
                const selected = form.serviceType === service.value;
                return (
                  <button
                    type="button"
                    key={service.value}
                    onClick={() => handleServiceSelect(service.value)}
                    className="rounded-lg border-2 p-4 text-left transition-all duration-150"
                    style={{
                      borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                      backgroundColor: selected ? "var(--color-primary)" : "var(--color-card)",
                      color: selected
                        ? "var(--color-primary-foreground)"
                        : "var(--color-foreground)",
                    }}
                  >
                    <div className="text-sm font-semibold">{service.label}</div>
                    <div
                      className="mt-0.5 text-xs leading-snug"
                      style={{
                        color: selected
                          ? "var(--color-primary-foreground)"
                          : "var(--color-muted-foreground)",
                        opacity: selected ? 0.85 : 1,
                      }}
                    >
                      {service.description}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.serviceType && <p className="text-xs text-red-500">{errors.serviceType}</p>}
          </section>

          {/* Contact info */}
          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contact Info
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name" error={errors.firstName} required>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className={inputClass(!!errors.firstName)}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName} required>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  className={inputClass(!!errors.lastName)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email} required>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@email.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>
              <Field label="Phone" error={errors.phone} required>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(860) 555-0100"
                  className={inputClass(!!errors.phone)}
                />
              </Field>
            </div>

            <Field label="Property Address" error={errors.address} required>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, Hartford, CT"
                className={inputClass(!!errors.address)}
              />
            </Field>
          </section>

          {/* Project details */}
          <section className="card space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Project Details
            </h2>

            <Field label="Tell us about your project">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Deck material, approximate size, timeline, and anything else you'd like us to know..."
                className={inputClass(false, "resize-none")}
              />
            </Field>
          </section>

          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="primary w-full rounded-lg py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting…" : "Request My Estimate →"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Have a quick question instead?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact us
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
