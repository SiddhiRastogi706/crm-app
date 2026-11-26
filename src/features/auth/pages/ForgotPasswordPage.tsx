import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from 'sonner';

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Reset email sent');
    } catch {
      toast.error('Failed to send reset link');
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
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? 'Check your inbox for reset instructions'
                : 'Enter your registered work email and we will send you a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm text-foreground">
                  We sent an email to <span className="font-semibold">{submittedEmail}</span> with a secure link to reset your password.
                </p>
                <div className="pt-2">
                  <Link to="/reset-password">
                    <Button variant="outline" className="w-full text-xs">
                      Simulate clicking email reset link &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="email">
                    Work Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4 text-xs text-muted-foreground">
            <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
