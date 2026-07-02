import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PortfolioProduct, PortfolioSeller } from "@/lib/dummy-data";
import { toast } from "sonner";

export type InquiryForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  message: string;
};

const emptyForm: InquiryForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  message: "",
};

const fieldClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10";

type InquiryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: PortfolioSeller;
  product: PortfolioProduct | null;
};

export function InquiryDialog({ open, onOpenChange, seller, product }: InquiryDialogProps) {
  const [form, setForm] = useState<InquiryForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof InquiryForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      setForm(emptyForm);
      toast.success("Inquiry sent successfully", {
        description: `${seller.name} will respond to ${form.email} within 1–2 business days.`,
      });
    }, 800);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(emptyForm);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-xl border border-zinc-200 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900">Product inquiry</DialogTitle>
          <DialogDescription className="text-sm text-zinc-600">
            {product ? (
              <>
                Ask <span className="font-semibold text-zinc-800">{seller.name}</span> about{" "}
                <span className="font-semibold text-brand-red">{product.title}</span>
              </>
            ) : (
              <>Send a general inquiry to {seller.name}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name *" id="inq-name">
              <input
                id="inq-name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="John Smith"
                className={fieldClass}
              />
            </Field>
            <Field label="Email *" id="inq-email">
              <input
                id="inq-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@company.com"
                className={fieldClass}
              />
            </Field>
            <Field label="Phone" id="inq-phone">
              <input
                id="inq-phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 555 000 0000"
                className={fieldClass}
              />
            </Field>
            <Field label="Company" id="inq-company">
              <input
                id="inq-company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Your business name"
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label="Country *" id="inq-country">
            <input
              id="inq-country"
              required
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="United States, UK, UAE…"
              className={fieldClass}
            />
          </Field>
          <Field label="Message *" id="inq-message">
            <textarea
              id="inq-message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="I'm interested in pricing, shipping to my port, and inspection reports…"
              className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
            />
          </Field>

          {product && (
            <p className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
              Referencing: <span className="font-mono font-bold">{product.id}</span> ·{" "}
              {product.year} · Listed at{" "}
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(product.price)}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-red hover:bg-brand-redDark"
          >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "Sending…" : "Send inquiry"}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
            <Mail className="h-3 w-3" />
            Your details are shared only with {seller.company}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}
