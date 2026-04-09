import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

interface PaymentQRProps {
  /** Payee display name */
  name?: string;
  /** Amount in ₹ */
  amount?: number;
}

/**
 * Displays the PhonePe QR code for Pankaj Kumar Ojha.
 * Staff shows this to the parent/guardian to scan and pay.
 */
export function PaymentQR({
  name = "Pankaj Kumar Ojha",
  amount = 300,
}: PaymentQRProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR image */}
      <div
        className="relative rounded-2xl overflow-hidden border-2 shadow-md"
        style={{ borderColor: "oklch(0.52 0.22 291)" }}
      >
        <img
          src="/assets/generated/phonepe-qr-pankaj.dim_400x400.png"
          alt="PhonePe QR code for Pankaj Kumar Ojha"
          className="h-48 w-48 object-cover"
        />
        {/* PhonePe brand overlay strip */}
        <div
          className="absolute bottom-0 left-0 right-0 py-1 text-center text-xs font-semibold tracking-wide"
          style={{
            background: "oklch(0.42 0.22 291)",
            color: "oklch(0.99 0 0)",
          }}
        >
          PhonePe
        </div>
      </div>

      {/* Payee info */}
      <div className="text-center space-y-0.5">
        <p className="font-semibold text-foreground text-sm">{name}</p>
        <Badge
          className="text-xs"
          style={{
            background: "oklch(0.52 0.22 291 / 0.12)",
            color: "oklch(0.38 0.18 291)",
            border: "none",
          }}
        >
          <Smartphone className="h-3 w-3 mr-1 inline-block" />
          UPI · PhonePe
        </Badge>
      </div>

      {/* Amount */}
      <div
        className="w-full text-center rounded-lg py-2 px-6"
        style={{ background: "oklch(0.52 0.22 291 / 0.08)" }}
      >
        <span
          className="text-2xl font-bold"
          style={{ color: "oklch(0.38 0.18 291)" }}
        >
          ₹{amount}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">Admission Fee</p>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Scan with any UPI app — PhonePe, GPay, Paytm, BHIM
      </p>
    </div>
  );
}
