"use client";

import { useState } from "react";
import { Bell, CheckCircle, DollarSign, CreditCard, UserCheck, AlertCircle, TrendingUp, Wallet, Eye, X, Archive } from "lucide-react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";

interface Activity {
  id: string;
  type: 'payment' | 'withdrawal' | 'verification' | 'signup' | 'transfer' | 'alert';
  title: string;
  description: string;
  amount?: string;
  time: string;
  isRead: boolean;
  icon: any;
  color: string;
}

let mockActivities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'New Payment Received',
    description: 'Sarah Johnson paid $45.00 for your design service',
    amount: '+$45.00',
    time: '2 hours ago',
    isRead: false,
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: '2',
    type: 'withdrawal',
    title: 'Withdrawal Processed',
    description: 'Your withdrawal of $250.00 has been processed successfully',
    amount: '-$250.00',
    time: '4 hours ago',
    isRead: false,
    icon: Wallet,
    color: 'text-blue-600'
  },
  {
    id: '3',
    type: 'verification',
    title: 'Email Verification Complete',
    description: 'Your email address has been successfully verified',
    time: '1 day ago',
    isRead: true,
    icon: UserCheck,
    color: 'text-emerald-600'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Pending',
    description: 'Michael Brown initiated a payment of $120.00 for consultation',
    amount: '+$120.00',
    time: '1 day ago',
    isRead: true,
    icon: CreditCard,
    color: 'text-yellow-600'
  },
  {
    id: '5',
    type: 'transfer',
    title: 'Transfer to Savings',
    description: 'Automatic transfer of $100.00 to your savings account',
    amount: '-$100.00',
    time: '2 days ago',
    isRead: true,
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    id: '6',
    type: 'alert',
    title: 'Account Security Update',
    description: 'New login from Chrome on Windows detected',
    time: '3 days ago',
    isRead: true,
    icon: AlertCircle,
    color: 'text-orange-600'
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Confirmed',
    description: 'Payment of $89.99 from Jessica Wilson has been confirmed',
    amount: '+$89.99',
    time: '3 days ago',
    isRead: true,
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: '8',
    type: 'signup',
    title: 'Welcome to Tese!',
    description: 'Your account has been created successfully',
    time: '5 days ago',
    isRead: true,
    icon: UserCheck,
    color: 'text-emerald-600'
  }
];

const getActivityIcon = (activity: Activity) => {
  const Icon = activity.icon;
  return <Icon className={`w-5 h-5 ${activity.color}`} />;
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'payment':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'withdrawal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'verification':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
    case 'transfer':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'alert':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'signup':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function NotificationsPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [showArchived, setShowArchived] = useState(false);

  const markAsRead = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, isRead: true } : activity
    ));
  };

  const markAllAsRead = () => {
    setActivities(prev => prev.map(activity => ({ ...activity, isRead: true })));
  };

  const archiveActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const clearAll = () => {
    setActivities([]);
  };

  const unreadCount = activities.filter(activity => !activity.isRead).length;
  const visibleActivities = activities.filter(activity => 
    showArchived ? true : !activity.isRead
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications & Activity
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your account activities and important events
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium">
                {unreadCount} New
              </div>
            )}
            {activities.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Mark All Read
                </button>
                <button
                  onClick={clearAll}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-lg font-bold text-foreground">+$254.99</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Withdrawn</p>
                <p className="text-lg font-bold text-foreground">$250.00</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-foreground">$120.00</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-lg font-bold text-foreground">100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        {activities.length > 0 && (
          <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowArchived(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !showArchived 
                    ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showArchived 
                    ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                All ({activities.length})
              </button>
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {visibleActivities.length > 0 ? (
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {showArchived ? 'All Activities' : 'Unread Notifications'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {showArchived ? 'All your account activities in chronological order' : 'New notifications that need your attention'}
              </p>
            </div>

            <div className="divide-y divide-border">
              {visibleActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-6 hover:bg-secondary/30 transition-colors ${
                    !activity.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg bg-secondary/50 ${activity.color}`}>
                      {getActivityIcon(activity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{activity.title}</h3>
                            {!activity.isRead && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{activity.description}</p>
                        </div>

                        {/* Amount */}
                        {activity.amount && (
                          <div className="font-semibold text-foreground whitespace-nowrap">
                            {activity.amount}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(activity.type)}`}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {!activity.isRead && (
                            <button
                              onClick={() => markAsRead(activity.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => archiveActivity(activity.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {showArchived ? 'No Activities' : 'No Unread Notifications'}
            </h3>
            <p className="text-muted-foreground">
              {showArchived 
                ? 'Your activity history is empty.' 
                : 'All caught up! You have no unread notifications.'}
            </p>
          </div>
        )}

        {/* Load More */}
        {visibleActivities.length > 0 && showArchived && (
          <div className="text-center">
            <button className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-yellow-600 transition-all">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
