"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/account";
import { Button } from "@/components/ui/button";

export default function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteAccount();

    if (result?.error) {
      setDeleting(false);
      setConfirming(false);
      alert(`Failed to delete account: ${result.error}`);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-destructive/20 pb-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-destructive">
            Danger zone
          </p>
          <h2 className="mt-1 text-base font-medium">Delete account</h2>
        </div>
      </div>

      {!confirming ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data.
          </p>
          <Button
            variant="destructive"
            onClick={() => setConfirming(true)}
          >
            Delete account
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-destructive">
            This will permanently delete your account, preferences, alert
            history, and saved jobs. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirming(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
