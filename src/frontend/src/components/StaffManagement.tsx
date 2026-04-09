import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { StaffInfo } from "../backend.d";
import { UserRole } from "../backend.d";
import { useAuth } from "../hooks/useAuth";

export default function StaffManagement() {
  const { actor } = useActor(createActor);
  const { token, role } = useAuth();
  const qc = useQueryClient();

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isAdmin = role === UserRole.admin;

  const { data: staffList, isLoading } = useQuery<StaffInfo[]>({
    queryKey: ["staffList"],
    queryFn: async () => {
      if (!actor || !token) return [];
      return actor.listStaff(token);
    },
    enabled: !!actor && !!token && isAdmin,
  });

  const createStaff = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.createStaff(token, username, password);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "err") {
        setFormError(result.err);
        return;
      }
      setNewUsername("");
      setNewPassword("");
      setFormError(null);
      qc.invalidateQueries({ queryKey: ["staffList"] });
      toast.success("Staff account created successfully.");
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  const deleteStaff = useMutation({
    mutationFn: async (username: string) => {
      if (!actor || !token) throw new Error("Not connected");
      return actor.deleteStaff(token, username);
    },
    onSuccess: (ok, username) => {
      if (!ok) {
        toast.error("Failed to delete staff account.");
        return;
      }
      qc.invalidateQueries({ queryKey: ["staffList"] });
      toast.success(`Staff account "${username}" removed.`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newUsername.trim()) {
      setFormError("Username is required.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    createStaff.mutate({ username: newUsername.trim(), password: newPassword });
  };

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="staff-access-denied"
      >
        <Shield
          className="h-12 w-12"
          style={{ color: "oklch(0.72 0.18 55)" }}
        />
        <p
          className="text-lg font-medium"
          style={{ color: "oklch(0.65 0.04 245)" }}
        >
          Admin access required
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="staff-management">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6" style={{ color: "oklch(0.72 0.18 55)" }} />
        <h1
          className="text-2xl font-bold font-display"
          style={{ color: "oklch(0.92 0.03 245)" }}
        >
          Staff Management
        </h1>
      </div>

      {/* Add new staff */}
      <Card
        className="p-6 border"
        style={{
          background: "oklch(0.21 0.08 245)",
          borderColor: "oklch(0.28 0.06 245)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserPlus
            className="h-5 w-5"
            style={{ color: "oklch(0.72 0.18 55)" }}
          />
          <h2
            className="text-lg font-semibold"
            style={{ color: "oklch(0.88 0.04 245)" }}
          >
            Add Staff Account
          </h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="staff-username"
                className="text-sm"
                style={{ color: "oklch(0.75 0.04 245)" }}
              >
                Username
              </Label>
              <Input
                id="staff-username"
                type="text"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={createStaff.isPending}
                style={{
                  background: "oklch(0.25 0.07 245)",
                  borderColor: "oklch(0.35 0.06 245)",
                  color: "oklch(0.92 0.03 245)",
                }}
                data-ocid="staff-username-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="staff-password"
                className="text-sm"
                style={{ color: "oklch(0.75 0.04 245)" }}
              >
                Password
              </Label>
              <Input
                id="staff-password"
                type="password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={createStaff.isPending}
                style={{
                  background: "oklch(0.25 0.07 245)",
                  borderColor: "oklch(0.35 0.06 245)",
                  color: "oklch(0.92 0.03 245)",
                }}
                data-ocid="staff-password-input"
              />
            </div>
          </div>

          {formError && (
            <div
              className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm"
              style={{
                background: "oklch(0.25 0.08 20)",
                color: "oklch(0.88 0.08 25)",
                border: "1px solid oklch(0.45 0.14 20)",
              }}
              role="alert"
            >
              <AlertCircle
                className="h-4 w-4 mt-0.5 flex-shrink-0"
                aria-hidden
              />
              <span>{formError}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={createStaff.isPending}
            className="font-semibold transition-smooth"
            style={{
              background: "oklch(0.62 0.18 55)",
              color: "oklch(0.15 0.05 245)",
            }}
            data-ocid="add-staff-btn"
          >
            {createStaff.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Staff
              </span>
            )}
          </Button>
        </form>
      </Card>

      {/* Staff list */}
      <Card
        className="border overflow-hidden"
        style={{
          background: "oklch(0.21 0.08 245)",
          borderColor: "oklch(0.28 0.06 245)",
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "oklch(0.28 0.06 245)" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "oklch(0.88 0.04 245)" }}
          >
            All Accounts
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
          </div>
        ) : !staffList || staffList.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 gap-3"
            data-ocid="staff-empty-state"
          >
            <Users
              className="h-10 w-10 opacity-30"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 245)" }}>
              No staff accounts yet.
            </p>
          </div>
        ) : (
          <ul
            className="divide-y"
            style={{ borderColor: "oklch(0.28 0.06 245)" }}
          >
            {staffList.map((staff) => (
              <li
                key={staff.username}
                className="flex items-center justify-between px-6 py-4"
                data-ocid={`staff-row-${staff.username}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                    style={{
                      background: "oklch(0.62 0.18 55 / 0.2)",
                      color: "oklch(0.72 0.18 55)",
                    }}
                  >
                    {staff.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-medium truncate"
                      style={{ color: "oklch(0.9 0.03 245)" }}
                    >
                      {staff.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <Badge
                    variant={
                      staff.role === UserRole.admin ? "default" : "secondary"
                    }
                    className="text-xs capitalize"
                  >
                    {staff.role}
                  </Badge>
                  {staff.role !== UserRole.admin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStaff.mutate(staff.username)}
                      disabled={deleteStaff.isPending}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      aria-label={`Remove ${staff.username}`}
                      data-ocid={`delete-staff-${staff.username}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
