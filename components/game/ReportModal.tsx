"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ReportModalProps {
  gameName: string;
}

export function ReportModal({ gameName }: ReportModalProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive hover:bg-muted"
      >
        <Flag className="h-3.5 w-3.5" />
        Report this app
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading">Report {gameName}</DialogTitle>
          <DialogDescription>
            Let us know if this app contains inappropriate content, broken links, or incorrect information.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <p className="py-4 text-center text-sm text-accent">
            Thank you for your report. We will review it shortly.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">
                Reason
              </label>
              <select
                id="reason"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select a reason</option>
                <option value="broken-link">Broken download link</option>
                <option value="malware">Suspected malware</option>
                <option value="incorrect-info">Incorrect information</option>
                <option value="copyright">Copyright violation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
                Details (optional)
              </label>
              <Input
                id="details"
                placeholder="Provide additional details..."
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-white">
              Submit Report
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
