"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Plus, Edit, UserX, Loader2, Key, UserIcon, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";

interface StaffUser {
id: number;
username: string;
role: string;
createdAt: string;
updatedAt: string;
}

interface AccountSectionProps {
user: User | null;
}

export function AccountSection({ user }: AccountSectionProps) {
const [staffList, setStaffList] = useState<StaffUser[]>([]);
const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
const [isRegisteringUser, setIsRegisteringUser] = useState(false);
const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
const [isUpdatingStaff, setIsUpdatingStaff] = useState(false);
const [isDeletingStaff, setIsDeletingStaff] = useState(false);

const [newUser, setNewUser] = useState({ username: "", password: "" });
const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
const [staffForm, setStaffForm] = useState({
  username: "",
  password: "",
  role: "Staff",
});

const { toast } = useToast();

const fetchStaff = async () => {
  if (user?.role !== "Admin") return;
  try {
    const response = await fetch("/api/users");
    const data = await response.json();
    if (data.success) {
      setStaffList(data.users.filter((u: StaffUser) => u.role === "Staff"));
    }
  } catch (error) {
    console.error("Failed to fetch staff:", error);
  }
};

useEffect(() => {
  fetchStaff();
}, [user]);

const handleRegisterUser = async () => {
  if (!newUser.username.trim() || !newUser.password.trim()) {
    toast({
      title: "Validation Error",
      description: "Username and password are required",
      variant: "destructive",
    });
    return;
  }

  setIsRegisteringUser(true);
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUser.username,
        password: newUser.password,
        role: "Staff",
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "User Registered",
        description: `New staff account "${newUser.username}" created successfully`,
      });
      setNewUser({ username: "", password: "" });
      setIsRegisterDialogOpen(false);
      fetchStaff();
    } else {
      toast({
        title: "Registration Failed",
        description: data.error || "Failed to create user account",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Registration Error",
      description: "Failed to connect to server",
      variant: "destructive",
    });
  } finally {
    setIsRegisteringUser(false);
  }
};

const handleUpdatePassword = async () => {
  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    toast({
      title: "Validation Error",
      description: "All password fields are required",
      variant: "destructive",
    });
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast({
      title: "Password Mismatch",
      description: "New password and confirmation do not match",
      variant: "destructive",
    });
    return;
  }

  setIsUpdatingPassword(true);
  try {
    const response = await fetch("/api/auth/update-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        userId: user?.id,
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
    } else {
      toast({
        title: "Update Failed",
        description: data.error || "Failed to update password",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Update Error",
      description: "Failed to connect to server",
      variant: "destructive",
    });
  } finally {
    setIsUpdatingPassword(false);
  }
};

const handleUpdateStaff = async () => {
  if (!selectedStaff || !staffForm.username.trim()) {
    toast({
      title: "Validation Error",
      description: "Username is required",
      variant: "destructive",
    });
    return;
  }

  setIsUpdatingStaff(true);
  try {
    const response = await fetch(`/api/users/${selectedStaff.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: staffForm.username,
        password: staffForm.password,
        role: staffForm.role,
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Staff Updated",
        description: `Staff member "${staffForm.username}" updated successfully`,
      });
      setIsEditStaffDialogOpen(false);
      setSelectedStaff(null);
      fetchStaff();
    } else {
      toast({
        title: "Update Failed",
        description: data.error || "Failed to update staff member",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Update Error",
      description: "Failed to connect to server",
      variant: "destructive",
    });
  } finally {
    setIsUpdatingStaff(false);
  }
};

const handleDeleteStaff = async (staff: StaffUser) => {
  setIsDeletingStaff(true);
  try {
    const response = await fetch(`/api/users/${staff.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Staff Deleted",
        description: `Staff account "${staff.username}" has been permanently removed`,
      });
      fetchStaff();
    } else {
      toast({
        title: "Delete Failed",
        description: data.error || "Failed to delete staff account",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Delete Error",
      description: "Failed to connect to server",
      variant: "destructive",
    });
  } finally {
    setIsDeletingStaff(false);
  }
};

const openEditStaffDialog = (staff: StaffUser) => {
  setSelectedStaff(staff);
  setStaffForm({ username: staff.username, password: "", role: staff.role });
  setIsEditStaffDialogOpen(true);
};

