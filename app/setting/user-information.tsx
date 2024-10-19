"use client";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import EditableField from "./editable-field";
import PasswordField from "./password-field";

const UserInformation = () => {
  const [userFullName, setUserFullName] = useState("Full name");
  const [userName, setUserName] = useState("User name");
  const [userPhone, setUserPhone] = useState("User phone");
  const [userAddress, setUserAddress] = useState("User address");
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  return (
    <div className="flex flex-col pb-10">
      <p className="px-16 py-6 pt-12 text-2xl">Basic Info</p>
      <Separator />
      <div className="flex w-full flex-col justify-between px-16 py-2">
        <EditableField
          label="Full name"
          value={userFullName}
          setValue={(value) => {
            setUserFullName(value);
            setEditingField(null);
          }}
          isEditing={editingField === "full name"}
          onEdit={(value) => handleEdit(value!)}
        />
        <Separator />
      </div>
      <div className="flex w-full flex-col justify-between px-16">
        <EditableField
          label="Name"
          value={userName}
          setValue={(value) => {
            setUserName(value);
            setEditingField(null);
          }}
          isEditing={editingField === "name"}
          onEdit={(value) => handleEdit(value!)}
        />
        <Separator />
      </div>

      <div className="flex w-full flex-col justify-between px-16">
        <EditableField
          label="Address"
          value={userAddress}
          setValue={(value) => {
            setUserAddress(value);
            setEditingField(null); // Close editing when saving
          }}
          isEditing={editingField === "address"}
          onEdit={(value) => handleEdit(value!)}
        />
        <Separator />
      </div>

      <div className="flex w-full flex-col justify-between px-16">
        <EditableField
          label="Phone"
          value={userPhone}
          setValue={(value) => {
            setUserPhone(value);
            setEditingField(null); // Close editing when saving
          }}
          isEditing={editingField === "phone"}
          onEdit={(value) => handleEdit(value!)}
        />
      </div>
      <Separator />
      <p className="px-16 py-6 pt-6 text-2xl">Account settings</p>
      <Separator />
      <div className="flex w-full flex-col justify-between px-16">
        <PasswordField
          title="Password"
          value=""
          onSave={(currentPassword, newPassword) => {
            console.log(currentPassword, newPassword);
          }}
          isEditing={editingField === "password"}
          onEdit={(value) => handleEdit(value!)}
        />
      </div>
    </div>
  );
};

export default UserInformation;
