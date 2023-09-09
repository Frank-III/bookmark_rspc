import {
  Outlet,
  Route,
  Link,
} from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react';

const privateLinks = [
  {href:"/tags", label: "Tags"},
  {href:"/collections", label: "Collections"},
  {href:"/me", label: "Me"},
]


export function Nav() {
  const { user } = useUser();
  return (
    <nav
      id="nav"
      className="border-b navbar bg-base-200 border-base-content border-opacity-10 justify-between"
      role="navigation"
      aria-label="main navigation"
    >
      <div
        className="items-center flex-none gap-4 lg:hidden"
      >
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
          {/* TODO:  add icon */}
          Menu
        </label>
      </div>

      <div className="flex font-semibold ">
        <ul className="menu menu-horizontal  gap-2 p-2">
          <li>
            <Link
              to="/tags"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Tags
            </Link>
          </li>
          <li>
            <Link
              to="/collections"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              to="/me"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Me
            </Link>
          </li>
        </ul>
      </div>
      {user ? 
        (
          <div className="flex-none">
            {/* <Notifications id="notifications" /> */}
            <span>Nothing</span>
          </div>
        ) :
        (
          <div className="mx-4">
            <Link to="/auth/login" 
                  activeProps={{
                    className: 'font-bold',
                  }}
                  activeOptions={{ exact: true }}>
              {/* TODO:  add icon */}
              Log in
            </Link>
          </div>
        )
      }
    </nav >)
    }
