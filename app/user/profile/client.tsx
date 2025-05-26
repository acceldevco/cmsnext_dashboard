"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

export default function ProfilePage({ profile, update }: any) {
  const [error, setError] = useState('');
  const [localProfile, setLocalProfile] = useState(null);

  useEffect(() => {
    try {
      setLocalProfile(profile);
    } catch (error: any) {
      console.error("Error setting profile:", error);
      setError(error.message || "Failed to set profile");
    }
  }, [profile]);

  if (!localProfile) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };
    try {
      if (localProfile?.id) {
        await update(localProfile.id, data);
        setError('');
      } else {
        setError("Profile ID is missing.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    };
    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      if (localProfile?.id) {
        await update(localProfile.id, data);
        setError('');
      } else {
        setError("Profile ID is missing.");
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      setError(error.message || "Failed to update password");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLocalProfile(prevProfile => {
      if (prevProfile) {
        return {
          ...prevProfile,
          [name]: value,
        };
      } else {
        return { [name]: value };
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={localProfile?.firstName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={localProfile?.lastName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={localProfile?.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  value={localProfile?.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
            >
              Save Changes
            </Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full md:w-auto"
            >
              Update Password
            </Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
