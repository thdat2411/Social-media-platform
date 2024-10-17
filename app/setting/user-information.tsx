"use client";
import React, { useState } from "react";
import EditableField from "./editable-field";
import PasswordField from "./password-field";
import { Separator } from "@/components/ui/separator";

const UserInformation = () => {
  const [userName, setUserName] = useState("User name");
  const [userPhone, setUserPhone] = useState("User phone");
  const [userAddress, setUserAddress] = useState("User address");
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  return (
    <div className="flex flex-col pb-10">
      <p className="text-2xl px-16 pt-12 py-6">Basic Info</p>
      <Separator />
      <div className="flex flex-col w-full justify-between px-16 py-2">
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

      <div className="flex flex-col w-full justify-between px-16">
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

      <div className="flex flex-col w-full justify-between px-16">
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
      <p className="text-2xl px-16 pt-6 py-6">Account settings</p>
      <Separator />
      <div className="flex flex-col w-full justify-between px-16">
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
