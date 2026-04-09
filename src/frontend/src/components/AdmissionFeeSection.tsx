import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Banknote, CheckCircle2, Clock, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSetAdmissionFeeStatus } from "../hooks/useStudents";
import { isPaid } from "../types";
import { PaymentMethod, PaymentStatus } from "../types";
import type { StudentPublic } from "../types";
import { PaymentQR } from "./PaymentQR";

interface AdmissionFeeSectionProps {
  student: StudentPublic;
}

export function AdmissionFeeSection({ student }: AdmissionFeeSectionProps) {
  const setAdmissionFee = useSetAdmissionFeeStatus();
  const [showQr, setShowQr] = useState(false);

  const paid = isPaid(student.admissionFee.status);
  const pmEntry = student.admissionFee.paymentMethod;
  const paymentMethod =
    pmEntry === undefined
      ? null
      : pmEntry === PaymentMethod.UPI
        ? "PhonePe / UPI"
        : "Cash";

  const markPaid = async (method: "UPI" | "Cash") => {
    try {
      await setAdmissionFee.mutateAsync({
        id: student.id,
        status: PaymentStatus.Paid,
        paymentMethod:
          method === "UPI" ? PaymentMethod.UPI : PaymentMethod.Cash,
      });
      toast.success(`Admission fee marked as Paid (${method})`);
      setShowQr(false);
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const markPending = async () => {
    try {
      await setAdmissionFee.mutateAsync({
        id: student.id,
        status: PaymentStatus.Pending,
        paymentMethod: null,
      });
      toast.success("Admission fee marked as Pending");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  return (
    <>
      <Card
        className="overflow-hidden border shadow-xs"
        data-ocid="admission-fee-section"
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: paid
              ? "oklch(0.72 0.18 140 / 0.08)"
              : "oklch(0.72 0.15 55 / 0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">
              Admission Fee
            </span>
            <span className="font-bold text-foreground">₹300</span>
          </div>
          <Badge
            className="font-semibold text-xs px-3 py-0.5 rounded-full"
            style={
              paid
                ? {
                    background: "oklch(0.72 0.18 140 / 0.15)",
                    color: "oklch(0.35 0.15 140)",
                    border: "none",
                  }
                : {
                    background: "oklch(0.72 0.15 55 / 0.18)",
                    color: "oklch(0.45 0.16 55)",
                    border: "none",
                  }
            }
          >
            {paid ? (
              <CheckCircle2 className="h-3 w-3 mr-1 inline-block" />
            ) : (
              <Clock className="h-3 w-3 mr-1 inline-block" />
            )}
            {paid ? "Paid" : "Pending"}
          </Badge>
        </div>

        <Separator />

        {/* Body */}
        <div className="p-5 space-y-4">
          {paid ? (
            /* Paid state */
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="font-medium text-foreground">
                  {paymentMethod ?? "—"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={markPending}
                disabled={setAdmissionFee.isPending}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                data-ocid="mark-pending-btn"
              >
                Mark as Pending
              </Button>
            </div>
          ) : (
            /* Unpaid state — payment options */
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select payment method to mark as received:
              </p>
              <div className="flex flex-wrap gap-3">
                {/* PhonePe / UPI button */}
                <Button
                  size="sm"
                  onClick={() => setShowQr(true)}
                  className="font-semibold gap-2"
                  style={{
                    background: "oklch(0.42 0.22 291)",
                    color: "oklch(0.99 0 0)",
                  }}
                  data-ocid="pay-upi-btn"
                >
                  <QrCode className="h-4 w-4" />
                  PhonePe / UPI
                </Button>

                {/* Cash button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markPaid("Cash")}
                  disabled={setAdmissionFee.isPending}
                  className="gap-2"
                  data-ocid="pay-cash-btn"
                >
                  <Banknote className="h-4 w-4" />
                  Mark Cash Paid
                </Button>
              </div>

              {/* Cash label note */}
              <p className="text-xs text-muted-foreground">
                For cash payments, collect ₹300 and click{" "}
                <strong>Mark Cash Paid</strong>.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* PhonePe QR Dialog */}
      <Dialog open={showQr} onOpenChange={setShowQr}>
        <DialogContent className="max-w-xs" data-ocid="phonepe-qr-dialog">
          <DialogHeader>
            <DialogTitle className="text-center">Pay via PhonePe</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <PaymentQR name="Pankaj Kumar Ojha" amount={300} />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full font-semibold"
              style={{
                background: "oklch(0.42 0.22 291)",
                color: "oklch(0.99 0 0)",
              }}
              onClick={() => markPaid("UPI")}
              disabled={setAdmissionFee.isPending}
              data-ocid="confirm-upi-btn"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {setAdmissionFee.isPending
                ? "Saving..."
                : "Confirm Payment Received"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowQr(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
