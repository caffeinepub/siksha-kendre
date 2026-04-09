import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useSetMonthlyFeeStatus } from "../hooks/useStudents";
import { MONTH_KEYS, MONTH_LABELS, PaymentStatus, isPaid } from "../types";
import type { StudentPublic } from "../types";

interface MonthlyFeeTrackerProps {
  student: StudentPublic;
}

export function MonthlyFeeTracker({ student }: MonthlyFeeTrackerProps) {
  const setFee = useSetMonthlyFeeStatus();

  const toggle = async (month: string, current: PaymentStatus) => {
    const newStatus = isPaid(current)
      ? PaymentStatus.Pending
      : PaymentStatus.Paid;
    try {
      await setFee.mutateAsync({ id: student.id, month, status: newStatus });
      toast.success(
        `${MONTH_LABELS[month as keyof typeof MONTH_LABELS]} marked as ${isPaid(newStatus) ? "Paid" : "Pending"}`,
      );
    } catch {
      toast.error("Failed to update fee status");
    }
  };

  const paidCount = MONTH_KEYS.filter((m) =>
    isPaid(student.monthlyFees[m]),
  ).length;

  return (
    <Card
      className="overflow-hidden border shadow-xs"
      data-ocid="monthly-fee-tracker"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-muted/40">
        <h3 className="font-semibold text-foreground text-sm">
          Monthly Fee Tracker
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: "oklch(0.72 0.18 140 / 0.15)",
              color: "oklch(0.35 0.15 140)",
            }}
          >
            {paidCount} / 12 Paid
          </span>
        </div>
      </div>

      <Separator />

      {/* Month grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {MONTH_KEYS.map((month) => {
            const status = student.monthlyFees[month];
            const paid = isPaid(status);
            return (
              <button
                key={month}
                type="button"
                onClick={() => toggle(month, status)}
                disabled={setFee.isPending}
                className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: paid
                    ? "oklch(0.72 0.18 140 / 0.10)"
                    : "oklch(0.94 0.005 0)",
                  borderColor: paid
                    ? "oklch(0.60 0.18 140 / 0.5)"
                    : "oklch(0.86 0.01 0)",
                }}
                aria-label={`${MONTH_LABELS[month]}: ${paid ? "Paid — click to mark Pending" : "Pending — click to mark Paid"}`}
                data-ocid={`fee-toggle-${month}`}
              >
                {/* Month abbreviation */}
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: paid
                      ? "oklch(0.35 0.15 140)"
                      : "oklch(0.5 0.01 245)",
                  }}
                >
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </span>

                {/* Status icon */}
                {paid ? (
                  <CheckCircle2
                    className="h-5 w-5 transition-smooth"
                    style={{ color: "oklch(0.50 0.18 140)" }}
                  />
                ) : (
                  <Clock
                    className="h-5 w-5 transition-smooth"
                    style={{ color: "oklch(0.60 0.08 245)" }}
                  />
                )}

                {/* Status label */}
                <span
                  className="text-[9px] font-semibold uppercase"
                  style={{
                    color: paid
                      ? "oklch(0.45 0.16 140)"
                      : "oklch(0.55 0.07 245)",
                  }}
                >
                  {paid ? "Paid" : "Due"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend / instruction */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1.5">
            <CheckCircle2
              className="h-3.5 w-3.5"
              style={{ color: "oklch(0.50 0.18 140)" }}
            />
            Paid
          </span>
          <span className="flex items-center gap-1.5">
            <Clock
              className="h-3.5 w-3.5"
              style={{ color: "oklch(0.60 0.08 245)" }}
            />
            Due / Pending
          </span>
          <span className="ml-auto opacity-70">
            Click a month to toggle status
          </span>
        </div>
      </div>
    </Card>
  );
}
