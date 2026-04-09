import type { AuthResult, backendInterface, SessionInfo, StaffInfo } from "../backend";
import { PaymentMethod, PaymentStatus, StudentClass, UserRole } from "../backend";

const MOCK_TOKEN = "mock-admin-token-123";

export const mockBackend: backendInterface = {
  signup: async (_username: string, _password: string): Promise<AuthResult> => ({
    __kind__: "ok",
    ok: MOCK_TOKEN,
  }),

  login: async (_username: string, _password: string): Promise<AuthResult> => ({
    __kind__: "ok",
    ok: MOCK_TOKEN,
  }),

  logout: async (_token: string): Promise<void> => {
    return undefined;
  },

  getSession: async (token: string): Promise<SessionInfo | null> => {
    if (token === MOCK_TOKEN) {
      return { username: "admin", role: UserRole.admin };
    }
    return null;
  },

  createStaff: async (
    _adminToken: string,
    _username: string,
    _password: string,
  ): Promise<AuthResult> => ({
    __kind__: "ok",
    ok: "new-staff-token",
  }),

  listStaff: async (_adminToken: string): Promise<StaffInfo[]> => [
    { username: "admin", role: UserRole.admin },
    { username: "staff1", role: UserRole.staff },
  ],

  deleteStaff: async (_adminToken: string, _username: string): Promise<boolean> => true,

  createStudent: async (_token: string, req) => ({
    id: BigInt(3),
    name: req.name,
    mobileNumber: req.mobileNumber,
    dateOfBirth: req.dateOfBirth,
    class: req.class,
    fatherName: req.fatherName,
    motherName: req.motherName,
    admissionFee: { status: PaymentStatus.Pending },
    monthlyFees: {
      jan: PaymentStatus.Pending,
      feb: PaymentStatus.Pending,
      mar: PaymentStatus.Pending,
      apr: PaymentStatus.Pending,
      may: PaymentStatus.Pending,
      jun: PaymentStatus.Pending,
      jul: PaymentStatus.Pending,
      aug: PaymentStatus.Pending,
      sep: PaymentStatus.Pending,
      oct: PaymentStatus.Pending,
      nov: PaymentStatus.Pending,
      dec: PaymentStatus.Pending,
    },
  }),

  deleteStudent: async (_token: string, _id) => true,

  getStudent: async (_token: string, _id) => ({
    id: BigInt(1),
    name: "Ravi Kumar Sharma",
    mobileNumber: "9876543210",
    dateOfBirth: "2015-06-12",
    class: StudentClass.Class3,
    fatherName: "Rajesh Kumar Sharma",
    motherName: "Sunita Sharma",
    admissionFee: { status: PaymentStatus.Paid, paymentMethod: PaymentMethod.UPI },
    monthlyFees: {
      jan: PaymentStatus.Paid,
      feb: PaymentStatus.Paid,
      mar: PaymentStatus.Paid,
      apr: PaymentStatus.Paid,
      may: PaymentStatus.Paid,
      jun: PaymentStatus.Pending,
      jul: PaymentStatus.Pending,
      aug: PaymentStatus.Pending,
      sep: PaymentStatus.Pending,
      oct: PaymentStatus.Pending,
      nov: PaymentStatus.Pending,
      dec: PaymentStatus.Pending,
    },
  }),

  listStudents: async (_token: string) => [
    {
      id: BigInt(1),
      name: "Ravi Kumar Sharma",
      mobileNumber: "9876543210",
      dateOfBirth: "2015-06-12",
      class: StudentClass.Class3,
      fatherName: "Rajesh Kumar Sharma",
      motherName: "Sunita Sharma",
      admissionFee: { status: PaymentStatus.Paid, paymentMethod: PaymentMethod.UPI },
      monthlyFees: {
        jan: PaymentStatus.Paid,
        feb: PaymentStatus.Paid,
        mar: PaymentStatus.Paid,
        apr: PaymentStatus.Paid,
        may: PaymentStatus.Paid,
        jun: PaymentStatus.Pending,
        jul: PaymentStatus.Pending,
        aug: PaymentStatus.Pending,
        sep: PaymentStatus.Pending,
        oct: PaymentStatus.Pending,
        nov: PaymentStatus.Pending,
        dec: PaymentStatus.Pending,
      },
    },
    {
      id: BigInt(2),
      name: "Priya Singh",
      mobileNumber: "9123456780",
      dateOfBirth: "2017-03-22",
      class: StudentClass.Nursery,
      fatherName: "Suresh Singh",
      motherName: "Meena Singh",
      admissionFee: { status: PaymentStatus.Pending },
      monthlyFees: {
        jan: PaymentStatus.Paid,
        feb: PaymentStatus.Paid,
        mar: PaymentStatus.Pending,
        apr: PaymentStatus.Pending,
        may: PaymentStatus.Pending,
        jun: PaymentStatus.Pending,
        jul: PaymentStatus.Pending,
        aug: PaymentStatus.Pending,
        sep: PaymentStatus.Pending,
        oct: PaymentStatus.Pending,
        nov: PaymentStatus.Pending,
        dec: PaymentStatus.Pending,
      },
    },
    {
      id: BigInt(3),
      name: "Amit Verma",
      mobileNumber: "9988776655",
      dateOfBirth: "2013-09-08",
      class: StudentClass.Class5,
      fatherName: "Vinod Verma",
      motherName: "Kavita Verma",
      admissionFee: { status: PaymentStatus.Paid, paymentMethod: PaymentMethod.Cash },
      monthlyFees: {
        jan: PaymentStatus.Paid,
        feb: PaymentStatus.Paid,
        mar: PaymentStatus.Paid,
        apr: PaymentStatus.Paid,
        may: PaymentStatus.Paid,
        jun: PaymentStatus.Paid,
        jul: PaymentStatus.Paid,
        aug: PaymentStatus.Paid,
        sep: PaymentStatus.Paid,
        oct: PaymentStatus.Pending,
        nov: PaymentStatus.Pending,
        dec: PaymentStatus.Pending,
      },
    },
  ],

  setAdmissionFeeStatus: async () => true,

  setMonthlyFeeStatus: async () => true,

  updateStudent: async () => true,
};
