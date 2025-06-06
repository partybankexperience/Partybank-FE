
import React, { useState, useRef, useEffect } from 'react';
import { VscBellDot } from "react-icons/vsc";
import { BiCheck, BiTrash } from "react-icons/bi";
import { BsDot } from "react-icons/bs";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Event Published',
      message: 'Your event "Canvas and Beats" has been successfully published.',
      type: 'success',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'New Ticket Sale',
      message: 'Brooklyn Simmons purchased 2 tickets for "Temple of Eros".',
      type: 'info',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      title: 'Payout Processed',
      message: 'Your payout of ₦50,000 has been processed successfully.',
      type: 'success',
      isRead: true,
      createdAt: '2024-01-14T16:45:00Z'
    },
    {
      id: '4',
      title: 'Event Reminder',
      message: 'Your event "Gen-Z House Party" starts in 2 hours.',
      type: 'warning',
      isRead: false,
      createdAt: '2024-01-14T14:00:00Z'
    },
    {
      id: '5',
      title: 'Payment Failed',
      message: 'Payment processing failed for order #12345. Please check your payment settings.',
      type: 'error',
      isRead: true,
      createdAt: '2024-01-14T11:20:00Z'
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-[50px] h-[50px] rounded-full border border-[#DEDEDE] flex justify-center items-center hover:bg-gray-50 transition-colors"
        aria-label="Notifications"
      >
        <VscBellDot className="text-[26px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <VscBellDot className="mx-auto text-4xl text-gray-300 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Read/Unread Indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {!notification.isRead ? (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <span>{formatTime(notification.createdAt)}</span>
                              {!notification.isRead && (
                                <>
                                  <BsDot className="text-lg" />
                                  <span className="text-primary font-medium">New</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                title="Mark as read"
                              >
                                <BiCheck className="text-lg text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              title="Delete notification"
                            >
                              <BiTrash className="text-lg text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
