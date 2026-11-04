'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createTicketAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import {
  PortalInput,
  PortalTextarea,
  PortalSelect,
  PortalSubmit,
} from '@/components/portal/PortalField';
import { FORM_COPY, STATUS_COPY, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';

/**
 * The "raise a support ticket" form.
 *
 * The category and priority are selects rather than free text, because the
 * desk routes on them — a ticket with a real category reaches the right
 * person without a triage call.
 */
export default function PortalTicketForm() {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');

  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setReference(null);

    startTransition(async () => {
      const result = await createTicketAction({
        subject,
        message,
        category,
        priority: priority as 'low' | 'normal' | 'high' | 'urgent',
      });

      if (!result.ok) {
        const key = (result.message ?? 'actionFailed') as ValidationKey;
        const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.actionFailed;
        setError(t(copy.en, copy.hi));
        return;
      }

      setReference(result.reference ?? null);
      setSubject('');
      setMessage('');
      router.refresh();
    });
  }

  const categoryOptions = (
    ['general', 'order', 'logistics', 'quality', 'billing', 'technical'] as const
  ).map((key) => ({
    value: key,
    label: t(STATUS_COPY[key].en, STATUS_COPY[key].hi),
  }));

  const priorityOptions = (
    ['low', 'normal', 'high', 'urgent'] as const
  ).map((key) => ({
    value: key,
    label: t(STATUS_COPY[key].en, STATUS_COPY[key].hi),
  }));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <PortalInput
            label={t(FORM_COPY.subject.en, FORM_COPY.subject.hi)}
            value={subject}
            onChange={setSubject}
            required
            name="subject"
          />
        </div>

        <PortalSelect
          label={t(FORM_COPY.category.en, FORM_COPY.category.hi)}
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          name="category"
        />

        <PortalSelect
          label={t(FORM_COPY.priority.en, FORM_COPY.priority.hi)}
          value={priority}
          onChange={setPriority}
          options={priorityOptions}
          name="priority"
        />
      </div>

      <div className="mt-4">
        <PortalTextarea
          label={t(FORM_COPY.message.en, FORM_COPY.message.hi)}
          value={message}
          onChange={setMessage}
          rows={4}
          required
          name="message"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-[0.84rem] text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {reference && (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[0.84rem] text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t(FORM_COPY.ticketSent.en, FORM_COPY.ticketSent.hi)}{' '}
            <strong className="ss-tabular">{reference}</strong>
          </span>
        </p>
      )}

      <div className="mt-5">
        <PortalSubmit
          label={FORM_COPY.submitTicket}
          busy={pending}
          busyLabel={{ en: 'Submitting…', hi: 'जमा किया जा रहा है…' }}
        />
      </div>
    </form>
  );
}
