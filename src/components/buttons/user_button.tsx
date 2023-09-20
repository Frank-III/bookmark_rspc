import { useUser, UserButton as ClerkUserButton } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Link } from 'lucide-react';

export function UserButton() {
  const { isSignedIn, user } = useUser();

  return (
    <div className='hover:bg-gray-200/50 group flex w-full flex-row items-center justify-between space-x-2 rounded-lg p-2 space-y-5'>
      <div className='flex flex-row items-center justify-start space-x-2'>
        {isSignedIn ? (
          <>
            <ClerkUserButton afterSignOutUrl='/' />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className='line-clamp-1 text-left text-sm font-medium'>
                  {user.username}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link to='/auth/sign_in' id='sign-in'>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
