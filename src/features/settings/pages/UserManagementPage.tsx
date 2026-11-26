import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Shield, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { userService } from '../services/userService';
import { User, Role } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const UserManagementPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('sales_rep');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Team member invited successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User removed from organization');
    },
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await createMutation.mutateAsync({
      name,
      email,
      role,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });

    setName('');
    setEmail('');
    setRole('sales_rep');
    setAddModalOpen(false);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await updateMutation.mutateAsync({ id: userId, data: { role: newRole } });
  };

  const handleStatusToggle = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await updateMutation.mutateAsync({ id: user.id, data: { status: newStatus } });
  };

  const getRoleBadge = (userRole: Role) => {
    switch (userRole) {
      case 'admin':
        return <Badge variant="hot" className="text-[10px] uppercase font-bold">Admin</Badge>;
      case 'technical':
      case 'manager':
        return <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] uppercase font-bold">Technical</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] uppercase font-bold">Sales Rep</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
            <Badge variant="hot" className="text-xs">
              <Shield className="h-3 w-3 mr-1" /> Admin Access
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage organization members, assign roles, configure permissions, and monitor access.
          </p>
        </div>

        <Button onClick={() => setAddModalOpen(true)} className="h-9 gap-1.5 text-xs shadow-xs">
          <UserPlus className="h-4 w-4" /> Invite Team Member
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3">User & Email</th>
                <th className="px-4 py-3">Role & Permissions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Member Since</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => {
                const initials = u.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(u.role)}
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="h-7 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        >
                          <option value="admin">Admin</option>
                          <option value="technical">Technical</option>
                          <option value="sales_rep">Sales Rep</option>
                        </select>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(u)}
                        className="cursor-pointer focus:outline-none"
                      >
                        <Badge variant={u.status === 'active' ? 'success' : 'cold'} className="capitalize">
                          {u.status}
                        </Badge>
                      </button>
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setUserToDelete(u.id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite KCIS Team Member</DialogTitle>
            <DialogDescription>
              Add a new user and assign their role: Admin (Full Access), Sales (Leads, Deals, Contacts), or Technical (Products, Licenses, Support).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name *</label>
              <Input
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Work Email (@kcisindia.com) *</label>
              <Input
                type="email"
                placeholder="rahul@kcisindia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned Role & Permissions *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="sales_rep">Sales (Dashboard, Leads, Contacts, Deals Pipeline, Tasks)</option>
                <option value="technical">Technical (Dashboard, Products & Licenses, Tickets, Marketing)</option>
                <option value="admin">Admin (Full Access to Everything + User Access Control)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Remove Team Member"
        description="Are you sure you want to remove this user from the organization? They will immediately lose access."
        confirmLabel="Remove User"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (userToDelete) {
            await deleteMutation.mutateAsync(userToDelete);
            setUserToDelete(null);
          }
          setDeleteConfirmOpen(false);
        }}
      />
    </motion.div>
  );
};
