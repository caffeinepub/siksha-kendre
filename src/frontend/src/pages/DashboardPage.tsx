import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Clock, IndianRupee, UserPlus, Users } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import { classLabel, isPaid } from "../types";
import type { StudentPublic } from "../types";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 p-5 border shadow-xs">
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          background: accent
            ? "oklch(0.72 0.18 55 / 0.15)"
            : "oklch(0.18 0.09 245 / 0.08)",
        }}
      >
        <Icon
          className="h-5 w-5"
          style={{
            color: accent ? "oklch(0.62 0.18 55)" : "oklch(0.32 0.12 245)",
          }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold font-display text-foreground">
          {value}
        </p>
      </div>
    </Card>
  );
}

function AdmissionRow({ student }: { student: StudentPublic }) {
  const paid = isPaid(student.admissionFee.status);
  return (
    <Link
      to="/students/$studentId"
      params={{ studentId: student.id.toString() }}
      className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-smooth rounded-lg cursor-pointer"
      data-ocid="dashboard-student-row"
    >
      <div className="min-w-0">
        <p className="font-medium text-foreground text-sm truncate">
          {student.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {classLabel(student.class)}
        </p>
      </div>
      <Badge
        className="ml-3 flex-shrink-0"
        style={
          paid
            ? {
                background: "oklch(0.72 0.18 140 / 0.15)",
                color: "oklch(0.45 0.15 140)",
                border: "none",
              }
            : {
                background: "oklch(0.72 0.18 55 / 0.15)",
                color: "oklch(0.55 0.18 55)",
                border: "none",
              }
        }
      >
        {paid ? "Paid" : "Pending"}
      </Badge>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: students, isLoading } = useStudents();

  const total = students?.length ?? 0;
  const paid =
    students?.filter((s) => isPaid(s.admissionFee.status)).length ?? 0;
  const pending = total - paid;
  const recent = students?.slice(-5).reverse() ?? [];

  return (
    <div className="space-y-6" data-ocid="dashboard-page">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of student admissions and fee collection
          </p>
        </div>
        <Button
          asChild
          style={{
            background: "oklch(0.62 0.18 55)",
            color: "oklch(0.15 0.05 245)",
          }}
          className="font-semibold"
          data-ocid="add-student-cta"
        >
          <Link to="/students/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4"].map((key) => (
            <Skeleton key={key} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value={total} />
          <StatCard icon={UserPlus} label="New Admissions" value={total} />
          <StatCard
            icon={IndianRupee}
            label="Admission Paid"
            value={paid}
            accent
          />
          <StatCard icon={Clock} label="Fee Pending" value={pending} />
        </div>
      )}

      {/* Recent admissions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border shadow-xs">
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "oklch(0.88 0.01 0)" }}
          >
            <h3 className="font-semibold text-foreground">Recent Admissions</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/students"
                className="text-xs"
                data-ocid="view-all-students"
              >
                View all →
              </Link>
            </Button>
          </div>
          <div className="p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {["r1", "r2", "r3"].map((key) => (
                  <Skeleton key={key} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 text-center"
                data-ocid="empty-state-recent"
              >
                <Users className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">No students yet</p>
                <Button
                  asChild
                  size="sm"
                  className="mt-3"
                  style={{
                    background: "oklch(0.62 0.18 55)",
                    color: "oklch(0.15 0.05 245)",
                  }}
                >
                  <Link to="/students/new">Add first student</Link>
                </Button>
              </div>
            ) : (
              recent.map((s) => (
                <AdmissionRow key={s.id.toString()} student={s} />
              ))
            )}
          </div>
        </Card>

        {/* Fee summary by class */}
        <Card className="overflow-hidden border shadow-xs">
          <div
            className="flex items-center px-5 py-4 border-b"
            style={{ borderColor: "oklch(0.88 0.01 0)" }}
          >
            <h3 className="font-semibold text-foreground">
              Admission Fee Summary
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Admission Fee (₹300/student)
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-semibold text-foreground">
                  ₹{(paid * 300).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full rounded-full h-2 bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-smooth"
                  style={{
                    width: total > 0 ? `${(paid / total) * 100}%` : "0%",
                    background: "oklch(0.62 0.18 55)",
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-semibold text-foreground">
                  ₹{(pending * 300).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
