import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  PaymentMethod,
  PaymentStatus,
  StudentClass,
  StudentId,
  StudentPublic,
} from "../types";
import { useAuth } from "./useAuth";

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useStudents() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  return useQuery<StudentPublic[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor || !token) return [];
      return actor.listStudents(token);
    },
    enabled: !!actor && !!token,
  });
}

export function useStudent(id: StudentId | null) {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  return useQuery<StudentPublic | null>({
    queryKey: ["student", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null || !token) return null;
      return actor.getStudent(token, id);
    },
    enabled: !!actor && id !== null && !!token,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateStudent() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      mobileNumber: string;
      dateOfBirth: string;
      fatherName: string;
      motherName: string;
      class: StudentClass;
    }) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.createStudent(token, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      id: StudentId;
      name: string;
      mobileNumber: string;
      dateOfBirth: string;
      fatherName: string;
      motherName: string;
      class: StudentClass;
    }) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.updateStudent(token, req);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: StudentId) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.deleteStudent(token, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useSetAdmissionFeeStatus() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      paymentMethod,
    }: {
      id: StudentId;
      status: PaymentStatus;
      paymentMethod: PaymentMethod | null;
    }) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.setAdmissionFeeStatus(token, id, status, paymentMethod);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}

export function useSetMonthlyFeeStatus() {
  const { actor } = useActor(createActor);
  const { token } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      month,
      status,
    }: {
      id: StudentId;
      month: string;
      status: PaymentStatus;
    }) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.setMonthlyFeeStatus(token, id, month, status);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}