return (
  <div className="space-y-6">
    {/* User Profile Section */}
    <Card className="brutal-card">
      <CardHeader className="brutal-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              User Profile
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">
              Current user information and account management
            </CardDescription>
          </div>
          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="brutal-button-secondary">
                <Key className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </DialogTrigger>
            <DialogContent className="brutal-card max-w-md mx-4">
              <DialogHeader>
                <DialogTitle className="font-bold text-primary uppercase tracking-wide">
                  Update Password
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Change your account password for security
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="currentPassword"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    Current
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="col-span-3 brutal-input"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="newPassword"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    New
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="col-span-3 brutal-input"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                  >
                    Confirm
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="col-span-3 brutal-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsPasswordDialogOpen(false)}
                  variant="outline"
                  className="brutal-button bg-white text-black border-3 border-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="brutal-button-secondary"
                >
                  {isUpdatingPassword ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-secondary/10 border-2 border-secondary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Username</h3>
              <p className="text-base font-semibold text-foreground">
                {user?.username}
              </p>
            </div>
            <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Role</h3>
              <p className="text-base font-semibold text-foreground">
                {user?.role}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/10 border-2 border-secondary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Created</h3>
              <p className="text-sm font-semibold text-foreground">
                {user ? new Date(user.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
            <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-sm">Last Updated</h3>
              <p className="text-sm font-semibold text-foreground">
                {user ? new Date(user.updatedAt).toLocaleDateString() : ""}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Staff Management */}
    {user?.role === "Admin" && (
      <>
        {/* User Registration */}
        <Card className="brutal-card">
          <CardHeader className="brutal-header-secondary">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Registration
                </CardTitle>
                <CardDescription className="text-white/90 font-medium">
                  Register new staff accounts (Admin only)
                </CardDescription>
              </div>
              <Dialog
                open={isRegisterDialogOpen}
                onOpenChange={setIsRegisterDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="brutal-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Register User
                  </Button>
                </DialogTrigger>
                <DialogContent className="brutal-card max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="font-bold text-primary uppercase tracking-wide">
                      Register New Staff
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                      Create a new staff account with default Staff role
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="newUsername"
                        className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                      >
                        Username
                      </Label>
                      <Input
                        id="newUsername"
                        value={newUser.username}
                        onChange={(e) =>
                          setNewUser({ ...newUser, username: e.target.value })
                        }
                        className="col-span-3 brutal-input"
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="newPassword"
                        className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
                      >
                        Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="col-span-3 brutal-input"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="p-3 bg-muted/50 border-2 border-gray-200 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                      <p className="text-sm font-semibold text-muted-foreground">
                        <span className="font-bold">Note:</span> New accounts will be created
                        with Staff role by default.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => setIsRegisterDialogOpen(false)}
                      variant="outline"
                      className="brutal-button bg-white text-black border-3 border-black"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRegisterUser}
                      disabled={isRegisteringUser}
                      className="brutal-button-secondary"
                    >
                      {isRegisteringUser ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Register
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Staff Management Table */}
        <Card className="brutal-card">
          <CardHeader className="brutal-header">
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Staff Management
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">
              Manage staff accounts and permissions ({staffList.length} staff
              members)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {staffList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-200">
                    <TableHead className="font-bold text-foreground uppercase tracking-wide text-sm">
                      Username
                    </TableHead>
                    <TableHead className="font-bold text-foreground uppercase tracking-wide text-sm">
                      Role
                    </TableHead>
                    <TableHead className="font-bold text-foreground uppercase tracking-wide text-sm">
                      Created
                    </TableHead>
                    <TableHead className="font-bold text-foreground uppercase tracking-wide text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.map((staff) => (
                    <TableRow
                      key={staff.id}
                      className="border-b border-gray-200 hover:bg-muted/30"
                    >
                      <TableCell className="font-semibold text-foreground">
                        {staff.username}
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-secondary text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] uppercase tracking-wide">
                          {staff.role}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => openEditStaffDialog(staff)}
                            size="sm"
                            className="brutal-button"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                disabled={isDeletingStaff}
                                size="sm"
                                variant="destructive"
                                className="brutal-button-destructive disabled:opacity-50"
                              >
                                {isDeletingStaff ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <UserX className="h-3 w-3" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="brutal-card max-w-md mx-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-bold text-foreground uppercase tracking-wide">
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium">
                                  Are you sure you want to permanently delete
                                  the staff account "{staff.username}"? This
                                  action cannot be undone and the user will
                                  lose access to the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="brutal-button bg-white text-black border-3 border-black">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteStaff(staff)}
                                  className="brutal-button-destructive"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8">
                <p className="font-semibold text-muted-foreground">
                  No staff members found. Register new staff accounts to get
                  started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </>
    )}

    {/* Edit Staff Dialog */}
    <Dialog
      open={isEditStaffDialogOpen}
      onOpenChange={setIsEditStaffDialogOpen}
    >
      <DialogContent className="brutal-card max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-bold text-primary uppercase tracking-wide">
            Edit Staff Member
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Update staff member information and role
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="editUsername"
              className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
            >
              Username
            </Label>
            <Input
              id="editUsername"
              value={staffForm.username}
              onChange={(e) =>
                setStaffForm({ ...staffForm, username: e.target.value })
              }
              className="col-span-3 brutal-input"
              placeholder="Enter username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="editPassword"
              className="text-right font-semibold text-foreground uppercase tracking-wide text-sm"
            >
              Password
            </Label>
            <Input
              id="editPassword"
              type="password"
              value={staffForm.password}
              onChange={(e) =>
                setStaffForm({ ...staffForm, password: e.target.value })
              }
              className="col-span-3 brutal-input"
              placeholder="Leave empty to keep current password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => setIsEditStaffDialogOpen(false)}
            variant="outline"
            className="brutal-button bg-white text-black border-3 border-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStaff}
            disabled={isUpdatingStaff}
            className="brutal-button-secondary"
          >
            {isUpdatingStaff ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);
}