"use client"
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { firstName: string; lastName: string; email: string; password?: string; role: string }) => void;
  formError: string | null;
  initialData?: { firstName: string; lastName: string; email: string; role: string } | null;
}

const CompanyRoleDialog: React.FC<CompanyRoleDialogProps> = ({ isOpen, onClose, onSubmit, formError, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' }); // reset password if editing
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Company Role' : 'Add Company Role'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of the company role.' : 'Enter the details of the new company role.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {!initialData && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {formError && <div className="col-span-4 text-red-500">{formError}</div>}
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {initialData ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyRoleDialog;
