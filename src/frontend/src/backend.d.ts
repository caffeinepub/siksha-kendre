import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type StudentId = bigint;
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
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignRole(user: Principal, role: UserRole): Promise<void>;
    createStudent(req: CreateStudentRequest): Promise<StudentPublic>;
    deleteStudent(id: StudentId): Promise<boolean>;
    getMyRole(): Promise<UserRole>;
    getStudent(id: StudentId): Promise<StudentPublic | null>;
    listStudents(): Promise<Array<StudentPublic>>;
    login(): Promise<UserRole>;
    setAdmissionFeeStatus(id: StudentId, status: PaymentStatus, paymentMethod: PaymentMethod | null): Promise<boolean>;
    setMonthlyFeeStatus(id: StudentId, month: string, status: PaymentStatus): Promise<boolean>;
    updateStudent(req: UpdateStudentRequest): Promise<boolean>;
}
