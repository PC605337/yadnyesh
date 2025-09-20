import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, Activity, Lock, Eye, EyeOff } from "lucide-react";

interface SecurityEvent {
  id: string;
  event_type: string;
  event_details: any;
  created_at: string;
  ip_address?: string;
}

interface SecurityMonitorProps {
  userRole?: string;
}

export function SecurityMonitor({ userRole }: SecurityMonitorProps) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only show security monitor for admin users
    if (userRole !== 'admin') return;
    
    fetchSecurityEvents();
    
    // Set up real-time subscription for security events
    const subscription = supabase
      .channel('security_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs'
        },
        (payload) => {
          const newEvent = payload.new as SecurityEvent;
          setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only latest 10
          
          // Show toast for critical security events
          if (newEvent.event_type.includes('suspicious') || 
              newEvent.event_type.includes('unauthorized') ||
              newEvent.event_type.includes('rate_limit_exceeded')) {
            toast({
              title: "Security Alert",
              description: `${newEvent.event_type.replace(/_/g, ' ')} detected`,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userRole, toast]);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching security events:', error);
        return;
      }

      setSecurityEvents(data || []);
    } catch (err) {
      console.error('Error fetching security events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventSeverity = (eventType: string) => {
    if (eventType.includes('suspicious') || eventType.includes('unauthorized')) {
      return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, level: 'HIGH' };
    }
    if (eventType.includes('rate_limit') || eventType.includes('insufficient_permissions')) {
      return { color: 'bg-yellow-100 text-yellow-800', icon: Shield, level: 'MEDIUM' };
    }
    if (eventType.includes('success') || eventType.includes('validated')) {
      return { color: 'bg-green-100 text-green-800', icon: Activity, level: 'INFO' };
    }
    return { color: 'bg-blue-100 text-blue-800', icon: Lock, level: 'LOW' };
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const maskSensitiveData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    
    const masked = { ...data };
    
    // Mask sensitive fields
    if (masked.email) {
      const [local, domain] = String(masked.email).split('@');
      masked.email = `${local.substring(0, 2)}***@${domain}`;
    }
    if (masked.user_id) {
      masked.user_id = `${String(masked.user_id).substring(0, 8)}...`;
    }
    
    return masked;
  };

  // Don't render for non-admin users
  if (userRole !== 'admin') return null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSecurityEvents}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {securityEvents.length === 0 ? (
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              No recent security events to display.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {securityEvents.map((event) => {
              const severity = getEventSeverity(event.event_type);
              const SeverityIcon = severity.icon;
              
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <SeverityIcon className="w-4 h-4 mt-0.5 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={severity.color}>
                        {severity.level}
                      </Badge>
                      <span className="font-medium text-sm">
                        {formatEventType(event.event_type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {showDetails && event.event_details && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(maskSensitiveData(event.event_details), null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {event.ip_address && showDetails && (
                      <div className="text-xs text-gray-500 mt-1">
                        IP: {event.ip_address}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}