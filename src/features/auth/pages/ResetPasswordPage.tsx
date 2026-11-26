import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormValues } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from 'sonner';

export const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data);
      setIsSuccess(true);
      toast.success('Password successfully reset');
    } catch {
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
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
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Set new password</CardTitle>
            <CardDescription>
              {isSuccess
                ? 'Your password has been changed'
                : 'Create a new secure password for your CRM account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm text-foreground">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
                <div className="pt-2">
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Go to Login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="password">
                    New Password
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
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4 text-xs text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Cancel and return to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
