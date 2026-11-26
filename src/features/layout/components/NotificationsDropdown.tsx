import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Check, DollarSign, LifeBuoy, AlertCircle, Calendar, Mail, Volume2, VolumeX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { NotificationItem } from '@/lib/api/types';
import { apiClient } from '@/lib/api/axios';
import { formatRelativeTime } from '@/utils/formatters';
import { playNotificationChime, isSoundEnabled, setSoundEnabled } from '@/utils/sound';
import { useNavigate } from 'react-router-dom';

export const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const prevUnreadCountRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(() => {
    apiClient
      .get<NotificationItem[]>('/notifications')
      .then((res) => {
        setNotifications(res.data);
        const currentUnread = res.data.filter((n) => !n.read).length;
        // If unread count increased after initial mount, trigger the bell chime sound!
        if (prevUnreadCountRef.current !== null && currentUnread > prevUnreadCountRef.current) {
          playNotificationChime('ticket');
        }
        prevUnreadCountRef.current = currentUnread;
      })
      .catch((err) => console.error('Failed to load notifications', err));
  }, []);

  useEffect(() => {
    fetchNotifications();

    const handleSync = () => {
      fetchNotifications();
    };

    window.addEventListener('pulse:notification-created', handleSync);
    window.addEventListener('pulse:ticket-created', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('pulse:notification-created', handleSync);
      window.removeEventListener('pulse:ticket-created', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string, link?: string) => {
    await apiClient.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (link) {
      setOpen(false);
      navigate(link);
    }
  };

  const handleMarkAllRead = async () => {
    await apiClient.post('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string, title?: string) => {
    if (title?.includes('📩') || title?.toLowerCase().includes('email') || type === 'email') {
      return <Mail className="h-4 w-4 text-sky-500" />;
    }
    switch (type) {
      case 'deal':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'ticket':
        return <LifeBuoy className="h-4 w-4 text-amber-600" />;
      case 'task':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-84 p-0 shadow-xl border-border bg-card">
        <div className="flex items-center justify-between p-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-bold">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Audio Bell Mute/Unmute & Test Chime */}
            <button
              type="button"
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
                if (next) playNotificationChime('ticket');
              }}
              title={soundOn ? 'Mute Notification Bell' : 'Unmute Notification Bell'}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {soundOn ? (
                <Volume2 className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>

            <button
              type="button"
              onClick={() => playNotificationChime('urgent')}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              title="Test Urgent Bell Chime Sound"
            >
              Test Sound 🔔
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline font-medium ml-1 cursor-pointer"
              >
                Mark all
              </button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id, item.link)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                  !item.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="mt-0.5 rounded-full p-1.5 bg-background border shrink-0">
                  {getIcon(item.type, item.title)}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs ${!item.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
