'use client'

import { useState } from 'react'
import { Bell, BellDot, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order received', read: false },
    { id: 2, text: 'Your payout was processed', read: false },
    { id: 3, text: 'System update scheduled', read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative scale-95 rounded-full"
        >
          {unreadCount > 0 ? (
            <BellDot className="size-[1.3rem]" />
          ) : (
            <Bell className="size-[1.3rem]" />
          )}
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-0 shadow-lg rounded-xl overflow-hidden"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-sm font-semibold">
          Notifications
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                'cursor-default flex items-start gap-2 px-3 py-2 text-sm',
                !notification.read && 'bg-muted/40 font-medium'
              )}
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === notification.id ? { ...n, read: true } : n
                  )
                )
              }
            >
              <div className="flex-1">{notification.text}</div>
              {!notification.read && (
                <Check size={14} className="text-muted-foreground opacity-70" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

