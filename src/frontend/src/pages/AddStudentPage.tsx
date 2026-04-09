import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateStudent } from "../hooks/useStudents";
import { ALL_CLASSES } from "../types";

interface FormState {
  name: string;
  mobileNumber: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  class_: string;
}

const initial: FormState = {
  name: "",
  mobileNumber: "",
  dateOfBirth: "",
  fatherName: "",
  motherName: "",
  class_: "",
};

export default function AddStudentPage() {
  const navigate = useNavigate();
  const createStudent = useCreateStudent();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const set = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.mobileNumber.match(/^\d{10}$/))
      errs.mobileNumber = "Enter a valid 10-digit mobile number";
    if (!form.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!form.fatherName.trim()) errs.fatherName = "Father's name is required";
    if (!form.motherName.trim()) errs.motherName = "Mother's name is required";
    if (!form.class_) errs.class_ = "Select a class";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedClass = ALL_CLASSES.find((c) => c.label === form.class_);
    if (!selectedClass) return;

    try {
      const student = await createStudent.mutateAsync({
        name: form.name.trim(),
        mobileNumber: form.mobileNumber.trim(),
        dateOfBirth: form.dateOfBirth,
        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        class: selectedClass.value,
      });
      toast.success("Student added successfully!");
      navigate({
        to: "/students/$studentId",
        params: { studentId: student.id?.toString() ?? "" },
      });
    } catch {
      toast.error("Failed to add student. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5" data-ocid="add-student-page">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Add New Student
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the student's details to create a new admission record.
        </p>
      </div>

      <Card className="p-6 border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name + Mobile */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                data-ocid="input-name"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="10-digit number"
                value={form.mobileNumber}
                onChange={(e) =>
                  set("mobileNumber", e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                data-ocid="input-mobile"
              />
              {errors.mobileNumber && (
                <p className="text-xs text-destructive">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: DOB + Class */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                data-ocid="input-dob"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Class *</Label>
              <Select
                value={form.class_}
                onValueChange={(v) => set("class_", v)}
              >
                <SelectTrigger data-ocid="select-class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CLASSES.map((c) => (
                    <SelectItem key={c.label} value={c.label}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class_ && (
                <p className="text-xs text-destructive">{errors.class_}</p>
              )}
            </div>
          </div>

          {/* Row 3: Father + Mother */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="father">Father's Name *</Label>
              <Input
                id="father"
                placeholder="Father's full name"
                value={form.fatherName}
                onChange={(e) => set("fatherName", e.target.value)}
                data-ocid="input-father"
              />
              {errors.fatherName && (
                <p className="text-xs text-destructive">{errors.fatherName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mother">Mother's Name *</Label>
              <Input
                id="mother"
                placeholder="Mother's full name"
                value={form.motherName}
                onChange={(e) => set("motherName", e.target.value)}
                data-ocid="input-mother"
              />
              {errors.motherName && (
                <p className="text-xs text-destructive">{errors.motherName}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/students" })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createStudent.isPending}
              style={{
                background: "oklch(0.62 0.18 55)",
                color: "oklch(0.15 0.05 245)",
              }}
              className="font-semibold"
              data-ocid="submit-add-student"
            >
              {createStudent.isPending ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
