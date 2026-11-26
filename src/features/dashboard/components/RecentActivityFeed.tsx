import React from 'react';
import { Phone, Mail, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Activity } from '@/lib/api/types';
import { formatRelativeTime } from '@/utils/formatters';
import { Link } from 'react-router-dom';

interface RecentActivityFeedProps {
  activities?: Activity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities = [] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-3.5 w-3.5 text-blue-600" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-indigo-600" />;
      case 'meeting':
        return <Calendar className="h-3.5 w-3.5 text-amber-600" />;
      case 'note':
        return <FileText className="h-3.5 w-3.5 text-emerald-600" />;
      default:
        return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const displayed = activities.slice(0, 5);

  return (
    <Card className="col-span-1 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription className="text-xs">Latest communications across accounts</CardDescription>
        </div>
        <Link to="/contacts" className="text-xs text-primary hover:underline font-medium">
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {displayed.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">No recent activities logged.</p>
        ) : (
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
            {displayed.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border shadow-2xs group-hover:border-primary transition-colors">
                  {getIcon(act.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(act.date)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                    <span>By <strong className="font-medium text-foreground">{act.performedBy}</strong></span>
                    {act.contactName && (
                      <>
                        <span>•</span>
                        <Link
                          to={act.contactId ? `/contacts/${act.contactId}` : '#'}
                          className="text-primary hover:underline font-medium truncate max-w-[150px]"
                        >
                          {act.contactName}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
