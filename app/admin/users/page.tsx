"use client";



import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  verified: boolean;
  verificationToken?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersData = await fetch("/api/users").then((res) => res.json());
    setUsers(usersData);
  };

  const handleEdit = (user: User) => {
    setEditedUser(user);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAdd = () => {
    setAddOpen(true);
  };

  const handleSave = async (user: User) => {
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    setUsers(users.map((u) => (u.id === user.id ? user : u)));
    setOpen(false);
  };

  const handleCreate = async (newUser: Omit<User, "id">) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      fetchUsers();
      setAddOpen(false);
    }
  };

  return (
    <ContentLayout title="Users">
      <Button onClick={handleAdd}>Add User</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.verified ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(user)} variant="secondary" size="sm">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(user.id)} variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editedUser && (
            <EditUserForm user={editedUser} onSave={handleSave} onClose={() => setOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <AddUserForm onCreate={handleCreate} onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}

interface EditUserFormProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave, onClose }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState(user.role);
  const [verified, setVerified] = useState(user.verified);

  const handleSubmit = () => {
    onSave({ ...user, firstName, lastName, email, phone, role, verified });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="firstName" className="text-right">
          First Name
        </label>
        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="lastName" className="text-right">
          Last Name
        </label>
        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email
        </label>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="phone" className="text-right">
          Phone
        </label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="role" className="text-right">
          Role
        </label>
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="verified" className="text-right">
          Verified
        </label>
        <input type="checkbox" id="verified" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="col-span-3" />
      </div>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

interface AddUserFormProps {
  onCreate: (newUser: Omit<User, "id">) => void;
  onClose: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onCreate, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [verified, setVerified] = useState(false);

  const handleSubmit = () => {
    onCreate({ firstName, lastName, email, phone, role, verified });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="firstName" className="text-right">
          First Name
        </label>
        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="lastName" className="text-right">
          Last Name
        </label>
        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email
        </label>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="phone" className="text-right">
          Phone
        </label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="role" className="text-right">
          Role
        </label>
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="verified" className="text-right">
          Verified
        </label>
        <input type="checkbox" id="verified" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="col-span-3" />
      </div>
      <Button onClick={handleSubmit}>Create</Button>
    </div>
  );
};
