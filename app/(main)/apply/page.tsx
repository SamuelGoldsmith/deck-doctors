"use client";

import { useState } from "react";
import { submitApplication } from "@/lib/utils";

type Position = "laborer" | "carpenter" | "painter" | "";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: Position;
  experience: string;
  availability: string;
  hasDrivingLicense: string;
  message: string;
}

const POSITIONS = [
  {
    value: "laborer",
    label: "General Laborer",
    description: "Site prep, sanding, material handling, cleanup & support",
    icon: "🪚",
  },
  {
    value: "carpenter",
    label: "Carpenter",
    description: "Framing, decking, design, structural & finish carpentry",
    icon: "🔨",
  },
  {
    value: "painter",
    label: "Painter",
    description: "Staining, sealing, prepping, and painting exterior surfaces",
    icon: "🖌️",
  },
];

export default function ApplyPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    availability: "",
    hasDrivingLicense: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.position) newErrors.position = "Select a position";
    if (!form.experience) newErrors.experience = "Required";
    if (!form.availability) newErrors.availability = "Required";
    if (!form.hasDrivingLicense) newErrors.hasDrivingLicense = "Required";
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

  const handlePositionSelect = (value: Position) => {
    setForm((prev) => ({ ...prev, position: value }));
    if (errors.position) setErrors((prev) => ({ ...prev, position: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const ok = await submitApplication(form);
      if (!ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-10 text-center space-y-4">
          <div className="text-5xl">🏗️</div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
            Application Received
          </h2>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Thanks, {form.firstName}! We'll review your application and reach out within a few business days.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setForm({
                firstName: "", lastName: "", email: "", phone: "",
                position: "", experience: "", availability: "",
                hasDrivingLicense: "", message: "",
              });
            }}
            className="mt-4 px-6 py-2 rounded-md text-sm font-medium primary transition-opacity hover:opacity-80"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <p
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            Now Hiring
          </p>
          <h1
            className="text-4xl font-extrabold leading-tight"
            style={{ color: "var(--color-primary)" }}
          >
            Join the<br />Deck Doctors Crew
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
            We build decks that last and teams that stick around. If you take pride in your craft
            and show up ready to work, we want to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* Position selector */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Position <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {POSITIONS.map((pos) => {
                const selected = form.position === pos.value;
                return (
                  <button
                    type="button"
                    key={pos.value}
                    onClick={() => handlePositionSelect(pos.value as Position)}
                    className="text-left p-4 rounded-lg border-2 transition-all duration-150"
                    style={{
                      borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                      backgroundColor: selected ? "var(--color-primary)" : "var(--color-card)",
                      color: selected ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                    }}
                  >
                    {/* <div className="text-2xl mb-1">{pos.icon}</div> */}
                    <div className="font-semibold text-sm">{pos.label}</div>
                    <div
                      className="text-xs mt-0.5 leading-snug"
                      style={{
                        color: selected
                          ? "var(--color-primary-foreground)"
                          : "var(--color-muted-foreground)",
                        opacity: selected ? 0.85 : 1,
                      }}
                    >
                      {pos.description}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.position && (
              <p className="text-xs text-red-500">{errors.position}</p>
            )}
          </section>

          {/* Personal Info */}
          <section className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-foreground)" }}>
              Personal Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </section>

          {/* Work Details */}
          <section className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-foreground)" }}>
              Work Details
            </h2>

            <Field label="Years of Experience" error={errors.experience} required>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className={inputClass(!!errors.experience)}
              >
                <option value="">Select experience level</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1–3 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </Field>

            <Field label="Availability" error={errors.availability} required>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className={inputClass(!!errors.availability)}
              >
                <option value="">When can you start?</option>
                <option value="immediately">Immediately</option>
                <option value="1-week">Within 1 week</option>
                <option value="2-weeks">2 weeks notice</option>
                <option value="1-month">1 month</option>
              </select>
            </Field>

            <Field label="Valid Driver's License?" error={errors.hasDrivingLicense} required>
                <select
                  name="hasDrivingLicense"
                  value={form.hasDrivingLicense}
                  onChange={handleChange}
                  className={inputClass(!!errors.hasDrivingLicense)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>

            <Field label="Anything else you'd like us to know?">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Previous projects, certifications, references..."
                className={inputClass(false) + " resize-none"}
              />
            </Field>
          </section>

          {status === "error" && (
            <p className="text-sm text-red-500 text-center">
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 rounded-lg font-semibold text-sm primary transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting…" : "Submit Application →"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-3 py-2 rounded-md text-sm outline-none transition-colors",
    "border",
    hasError
      ? "border-red-400 bg-red-50"
      : "border-[var(--color-border)] bg-[var(--color-background)]",
    "focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
  ].join(" ");
}
