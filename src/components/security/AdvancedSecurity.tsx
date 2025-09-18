import React, { useState } from 'react';
import { Shield, Smartphone, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export const AdvancedSecurity = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [securityScore] = useState(75);
  const { toast } = useToast();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (password: string) => {
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const enable2FA = async () => {
    setTwoFactorEnabled(true);
    toast({
      title: "Two-Factor Authentication Enabled",
      description: "Your account is now more secure with 2FA enabled.",
    });
  };

  const enableBiometric = async () => {
    setBiometricEnabled(true);
    toast({
      title: "Biometric Authentication Enabled",
      description: "You can now use fingerprint or face recognition to login.",
    });
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-destructive';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>
            Your overall account security rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {securityScore}/100
          </div>
          <p className="text-sm text-muted-foreground">Security Score</p>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Secure your account with SMS or authenticator app
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={twoFactorEnabled ? setTwoFactorEnabled : enable2FA}
            />
          </div>
          {twoFactorEnabled && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is active. You'll receive a code via SMS when logging in.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Biometric Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Use fingerprint or face recognition for quick access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Biometric Login</p>
              <p className="text-sm text-muted-foreground">
                Login with your fingerprint or face
              </p>
            </div>
            <Switch
              checked={biometricEnabled}
              onCheckedChange={biometricEnabled ? setBiometricEnabled : enableBiometric}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Update your password and view strength indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Password Strength:</span>
                <span className={passwordStrength < 40 ? 'text-destructive' : passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'}>
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          </div>

          <Button className="w-full">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};