// Backend service layer — wraps actor calls with type safety
// All mutations/queries go through useActor() in hooks, not this file directly.
// This file provides helper utilities for working with backend types.

import { PaymentMethod, PaymentStatus } from "../types";
import type { MonthlyFee } from "../types";

export function makePaid(): PaymentStatus {
  return PaymentStatus.Paid;
}

export function makePending(): PaymentStatus {
  return PaymentStatus.Pending;
}

export function makeUPI(): PaymentMethod {
  return PaymentMethod.UPI;
}

export function makeCash(): PaymentMethod {
  return PaymentMethod.Cash;
}

export function makeDefaultMonthlyFees(): MonthlyFee {
  const pending = PaymentStatus.Pending;
  return {
    jan: pending, feb: pending, mar: pending, apr: pending,
    may: pending, jun: pending, jul: pending, aug: pending,
    sep: pending, oct: pending, nov: pending, dec: pending,
  };
}
