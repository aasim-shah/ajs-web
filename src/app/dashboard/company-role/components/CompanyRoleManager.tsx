"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCompanyRoles, deleteCompanyRole, updateCompanyRole, registerCompanyRole } from '@/store/slices/companyRoleSlice/CompanyRoleSlice';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Checkbox } from "@/components/ui/checkbox";
import CompanyRoleDialog from './CompanyRoleRegistrationForm';

interface CompanyRole {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const CompanyRoleManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, status, error, registrationStatus } = useSelector((state: RootState) => state.companyRole);
  const [editRole, setEditRole] = useState<CompanyRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const companyId = localStorage.getItem('_id');
    if (companyId) {
      dispatch(fetchCompanyRoles(companyId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (registrationStatus === 'succeeded') {
      const companyId = localStorage.getItem('_id');
      if (companyId) {
        dispatch(fetchCompanyRoles(companyId));
      }
      setIsDialogOpen(false); // Close the dialog after successful registration
    }
  }, [registrationStatus, dispatch]);

  const handleDelete = (roleId: string) => {
    setRoleToDelete(roleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      dispatch(deleteCompanyRole(roleToDelete));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleEdit = (role: CompanyRole) => {
    setEditRole(role);
    setIsDialogOpen(true); // Open the dialog for editing
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editRole) {
      try {
        await dispatch(updateCompanyRole({ roleId: editRole._id, formData: editRole })).unwrap();
        // Fetch roles again to refresh the list
        const companyId = localStorage.getItem('_id');
        if (companyId) {
          dispatch(fetchCompanyRoles(companyId));
        }
        setEditRole(null);
        setIsDialogOpen(false); // Close the dialog after updating
      } catch (err: any) {
        setFormError(err.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editRole) {
      setEditRole({ ...editRole, [e.target.name]: e.target.value });
    }
  };

  const handleRegister = async (formData: { firstName: string; lastName: string; email: string; password?: string; role: string }) => {
    const companyId = localStorage.getItem('_id');
    if (companyId) {
      try {
        await dispatch(registerCompanyRole({ ...formData, password: formData.password || '', companyId })).unwrap();
        setIsDialogOpen(false);
      } catch (err: any) {
        setFormError(err.message);
      }
    }
  };

  const handleAddNewRole = () => {
    setEditRole(null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNewRole}>Add Company Role</Button>
        <CompanyRoleDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleRegister}
          formError={formError}
          initialData={editRole}
        />
      </div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell>{role.firstName}</TableCell>
                <TableCell>{role.lastName}</TableCell>
                <TableCell>{role.email}</TableCell>
                <TableCell>{role.role}</TableCell>
                <TableCell className="flex gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <FaEdit className="cursor-pointer" onClick={() => handleEdit(role)} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-5">
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                          Update the details of the company role.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={editRole?.firstName || ''}
                              onChange={handleChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={editRole?.lastName || ''}
                              onChange={handleChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              value={editRole?.email || ''}
                              onChange={handleChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Input
                              id="role"
                              name="role"
                              value={editRole?.role || ''}
                              onChange={handleChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          {formError && <div className="col-span-4 text-red-500">{formError}</div>}
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">
                            Save
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <AiFillDelete className="cursor-pointer text-red-500" onClick={() => handleDelete(role._id)} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-5">
                      <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this role?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={confirmDelete}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CompanyRoleManager;
