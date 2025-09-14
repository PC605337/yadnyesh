import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Fingerprint, 
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Wifi,
  Clock,
  MapPin,
  Monitor,
  RefreshCw,
  QrCode,
  Copy,
  Download,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  loginTime: Date;
  lastActivity: Date;
  current: boolean;
  trusted: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'login' | 'data_access' | 'permission_change' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export function AdvancedSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      name: 'Auto-logout on inactivity',
      description: 'Automatically log out after 30 minutes of inactivity',
      enabled: true,
      critical: false
    },
    {
      id: '2',
      name: 'Data encryption at rest',
      description: 'Encrypt all stored health records and personal data',
      enabled: true,
      critical: true
    },
    {
      id: '3',
      name: 'Login notifications',
      description: 'Send email/SMS notifications for new device logins',
      enabled: true,
      critical: false
    },
    {
      id: '4',
      name: 'IP address restrictions',
      description: 'Only allow logins from trusted IP addresses',
      enabled: false,
      critical: false
    },
    {
      id: '5',
      name: 'Data access logging',
      description: 'Log all access to sensitive health information',
      enabled: true,
      critical: true
    },
    {
      id: '6',
      name: 'HIPAA compliance mode',
      description: 'Enable enhanced privacy protections for healthcare data',
      enabled: true,
      critical: true
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Chrome on MacBook Pro',
      location: 'Mumbai, India',
      ipAddress: '192.168.1.100',
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      current: true,
      trusted: true
    },
    {
      id: '2',
      device: 'Safari on iPhone 15',
      location: 'Mumbai, India',
      ipAddress: '192.168.1.101',
      loginTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      current: false,
      trusted: true
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'Delhi, India',
      ipAddress: '203.192.12.45',
      loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
      current: false,
      trusted: false
    }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'login',
      severity: 'medium',
      message: 'New login from unrecognized device in Delhi',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      type: 'data_access',
      severity: 'low',
      message: 'Health records accessed from mobile app',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: true
    },
    {
      id: '3',
      type: 'suspicious_activity',
      severity: 'high',
      message: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      resolved: false
    }
  ]);

  const backupCodes = [
    '8D2B-X4F9', '9K3L-P7Q2', '5M8N-R6T1', 
    '7A4C-Y9Z3', '2E6H-W8V5', '1B3F-S5G8'
  ];

  const { toast } = useToast();

  const enable2FA = async () => {
    // Simulate QR code generation
    setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
    setTwoFactorEnabled(true);
    
    toast({
      title: "2FA Setup Started",
      description: "Scan the QR code with your authenticator app",
    });
  };

  const verify2FA = () => {
    if (verificationCode.length === 6) {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });
      setQrCode("");
      setVerificationCode("");
    }
  };

  const enableBiometric = async () => {
    try {
      // Check if biometric authentication is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }

      setBiometricEnabled(true);
      toast({
        title: "Biometric Authentication Enabled",
        description: "You can now use fingerprint or face recognition to login",
      });
    } catch (error) {
      toast({
        title: "Biometric Setup Failed",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive"
      });
    }
  };

  const toggleSecuritySetting = (settingId: string) => {
    setSecuritySettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    toast({
      title: "Session Terminated",
      description: "The selected session has been terminated",
    });
  };

  const resolveAlert = (alertId: string) => {
    setSecurityAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Backup code copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const content = `Healthcare App - Backup Codes\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${backupCodes.join('\n')}\n\nStore these codes safely. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
          <CardDescription>
            Monitor and manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-800">Secure</p>
              <p className="text-sm text-green-600">Account protected</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-800">98% Score</p>
              <p className="text-sm text-blue-600">Security rating</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-orange-800">2 Alerts</p>
              <p className="text-sm text-orange-600">Need attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-muted-foreground">
                Use an app like Google Authenticator or Authy
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              {!twoFactorEnabled ? (
                <Button onClick={enable2FA}>Enable</Button>
              ) : (
                <Button variant="outline" onClick={() => setTwoFactorEnabled(false)}>
                  Disable
                </Button>
              )}
            </div>
          </div>

          {qrCode && (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <QrCode className="h-32 w-32" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="font-medium">Setup Instructions:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Download an authenticator app</li>
                    <li>Scan this QR code with the app</li>
                    <li>Enter the 6-digit code below</li>
                  </ol>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={verify2FA} disabled={verificationCode.length !== 6}>
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Backup Codes</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                >
                  {showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showBackupCodes ? 'Hide' : 'Show'} Codes
                </Button>
              </div>
              
              {showBackupCodes && (
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium">Store these codes safely</p>
                    <Button size="sm" variant="outline" onClick={downloadBackupCodes}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                        <code className="text-sm font-mono flex-1">{code}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biometric Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Use fingerprint or face recognition for quick access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fingerprint/Face ID</p>
              <p className="text-sm text-muted-foreground">
                Quick and secure biometric login
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={biometricEnabled ? 'default' : 'secondary'}>
                {biometricEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              {!biometricEnabled ? (
                <Button onClick={enableBiometric}>Enable</Button>
              ) : (
                <Button variant="outline" onClick={() => setBiometricEnabled(false)}>
                  Disable
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure advanced security options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securitySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {setting.critical && <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />}
                  <div>
                    <p className="font-medium">{setting.name}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSecuritySetting(setting.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Monitor and manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Monitor className="h-4 w-4 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && <Badge variant="default">Current</Badge>}
                      {session.trusted && <Badge variant="secondary">Trusted</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.ipAddress}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Login: {session.loginTime.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Last: {session.lastActivity.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Recent security events and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 mt-1" />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-80">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.resolved ? (
                      <Badge variant="secondary">Resolved</Badge>
                    ) : (
                      <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}