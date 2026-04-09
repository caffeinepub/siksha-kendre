import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronRight,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteStudent, useStudents } from "../hooks/useStudents";
import { ALL_CLASSES, classLabel, isPaid } from "../types";
import type { StudentPublic } from "../types";

function StudentRow({
  student,
  onDeleteRequest,
}: {
  student: StudentPublic;
  onDeleteRequest: (id: bigint) => void;
}) {
  const paid = isPaid(student.admissionFee.status);

  return (
    <div
      className="relative flex items-center border-b border-border last:border-0 bg-card hover:bg-muted/40 transition-smooth"
      data-ocid={`student-row-${student.id}`}
    >
      <Link
        to="/students/$studentId"
        params={{ studentId: student.id.toString() }}
        className="flex items-center gap-4 flex-1 min-w-0 px-4 py-4"
      >
        {/* Avatar */}
        <div
          className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
          style={{
            background: "oklch(0.18 0.09 245 / 0.12)",
            color: "oklch(0.32 0.12 245)",
          }}
        >
          {student.name.charAt(0).toUpperCase()}
        </div>
        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{student.name}</p>
          <p className="text-xs text-muted-foreground">
            {classLabel(student.class)} &bull;{" "}
            <span className="font-mono">{student.mobileNumber}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge
            className="text-xs"
            style={
              paid
                ? {
                    background: "oklch(0.72 0.18 140 / 0.15)",
                    color: "oklch(0.40 0.15 140)",
                    border: "none",
                  }
                : {
                    background: "oklch(0.72 0.18 55 / 0.15)",
                    color: "oklch(0.50 0.18 55)",
                    border: "none",
                  }
            }
          >
            {paid ? "Fee Paid" : "Fee Pending"}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Link>
      <button
        type="button"
        className="mr-3 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth flex-shrink-0"
        onClick={() => onDeleteRequest(student.id)}
        aria-label={`Delete ${student.name}`}
        data-ocid={`delete-btn-${student.id}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function StudentsListPage() {
  const { data: students, isLoading } = useStudents();
  const deleteStudent = useDeleteStudent();

  const [nameSearch, setNameSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<bigint | null>(null);

  const filtered = (students ?? []).filter((s: StudentPublic) => {
    const matchName =
      !nameSearch ||
      s.name.toLowerCase().includes(nameSearch.toLowerCase().trim());
    const matchMobile =
      !mobileSearch || s.mobileNumber.includes(mobileSearch.trim());
    const matchClass =
      classFilter === "all" || classLabel(s.class) === classFilter;
    return matchName && matchMobile && matchClass;
  });

  function handleDelete(id: bigint) {
    deleteStudent.mutate(id, {
      onSuccess: () => {
        toast.success("Student deleted");
        setPendingDeleteId(null);
      },
      onError: () => toast.error("Failed to delete student"),
    });
  }

  const pendingStudent =
    pendingDeleteId !== null
      ? (students ?? []).find((s) => s.id === pendingDeleteId)
      : undefined;

  return (
    <div className="space-y-5" data-ocid="students-list-page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Student Records
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {students?.length ?? 0} students enrolled
          </p>
        </div>
        <Button
          asChild
          style={{
            background: "oklch(0.62 0.18 55)",
            color: "oklch(0.15 0.05 245)",
          }}
          className="font-semibold"
          data-ocid="add-student-btn"
        >
          <Link to="/students/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="pl-9"
            data-ocid="search-name-input"
          />
        </div>
        <div className="relative flex-1 sm:max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by mobile..."
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value.replace(/\D/g, ""))}
            className="pl-9 font-mono"
            maxLength={10}
            data-ocid="search-mobile-input"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger
            className="w-full sm:w-40"
            data-ocid="class-filter-select"
          >
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {ALL_CLASSES.map((c) => (
              <SelectItem key={c.label} value={c.label}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Delete confirmation banner */}
      {pendingStudent && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-destructive/40 bg-destructive/5">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span>
              Delete <strong>{pendingStudent.name}</strong>? This cannot be
              undone.
            </span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="destructive"
              disabled={deleteStudent.isPending}
              onClick={() => handleDelete(pendingStudent.id)}
              data-ocid="confirm-delete-btn"
            >
              {deleteStudent.isPending ? "Deleting..." : "Confirm"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPendingDeleteId(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-xs">
        {isLoading ? (
          <div className="divide-y divide-border">
            {["sk1", "sk2", "sk3", "sk4", "sk5"].map((key) => (
              <div key={key} className="px-4 py-4">
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="empty-state-students"
          >
            <Users className="h-12 w-12 text-muted-foreground mb-3 opacity-30" />
            <p className="font-medium text-foreground">No students found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {nameSearch || mobileSearch || classFilter !== "all"
                ? "Try adjusting your filters."
                : "Add your first student to get started."}
            </p>
            {!nameSearch && !mobileSearch && classFilter === "all" && (
              <Button
                asChild
                size="sm"
                className="mt-4"
                style={{
                  background: "oklch(0.62 0.18 55)",
                  color: "oklch(0.15 0.05 245)",
                }}
              >
                <Link to="/students/new">Add first student</Link>
              </Button>
            )}
          </div>
        ) : (
          filtered.map((s) => (
            <StudentRow
              key={s.id.toString()}
              student={s}
              onDeleteRequest={(id) => setPendingDeleteId(id)}
            />
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {students?.length ?? 0} students
        </p>
      )}
    </div>
  );
}
