// Import enums directly from the generated backend bindings
import {
  type AdmissionFee,
  type MonthlyFee,
  PaymentMethod,
  PaymentStatus,
  StudentClass,
  type StudentId,
  type StudentPublic,
} from "./backend";

export { PaymentMethod, PaymentStatus, StudentClass };

export type { StudentId, MonthlyFee, AdmissionFee, StudentPublic };

export interface CreateStudentInput {
  name: string;
  mobileNumber: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  class: StudentClass;
}

export interface UpdateStudentInput {
  id: StudentId;
  name: string;
  mobileNumber: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  class: StudentClass;
}

// Helper: display label for class
export function classLabel(cls: StudentClass): string {
  if (cls === StudentClass.Nursery) return "Nursery";
  if (cls === StudentClass.Class1) return "Class I";
  if (cls === StudentClass.Class2) return "Class II";
  if (cls === StudentClass.Class3) return "Class III";
  if (cls === StudentClass.Class4) return "Class IV";
  if (cls === StudentClass.Class5) return "Class V";
  return "Unknown";
}

export function isPaid(status: PaymentStatus): boolean {
  return status === PaymentStatus.Paid;
}

export const ALL_CLASSES: { label: string; value: StudentClass }[] = [
  { label: "Nursery", value: StudentClass.Nursery },
  { label: "Class I", value: StudentClass.Class1 },
  { label: "Class II", value: StudentClass.Class2 },
  { label: "Class III", value: StudentClass.Class3 },
  { label: "Class IV", value: StudentClass.Class4 },
  { label: "Class V", value: StudentClass.Class5 },
];

export const MONTH_KEYS: (keyof MonthlyFee)[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const MONTH_LABELS: Record<keyof MonthlyFee, string> = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};
