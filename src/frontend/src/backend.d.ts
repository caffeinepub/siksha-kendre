import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AuthResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface StudentPublic {
    id: StudentId;
    admissionFee: AdmissionFee;
    dateOfBirth: string;
    class: StudentClass;
    name: string;
    motherName: string;
    mobileNumber: string;
    fatherName: string;
    monthlyFees: MonthlyFee;
}
export interface SessionInfo {
    username: string;
    role: UserRole;
}
export interface AdmissionFee {
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
}
export interface UpdateStudentRequest {
    id: StudentId;
    dateOfBirth: string;
    class: StudentClass;
    name: string;
    motherName: string;
    mobileNumber: string;
    fatherName: string;
}
export interface StaffInfo {
    username: string;
    role: UserRole;
}
export type StudentId = bigint;
export interface MonthlyFee {
    apr: PaymentStatus;
    aug: PaymentStatus;
    dec: PaymentStatus;
    feb: PaymentStatus;
    jan: PaymentStatus;
    jul: PaymentStatus;
    jun: PaymentStatus;
    mar: PaymentStatus;
    may: PaymentStatus;
    nov: PaymentStatus;
    oct: PaymentStatus;
    sep: PaymentStatus;
}
export interface CreateStudentRequest {
    dateOfBirth: string;
    class: StudentClass;
    name: string;
    motherName: string;
    mobileNumber: string;
    fatherName: string;
}
export enum PaymentMethod {
    UPI = "UPI",
    Cash = "Cash"
}
export enum PaymentStatus {
    Paid = "Paid",
    Pending = "Pending"
}
export enum StudentClass {
    Class1 = "Class1",
    Class2 = "Class2",
    Class3 = "Class3",
    Class4 = "Class4",
    Class5 = "Class5",
    Nursery = "Nursery"
}
export enum UserRole {
    admin = "admin",
    staff = "staff"
}
export interface backendInterface {
    createStaff(adminToken: string, username: string, password: string): Promise<AuthResult>;
    createStudent(token: string, req: CreateStudentRequest): Promise<StudentPublic>;
    deleteStaff(adminToken: string, username: string): Promise<boolean>;
    deleteStudent(token: string, id: StudentId): Promise<boolean>;
    getSession(token: string): Promise<SessionInfo | null>;
    getStudent(token: string, id: StudentId): Promise<StudentPublic | null>;
    listStaff(adminToken: string): Promise<Array<StaffInfo>>;
    listStudents(token: string): Promise<Array<StudentPublic>>;
    login(username: string, password: string): Promise<AuthResult>;
    logout(token: string): Promise<void>;
    setAdmissionFeeStatus(token: string, id: StudentId, status: PaymentStatus, paymentMethod: PaymentMethod | null): Promise<boolean>;
    setMonthlyFeeStatus(token: string, id: StudentId, month: string, status: PaymentStatus): Promise<boolean>;
    signup(username: string, password: string): Promise<AuthResult>;
    updateStudent(token: string, req: UpdateStudentRequest): Promise<boolean>;
}
