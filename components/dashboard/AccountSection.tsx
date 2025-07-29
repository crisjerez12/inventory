
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, UserX, Loader2, Key, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

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
  const [staffForm, setStaffForm] = useState({ username: "", role: "Staff" });
  
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
        title: "VALIDATION ERROR",
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
          title: "USER REGISTERED",
          description: `New staff account "${newUser.username}" created successfully`,
        });
        setNewUser({ username: "", password: "" });
        setIsRegisterDialogOpen(false);
        fetchStaff();
      } else {
        toast({
          title: "REGISTRATION FAILED",
          description: data.error || "Failed to create user account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "REGISTRATION ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsRegisteringUser(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "VALIDATION ERROR",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "PASSWORD MISMATCH",
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
          title: "PASSWORD UPDATED",
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
          title: "UPDATE FAILED",
          description: data.error || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "UPDATE ERROR",
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
        title: "VALIDATION ERROR",
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
          role: staffForm.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "STAFF UPDATED",
          description: `Staff member "${staffForm.username}" updated successfully`,
        });
        setIsEditStaffDialogOpen(false);
        setSelectedStaff(null);
        fetchStaff();
      } else {
        toast({
          title: "UPDATE FAILED",
          description: data.error || "Failed to update staff member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "UPDATE ERROR",
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
          title: "STAFF DELETED",
          description: `Staff account "${staff.username}" has been permanently removed`,
        });
        fetchStaff();
      } else {
        toast({
          title: "DELETE FAILED",
          description: data.error || "Failed to delete staff account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "DELETE ERROR",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsDeletingStaff(false);
    }
  };

  const openEditStaffDialog = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setStaffForm({ username: staff.username, role: staff.role });
    setIsEditStaffDialogOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* User Profile Section */}
      <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
        <CardHeader className="bg-blue-400 border-b-4 border-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-black text-black">
                👤 USER PROFILE
              </CardTitle>
              <CardDescription className="text-black font-bold">
                Current user information and account management
              </CardDescription>
            </div>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-400 hover:bg-purple-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                  <Key className="h-4 w-4 mr-2" />
                  UPDATE PASSWORD
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="font-black text-black">UPDATE PASSWORD</DialogTitle>
                  <DialogDescription className="font-bold text-black">
                    Change your account password for security
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentPassword" className="text-right font-black text-black text-sm">
                      Current
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="col-span-3 border-4 border-black font-bold"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right font-black text-black text-sm">
                      New
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="col-span-3 border-4 border-black font-bold"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right font-black text-black text-sm">
                      Confirm
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="col-span-3 border-4 border-black font-bold"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsPasswordDialogOpen(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                    className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                  >
                    {isUpdatingPassword ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    UPDATE
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-4 border-black">
                <h3 className="font-black text-black mb-2">USERNAME</h3>
                <p className="text-lg font-bold text-green-600">{user?.username}</p>
              </div>
              <div className="p-4 bg-purple-50 border-4 border-black">
                <h3 className="font-black text-black mb-2">ROLE</h3>
                <p className="text-lg font-bold text-purple-600">{user?.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-4 border-black">
                <h3 className="font-black text-black mb-2">CREATED</h3>
                <p className="text-sm font-bold text-blue-600">
                  {user ? new Date(user.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="p-4 bg-orange-50 border-4 border-black">
                <h3 className="font-black text-black mb-2">LAST UPDATED</h3>
                <p className="text-sm font-bold text-orange-600">
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
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
            <CardHeader className="bg-purple-400 border-b-4 border-black">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-black text-black">
                    👥 USER REGISTRATION
                  </CardTitle>
                  <CardDescription className="text-black font-bold">
                    Register new staff accounts (Admin only)
                  </CardDescription>
                </div>
                <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                      <Plus className="h-4 w-4 mr-2" />
                      REGISTER USER
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="font-black text-black">REGISTER NEW STAFF</DialogTitle>
                      <DialogDescription className="font-bold text-black">
                        Create a new staff account with default Staff role
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newUsername" className="text-right font-black text-black text-sm">
                          Username
                        </Label>
                        <Input
                          id="newUsername"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          className="col-span-3 border-4 border-black font-bold"
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPassword" className="text-right font-black text-black text-sm">
                          Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="col-span-3 border-4 border-black font-bold"
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="p-3 bg-blue-50 border-2 border-black">
                        <p className="text-sm font-bold text-black">
                          <strong>Note:</strong> New accounts will be created with Staff role by default.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => setIsRegisterDialogOpen(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        CANCEL
                      </Button>
                      <Button
                        onClick={handleRegisterUser}
                        disabled={isRegisteringUser}
                        className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                      >
                        {isRegisteringUser ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        REGISTER
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          {/* Staff Management Table */}
          <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
            <CardHeader className="bg-orange-400 border-b-4 border-black">
              <CardTitle className="text-xl md:text-2xl font-black text-black">
                🏢 STAFF MANAGEMENT
              </CardTitle>
              <CardDescription className="text-black font-bold">
                Manage staff accounts and permissions ({staffList.length} staff members)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {staffList.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-4 border-black">
                      <TableHead className="font-black text-black text-lg">USERNAME</TableHead>
                      <TableHead className="font-black text-black text-lg">ROLE</TableHead>
                      <TableHead className="font-black text-black text-lg">CREATED</TableHead>
                      <TableHead className="font-black text-black text-lg">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => (
                      <TableRow key={staff.id} className="border-b-2 border-black">
                        <TableCell className="font-bold text-black">{staff.username}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 border-2 border-black font-black text-black text-xs bg-blue-400">
                            {staff.role}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-black">
                          {new Date(staff.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => openEditStaffDialog(staff)}
                              size="sm"
                              className="bg-blue-400 hover:bg-blue-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  disabled={isDeletingStaff}
                                  size="sm"
                                  className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                  {isDeletingStaff ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <UserX className="h-3 w-3" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-black text-black">
                                    CONFIRM DELETION
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="font-bold text-black">
                                    Are you sure you want to permanently delete the staff account "{staff.username}"? 
                                    This action cannot be undone and the user will lose access to the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all">
                                    CANCEL
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteStaff(staff)}
                                    className="bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
                                  >
                                    DELETE
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
                  <p className="font-bold text-black">No staff members found. Register new staff accounts to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Staff Dialog */}
      <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
        <DialogContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="font-black text-black">EDIT STAFF MEMBER</DialogTitle>
            <DialogDescription className="font-bold text-black">
              Update staff member information and role
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editUsername" className="text-right font-black text-black text-sm">
                Username
              </Label>
              <Input
                id="editUsername"
                value={staffForm.username}
                onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                className="col-span-3 border-4 border-black font-bold"
                placeholder="Enter username"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editRole" className="text-right font-black text-black text-sm">
                Role
              </Label>
              <Select
                value={staffForm.role}
                onValueChange={(value) => setStaffForm({ ...staffForm, role: value })}
              >
                <SelectTrigger className="col-span-3 border-4 border-black font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-4 border-black">
                  <SelectItem value="Staff" className="font-bold">Staff</SelectItem>
                  <SelectItem value="Admin" className="font-bold">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsEditStaffDialogOpen(false)}
              className="bg-gray-400 hover:bg-gray-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleUpdateStaff}
              disabled={isUpdatingStaff}
              className="bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {isUpdatingStaff ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              UPDATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
