import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'lab_result' | 'payment' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Your consultation with Dr. Sharma is in 30 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: 'high',
      actionUrl: '/patient/appointments'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup at Apollo Pharmacy',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Clock className="h-4 w-4" />;
      case 'prescription':
        return <CheckCircle className="h-4 w-4" />;
      case 'lab_result':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read
                          ? 'bg-muted/50'
                          : 'bg-background border-primary/20'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="font-medium text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};