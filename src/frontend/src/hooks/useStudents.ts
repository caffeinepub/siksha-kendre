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

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useStudents() {
  const { actor } = useActor(createActor);
  return useQuery<StudentPublic[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents();
    },
    enabled: !!actor,
  });
}

export function useStudent(id: StudentId | null) {
  const { actor } = useActor(createActor);
  return useQuery<StudentPublic | null>({
    queryKey: ["student", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && id !== null,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateStudent() {
  const { actor } = useActor(createActor);
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
      if (!actor) throw new Error("Not connected");
      return actor.createStudent(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
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
      if (!actor) throw new Error("Not connected");
      return actor.updateStudent(req);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: StudentId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStudent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useSetAdmissionFeeStatus() {
  const { actor } = useActor(createActor);
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
      if (!actor) throw new Error("Not connected");
      return actor.setAdmissionFeeStatus(id, status, paymentMethod);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}

export function useSetMonthlyFeeStatus() {
  const { actor } = useActor(createActor);
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
      if (!actor) throw new Error("Not connected");
      return actor.setMonthlyFeeStatus(id, month, status);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
    },
  });
}
