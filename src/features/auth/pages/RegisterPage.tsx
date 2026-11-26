import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '../schemas/authSchemas';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'sales_rep',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedRole = watch('role') || 'sales_rep';

  useEffect(() => {
    register('role');
  }, [register]);

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    try {
      await registerUser(data);
      toast.success('Account created successfully! Welcome to Pulse CRM.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50/50 via-background to-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white p-3 shadow-lg border border-border/80 mx-auto">
            <img
              src="/kcis-icon.png"
              alt="KCIS Info Solution Pvt Ltd"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              KCIS Info Solution Pvt Ltd
            </h1>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">
              We Breathe Technology
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Start your enterprise workspace</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Create your workspace</CardTitle>
            <CardDescription>Setup your profile to collaborate with your revenue team</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium flex items-center justify-between">
                <span>{error}</span>
                {error.toLowerCase().includes('already exists') && (
                  <Link to="/login" className="underline font-bold text-xs ml-2 hover:opacity-80 shrink-0">
                    Sign in &rarr;
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="name">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  leftIcon={<UserIcon className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="email">
                  Work Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@kcisindia.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Official domain (<span className="text-primary font-medium">@kcisindia.com</span>) required
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="role">
                  Team Role
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => {
                    setValue('role', val as any, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    id="role"
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 cursor-pointer"
                  >
                    <SelectValue placeholder="Select team role" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover text-popover-foreground shadow-xl border border-border rounded-xl p-1">
                    <SelectItem value="sales_rep" className="cursor-pointer">
                      Sales Representative (Deals, Leads, Contacts)
                    </SelectItem>
                    <SelectItem value="technical" className="cursor-pointer">
                      Technical (System & Architecture Lead)
                    </SelectItem>
                    <SelectItem value="admin" className="cursor-pointer">
                      System Administrator (Full Org Access)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4 text-xs text-muted-foreground">
            Already have an account?&nbsp;
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
