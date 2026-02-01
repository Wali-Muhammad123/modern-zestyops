import {
  Bell,
  Bug,
  Construction,
  FileX,
  HelpCircle,
  LayoutDashboard,
  ListTree,
  Lock,
  MapPinCheck,
  Monitor,
  Package,
  Palette,
  Sandwich,
  Settings,
  ShieldCheck,
  Tags,
  UserCog,
  UserX,
  Users,
  Wrench,
  ServerOff
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Head Branch',
      logo: MapPinCheck,
      plan: 'Primary',
    },
    {
      name: 'Branch 1',
      logo: MapPinCheck,
      plan: 'Secondary',
    },
    {
      name: 'Branch 3.',
      logo: MapPinCheck,
      plan: 'Tertiary',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Users',
          url: '/dashboard/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Orders & Reservations',
      items: [
        // {
        //   title: 'POS Invoice',
        //   url: '/pos-invoice',
        //   icon: ReceiptText,
        // },
        // {
        //   title: 'Kitchen Dashboard',
        //   url: '/kitchen-dashboard',
        //   icon: ForkKnife,
        // },
        // {
        //   title: 'Counter Dashboard',
        //   url: '/counter-dashboard',
        //   icon: AlignEndHorizontal,
        // },
        {
          title: 'Counter List',
          url: '/counter-dashboard',
          icon: ListTree,
        },
        // {
        //   title: 'Inventory',
        //   url: '/dashboard/inventory',
        //   icon: ServerOff,
        // },
        {
          title: 'Manage Orders',
          icon: Package,
          items: [
            {
              title: 'Order List',
              url: '/dashboard/orders/',
              query: { status: 'all' },
            },
            {
              title: 'Pending Orders',
              url: '/dashboard/orders/',
              query: { status: 'pending' },
            },
            {
              title: 'Complete Orders',
              url: '/dashboard/orders/',
              query: { status: 'completed' },
            },
            {
              title: 'Cancelled Orders',
              url: '/dashboard/orders/',
              query: { status: 'cancelled' },
            },
          ],
        },
        {
          title: 'Reservations',
          icon: Tags,
          items: [
            {
              title: 'Manage Reservations',
              url: '/dashboard/reservations',
            },
            {
              title: 'Unavailable Day',
              url: '/dashboard/reservations/unavailable-day',
            },
            {
              title: 'Reservation Setting',
              url: '/dashboard/reservations/settings',
            },
          ],
        },
      ],
    },
    {
      title: 'Food Management & Inventory',
      items: [
        {
          title: 'Food Management',
          icon: Sandwich,
          items: [
            {
              title: 'Manage Category',
              url: '/dashboard/food-management/manage-category',
            },
            {
              title: 'Manage Food',
              url: '/dashboard/food-management/manage-food',
            },
            {
              title: 'Manage Add-Ons',
              url: '/dashboard/food-management/manage-addons',
            },
          ],
        },
        // {
        //   title: 'Purchase Manage',
        //   icon: ShoppingCart,
        //   items: [
        //     {
        //       title: 'Purchase Item',
        //       url: '/dashboard/purchase-manage/purchase-item',
        //     },
        //     {
        //       title: 'Add Purchase',
        //       url: '/dashboard/purchase-manage/add-purchase',
        //     },
        //     {
        //       title: 'Purchase Return',
        //       url: '/dashboard/purchase-manage/purchase-return',
        //     },
        //     {
        //       title: 'Return Invoice',
        //       url: '/dashboard/purchase-manage/return-invoice',
        //     },
        //     {
        //       title: 'Supplier Manage',
        //       url: '/dashboard/purchase-manage/supplier-manage',
        //     },
        //     {
        //       title: 'Supplier Ledger',
        //       url: '/dashboard/purchase-manage/supplier-ledger',
        //     },
        //     {
        //       title: 'Stock Out Ingredients',
        //       url: '/dashboard/purchase-manage/stock-out-ingredients',
        //     },
        //   ],
        // },
        // {
        //   title: 'Production',
        //   icon: RefreshCcw,
        //   items: [
        //     {
        //       title: 'Set Production Unit',
        //       url: '/dashboard/production/set-production-unit',
        //     },
        //     {
        //       title: 'Production Set List',
        //       url: '/dashboard/production/production-set-list',
        //     },
        //     {
        //       title: 'Add Production',
        //       url: '/dashboard/production/add-production',
        //     },
        //     {
        //       title: 'Production Setting',
        //       url: '/dashboard/production/production-setting',
        //     },
        //   ],
        // },
      ],
    },
    {
      title: 'Restaurant Management',
      items: [
        {
          title: 'Manage Kitchens',
          url: '/dashboard/restaurant-management/manage-kitchens',
        },
        {
          title: 'Manage Tables',
          url: '/dashboard/restaurant-management/manage-tables',
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Login',
              url: '/login',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/signup',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/dashboard/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/dashboard/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/dashboard/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/dashboard/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/dashboard/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
