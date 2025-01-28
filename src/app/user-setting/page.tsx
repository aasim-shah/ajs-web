// src/pages/user-settings.tsx
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { changePassword } from "../../store/slices/userSettingsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userSettings = useSelector((state: RootState) => state.userSettings);
  const auth = useSelector((state: RootState) => state.auth);

  const email = auth.user?.email || '';

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!email || !oldPassword || !newPassword) {
      console.error('All fields are required');
      return;
    }

    await dispatch(changePassword({ oldPassword, newPassword }));
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-md mx-auto bg-background p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">User Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              disabled
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Old Password
            </Label>
            <Input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Button
              onClick={handleChangePassword}
              className="w-full bg-signature  py-2 rounded-md"
            >
              Change Password
            </Button>
          </div>
          {userSettings.error && <p className="text-red-500 text-center">{userSettings.error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
