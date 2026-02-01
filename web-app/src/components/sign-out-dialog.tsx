import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAppDispatch } from '@/store'
import { logoutUser } from '@/store/slices/auth/authSliceThunk'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await dispatch(logoutUser())
    // Preserve current location for redirect after sign-in
    const currentPath = location.href
    navigate({
      to: '/login',
      search: { redirect: currentPath },
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
