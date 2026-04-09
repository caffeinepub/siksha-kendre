import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdmissionFeeSection } from "../components/AdmissionFeeSection";
import { MonthlyFeeTracker } from "../components/MonthlyFeeTracker";
import {
  useDeleteStudent,
  useStudent,
  useUpdateStudent,
} from "../hooks/useStudents";
import { ALL_CLASSES, classLabel } from "../types";
import type { StudentPublic } from "../types";

// ─── Edit form ───────────────────────────────────────────────────────────────

function EditStudentForm({
  student,
  onDone,
}: {
  student: StudentPublic;
  onDone: () => void;
}) {
  const updateStudent = useUpdateStudent();
  const [form, setForm] = useState({
    name: student.name,
    mobileNumber: student.mobileNumber,
    dateOfBirth: student.dateOfBirth,
    fatherName: student.fatherName,
    motherName: student.motherName,
    class_: classLabel(student.class),
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    const cls = ALL_CLASSES.find((c) => c.label === form.class_);
    if (!cls) return;
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        name: form.name,
        mobileNumber: form.mobileNumber,
        dateOfBirth: form.dateOfBirth,
        fatherName: form.fatherName,
        motherName: form.motherName,
        class: cls.value,
      });
      toast.success("Student record updated!");
      onDone();
    } catch {
      toast.error("Failed to update student");
    }
  };

  return (
    <Card className="p-5 border shadow-xs space-y-4">
      <h3 className="font-semibold text-foreground">Edit Student Details</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {(
          [
            { id: "name", label: "Name", field: "name" },
            { id: "mobile", label: "Mobile", field: "mobileNumber" },
            {
              id: "dob",
              label: "Date of Birth",
              field: "dateOfBirth",
              type: "date",
            },
            { id: "father", label: "Father's Name", field: "fatherName" },
            { id: "mother", label: "Mother's Name", field: "motherName" },
          ] as {
            id: string;
            label: string;
            field: keyof typeof form;
            type?: string;
          }[]
        ).map(({ id, label, field, type }) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type={type ?? "text"}
              value={form[field]}
              onChange={(e) => set(field, e.target.value)}
              data-ocid={`edit-${field}`}
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <Label>Class</Label>
          <Select value={form.class_} onValueChange={(v) => set("class_", v)}>
            <SelectTrigger data-ocid="edit-class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_CLASSES.map((c) => (
                <SelectItem key={c.label} value={c.label}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={updateStudent.isPending}
          style={{
            background: "oklch(0.32 0.12 245)",
            color: "oklch(0.99 0 0)",
          }}
          className="font-semibold"
          data-ocid="save-student-btn"
        >
          {updateStudent.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function StudentDetailPage() {
  const { studentId } = useParams({ from: "/layout/students/$studentId" });
  const navigate = useNavigate();
  const id = BigInt(studentId);
  const { data: student, isLoading } = useStudent(id);
  const deleteStudent = useDeleteStudent();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteStudent.mutateAsync(id);
      toast.success("Student record deleted");
      navigate({ to: "/students" });
    } catch {
      toast.error("Failed to delete student");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (!student) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="not-found"
      >
        <p className="text-lg font-semibold text-foreground">
          Student not found
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate({ to: "/students" })}
        >
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto space-y-5"
      data-ocid="student-detail-page"
    >
      {/* Back + title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/students" })}
            data-ocid="back-btn"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {student.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {classLabel(student.class)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
            data-ocid="edit-toggle-btn"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            data-ocid="delete-btn"
            aria-label="Delete student"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Student info card */}
      {!editing && (
        <Card className="p-5 border shadow-xs">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Mobile Number", value: student.mobileNumber },
              { label: "Date of Birth", value: student.dateOfBirth },
              { label: "Father's Name", value: student.fatherName },
              { label: "Mother's Name", value: student.motherName },
              { label: "Class", value: classLabel(student.class) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {editing && (
        <EditStudentForm student={student} onDone={() => setEditing(false)} />
      )}

      {/* Admission fee — extracted component */}
      <AdmissionFeeSection student={student} />

      {/* Monthly fee tracker — extracted component */}
      <MonthlyFeeTracker student={student} />

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student Record?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete <strong>{student.name}</strong>'s
            record and all associated fee data. This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStudent.isPending}
              data-ocid="confirm-delete-btn"
            >
              {deleteStudent.isPending ? "Deleting..." : "Delete Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
