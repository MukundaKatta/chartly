"use client";

import { useState } from "react";
import Link from "next/link";

const DEFAULT_DIALOG = `Doctor: Good morning. What brings you in today?

Patient: I've been having this neck pain for about three weeks now. It's mostly a dull ache, but sometimes it stabs when I turn my head to the right.

Doctor: When did it start? Did anything happen?

Patient: It started about three weeks ago, after I tried a new pillow. Woke up the next morning and it was already stiff.

Doctor: Have you taken anything for the pain?

Patient: I've been taking ibuprofen, 400 mg, twice a day. It helps a little but doesn't fully go away.

Doctor: Any numbness, tingling, or weakness in your arms?

Patient: No, nothing like that. Just the neck.

Doctor: Any headaches, dizziness, or fever?

Patient: Occasional headaches, but no fever or dizziness.

Doctor: Let me check your range of motion. Can you turn your head to the right for me?

Patient: Yeah, it's tight right there and a little painful.

Doctor: I see. Rotation is limited on the right side. No focal neurological deficits on exam. Based on everything, this looks like mechanical cervicalgia — likely from the pillow change. I'd recommend a stretching program, swapping to a supportive pillow, and continuing NSAIDs as needed. Let's follow up in two weeks if it hasn't improved.

Patient: Sounds good, thank you.`;

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

function generateSoapNote(dialog: string): SoapNote {
  const lower = dialog.toLowerCase();

  // Subjective: pull chief complaint, duration, and medications from dialog
  const durationMatch = lower.match(/(\w+ weeks?|\w+ days?|\w+ months?)/);
  const duration = durationMatch ? durationMatch[0] : "unspecified duration";

  const hasPain = lower.includes("pain") || lower.includes("ache");
  const hasNeck = lower.includes("neck");
  const hasDull = lower.includes("dull");
  const hasStabbing = lower.includes("stab");
  const hasRotation = lower.includes("turn") || lower.includes("rotat");
  const hasPillow = lower.includes("pillow");
  const hasIbuprofen = lower.includes("ibuprofen");
  const hasMgMatch = dialog.match(/(\d+\s*mg)/i);
  const dose = hasMgMatch ? hasMgMatch[1] : null;
  const hasBid = lower.includes("twice a day") || lower.includes("bid");
  const hasHeadache = lower.includes("headache");
  const hasNumbness = lower.includes("numb") || lower.includes("tingling") || lower.includes("weakness");

  const subjParts: string[] = [];
  if (hasNeck && hasPain) {
    const quality = [hasDull && "dull", hasStabbing && "intermittent stabbing"]
      .filter(Boolean)
      .join(" with ");
    subjParts.push(
      `Pt reports ${duration} of cervical pain${quality ? `, ${quality}` : ""}${hasRotation ? " on right rotation" : ""}.`
    );
  } else if (hasPain) {
    subjParts.push(`Pt reports pain of ${duration}.`);
  }
  if (hasPillow) subjParts.push("Onset after new pillow use.");
  if (hasIbuprofen) {
    const medStr = `Ibuprofen${dose ? ` ${dose}` : ""}${hasBid ? " BID" : ""} with partial relief.`;
    subjParts.push(medStr);
  }
  if (hasHeadache) subjParts.push("Occasional headaches reported.");
  if (hasNumbness) {
    subjParts.push("Numbness, tingling, or upper extremity weakness present — requires further evaluation.");
  } else if (lower.includes("no numb") || lower.includes("nothing like that")) {
    subjParts.push("Denies numbness, tingling, or upper extremity weakness.");
  }

  const subjective =
    subjParts.length > 0
      ? subjParts.join(" ")
      : "Chief complaint documented from patient dialog. See full transcript for details.";

  // Objective: physical findings
  const objParts: string[] = [];
  const hasLimitedRom = lower.includes("limited") || lower.includes("tight") || lower.includes("stiff");
  const hasNoDeficits = lower.includes("no focal") || lower.includes("no numb");

  if (hasNeck && hasLimitedRom) {
    objParts.push(
      `Cervical ROM${hasRotation ? " limited on right rotation" : " restricted"}.`
    );
  }
  if (hasNoDeficits) {
    objParts.push("No focal neurological deficits on exam.");
  }

  const objective =
    objParts.length > 0
      ? objParts.join(" ")
      : "Physical examination findings documented. See provider notes.";

  // Assessment: diagnosis keywords
  const assmtParts: string[] = [];
  if (lower.includes("cervicalgia") || lower.includes("mechanical")) {
    assmtParts.push("Mechanical cervicalgia.");
  } else if (hasNeck && hasPain) {
    assmtParts.push("Cervical musculoskeletal pain, likely mechanical in etiology.");
  } else {
    assmtParts.push("Assessment pending further workup.");
  }
  if (hasPillow) assmtParts.push("Contributing factor: pillow change.");

  const assessment = assmtParts.join(" ");

  // Plan: treatment keywords
  const planParts: string[] = [];
  if (lower.includes("stretch")) planParts.push("Cervical stretching program.");
  if (hasPillow && lower.includes("support")) planParts.push("Supportive pillow recommendation.");
  else if (hasPillow) planParts.push("Pillow adjustment recommended.");
  if (hasIbuprofen || lower.includes("nsaid")) planParts.push("Continue NSAIDs as needed for pain.");
  const followUpMatch = lower.match(/follow.{0,5}up.{0,15}(\d+ weeks?|\d+ days?)/i);
  if (followUpMatch) {
    planParts.push(`Follow-up in ${followUpMatch[1]}.`);
  } else if (lower.includes("follow")) {
    planParts.push("Follow-up scheduled.");
  }
  if (planParts.length === 0) planParts.push("Treatment plan to be determined.");

  const plan = planParts.join(" ");

  return { subjective, objective, assessment, plan };
}

export default function TryPage() {
  const [dialog, setDialog] = useState(DEFAULT_DIALOG);
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dialog.trim()) return;
    setSoapNote(generateSoapNote(dialog));
  }

  function handleReset() {
    setSoapNote(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
          Chartly
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            Live demo
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Paste a patient conversation, get a SOAP note.
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Edit or replace the sample dialog below, then hit Generate.
          </p>
        </div>

        {soapNote ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                  SOAP note · ready to sign
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  ← Edit dialog
                </button>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Subjective
                  </p>
                  <p className="text-neutral-800">{soapNote.subjective}</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Objective
                  </p>
                  <p className="text-neutral-800">{soapNote.objective}</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Assessment
                  </p>
                  <p className="text-neutral-800">{soapNote.assessment}</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Plan
                  </p>
                  <p className="text-neutral-800">{soapNote.plan}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-neutral-400">
              This is a v0 skeleton using keyword rules — not AI inference.{" "}
              <Link href="/#waitlist" className="underline hover:text-neutral-600">
                Join the waitlist
              </Link>{" "}
              for the real thing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-3xl border border-neutral-200 bg-white p-1 shadow-sm">
              <textarea
                value={dialog}
                onChange={(e) => setDialog(e.target.value)}
                rows={20}
                className="w-full rounded-2xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-y"
                placeholder="Paste the doctor-patient conversation here…"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-cyan-600 py-3.5 font-medium text-white transition hover:bg-cyan-700"
            >
              Generate SOAP note →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
