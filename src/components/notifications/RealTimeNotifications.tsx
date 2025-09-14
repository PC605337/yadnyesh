import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  BellRing,
  BellOff,
  MessageSquare,
  Calendar,
  Heart,
  Pill,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Smartphone,
  Mail,
  Volume2,
  Clock,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'appointment' | 'medication' | 'health_alert' | 'message' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: any;
}

interface NotificationSettings {
  id: string;
  category: string;
  description: string;
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  schedule?: {
    start: string;
    end: string;
    daysOfWeek: number[];
  };
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Your consultation with Dr. Priya is in 30 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      priority: 'high',
      read: false,
      actionRequired: true,
      actionUrl: '/appointments',
      metadata: { appointmentId: 'apt_123', providerId: 'dr_priya' }
    },
    {
      id: '2',
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your morning blood pressure medication',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      priority: 'medium',
      read: false,
      actionRequired: true,
      metadata: { medicationId: 'med_123', dosage: '10mg' }
    },
    {
      id: '3',
      type: 'health_alert',
      title: 'Heart Rate Alert',
      message: 'Your heart rate has been elevated for the past 20 minutes',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      priority: 'urgent',
      read: false,
      actionRequired: true,
      metadata: { currentRate: 95, averageRate: 72 }
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Dr. Sarah sent you a message about your test results',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      priority: 'medium',
      read: true,
      actionRequired: false
    },
    {
      id: '5',
      type: 'system',
      title: 'Data Sync Complete',
      message: 'Your health data has been synchronized from Apple Watch',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      priority: 'low',
      read: true,
      actionRequired: false,
      metadata: { deviceType: 'Apple Watch', recordsUpdated: 24 }
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings[]>([
    {
      id: '1',
      category: 'Appointments',
      description: 'Reminders for upcoming appointments and schedule changes',
      enabled: true,
      channels: { push: true, email: true, sms: false, inApp: true }
    },
    {
      id: '2',
      category: 'Medications',
      description: 'Medication reminders and refill notifications',
      enabled: true,
      channels: { push: true, email: false, sms: true, inApp: true }
    },
    {
      id: '3',
      category: 'Health Alerts',
      description: 'Critical health alerts and abnormal readings',
      enabled: true,
      channels: { push: true, email: true, sms: true, inApp: true }
    },
    {
      id: '4',
      category: 'Messages',
      description: 'Messages from healthcare providers',
      enabled: true,
      channels: { push: true, email: true, sms: false, inApp: true }
    },
    {
      id: '5',
      category: 'Health Insights',
      description: 'Weekly health reports and trend analysis',
      enabled: true,
      channels: { push: false, email: true, sms: false, inApp: true }
    },
    {
      id: '6',
      category: 'System Updates',
      description: 'App updates and system maintenance notifications',
      enabled: false,
      channels: { push: false, email: true, sms: false, inApp: true }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState({ enabled: true, start: '22:00', end: '08:00' });

  const { toast } = useToast();

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() < 0.3) {
        const notificationTypes = ['medication', 'health_alert', 'message', 'system'];
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as any;
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: getRandomTitle(randomType),
          message: getRandomMessage(randomType),
          timestamp: new Date(),
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          read: false,
          actionRequired: Math.random() < 0.5
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
        
        if (soundEnabled) {
          // Play notification sound
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(() => {}); // Ignore errors
        }

        // Show toast for urgent notifications
        if (newNotification.priority === 'urgent') {
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: "destructive",
          });
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [soundEnabled, toast]);

  const getRandomTitle = (type: string) => {
    const titles = {
      medication: ['Medication Reminder', 'Refill Due', 'Dose Confirmation'],
      health_alert: ['Vital Signs Alert', 'Health Metric Warning', 'Abnormal Reading'],
      message: ['New Message', 'Provider Update', 'Test Results Available'],
      system: ['Data Synced', 'Update Available', 'Backup Complete']
    };
    const typeList = titles[type as keyof typeof titles] || ['Notification'];
    return typeList[Math.floor(Math.random() * typeList.length)];
  };

  const getRandomMessage = (type: string) => {
    const messages = {
      medication: [
        'Time to take your evening medication',
        'Prescription refill needed within 3 days',
        'Please confirm you took your morning dose'
      ],
      health_alert: [
        'Blood pressure reading is higher than normal',
        'Heart rate has been elevated for 15 minutes',
        'Blood sugar levels require attention'
      ],
      message: [
        'Your doctor has reviewed your test results',
        'Appointment rescheduled to next week',
        'New health recommendation available'
      ],
      system: [
        'Fitness tracker data synchronized successfully',
        'Weekly health report is now available',
        'App updated with new features'
      ]
    };
    const typeList = messages[type as keyof typeof messages] || ['New notification'];
    return typeList[Math.floor(Math.random() * typeList.length)];
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'health_alert': return <Heart className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'urgent') return notif.priority === 'urgent' || notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const urgentCount = notifications.filter(notif => notif.priority === 'urgent').length;

  const updateNotificationSetting = (settingId: string, field: string, value: any) => {
    setNotificationSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, [field]: value }
        : setting
    ));
  };

  const updateChannelSetting = (settingId: string, channel: string, enabled: boolean) => {
    setNotificationSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { 
            ...setting, 
            channels: { ...setting.channels, [channel]: enabled }
          }
        : setting
    ));
  };

  return (
    <div className="space-y-6">
      {/* Notification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Stay updated with real-time health notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('urgent')}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent ({urgentCount})
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-muted/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.type.replace('_', ' ')}
                          </Badge>
                          {notification.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp.toLocaleString()}
                          </div>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Global Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Play sound for important notifications
                </p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quiet Hours</p>
                <p className="text-sm text-muted-foreground">
                  Reduce notifications during specified hours (urgent alerts still come through)
                </p>
              </div>
              <Switch
                checked={quietHours.enabled}
                onCheckedChange={(enabled) => setQuietHours(prev => ({ ...prev, enabled }))}
              />
            </div>
          </div>

          {/* Category Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Notification Categories</h4>
            
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{setting.category}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(enabled) => updateNotificationSetting(setting.id, 'enabled', enabled)}
                  />
                </div>
                
                {setting.enabled && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.channels.push}
                        onCheckedChange={(enabled) => updateChannelSetting(setting.id, 'push', enabled)}
                      />
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        <span className="text-sm">Push</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.channels.email}
                        onCheckedChange={(enabled) => updateChannelSetting(setting.id, 'email', enabled)}
                      />
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">Email</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.channels.sms}
                        onCheckedChange={(enabled) => updateChannelSetting(setting.id, 'sms', enabled)}
                      />
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-sm">SMS</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.channels.inApp}
                        onCheckedChange={(enabled) => updateChannelSetting(setting.id, 'inApp', enabled)}
                      />
                      <div className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        <span className="text-sm">In-App</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}