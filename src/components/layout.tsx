import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RouterContext,
} from '@tanstack/react-router'
import { useIsFetching } from '@tanstack/react-query';
import { useJwtStore } from '../store';
import { useAuth } from '@clerk/clerk-react';
import { Nav } from './nav';
import React from 'react';

interface layOutprop {
  padding: string,
}


export function Layout({padding="4"}: layOutprop) {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });

  const { getToken, isSignedIn } = useAuth();

  const setToken = useJwtStore((s) => s.setJwt);
  const isExpired = useJwtStore((s) => s.expired);

  React.useEffect(() => {
    if (isSignedIn && !isExpired) return;
    const token = async () => {
      return await getToken();
    };
    token().then((res) => setToken(res));
  }, [isSignedIn, isExpired]);

  return (
    <>
    <div className="w-full h-screen drawer drawer-mobile">
      <input
        type="checkbox"
        id="drawer-toggle"
        aria-label="Bookmark menu"
        className="hidden drawer-toggle"
      />
      <main className="flex flex-col h-screen grow drawer-content">
        <div className="sticky top-0 z-50">
          <Nav />
          {/* <Flash flashes={@flashes} /> */}
        </div>
          {/* <#slot {@search} /> */}
        <section className={"flex flex-col grow padding-" + padding}>
          {/* <div
            className="w-full p-4 mx-auto max-w-7xl"
            :if={@current_user && is_nil(@current_user.confirmed_at)}
          >
            <div className="flex flex-row items-center justify-start gap-4 rounded-lg alert alert-info">
              <Icon className="alert-triangle" size="6" label="log out" />
              <span className="block">
                You need to verify your email address before you can do certain things on the site, such as submit new commissions.
                <br>Please check your email or <LiveRedirect class="link" to={Routes.user_confirmation_instructions_path(Endpoint, :new)}>click here to resend your confirmation.</LiveRedirect>
              </span>
            </div>
          </div> */}
          <Outlet />
        </section>
        <div className="w-full border-t border-base-content border-opacity-10">
          <footer className="px-4 py-8 mx-auto border-none footer max-w-7xl">
          </footer>
        </div>
      </main>
      <div
        className="drawer-side"
      >
        <label htmlFor="drawer-toggle" className="drawer-overlay" />
        <nav className="relative w-64 border-r bg-base-200 border-base-content border-opacity-10">
          {/* <div className="absolute bottom-0 left-0 flex flex-col w-full px-4 pb-6">
            {#if Accounts.active_user?(@current_user)}
              <div class="divider" />
              <div class="flex flex-row items-center">
                <Link
                  class="flex flex-row items-center gap-2 grow hover:cursor-pointer"
                  to={~p"/"}
                >
                  <Avatar class="w-4 h-4" link={false} user={@current_user} />
                </Link>
                <Link to={Routes.user_session_path(Endpoint, :delete)} method={:delete}>
                  <div class="tooltip" data-tip="Log out">
                    <Icon name="log-out" size="4" label="log out" class="z-50" />
                  </div>
                </Link>
              </div>
            {/if}
          </div> */}
          <ul tabIndex={0} className="flex flex-col gap-2 p-2 menu menu-compact">
            {/* <li :if={Accounts.active_user?(@current_user)}>
            </li>
            <li
              class="bg-transparent rounded-none pointer-events-none select-none h-fit"
              :if={Accounts.active_user?(@current_user)}
            >
              <div class="w-full gap-0 px-2 py-0 m-0 rounded-none divider" />
            </li> */}
            <li>
              <Link
                to="/"
                activeProps={{
                  className: 'font-bold',
                }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
            </li>
            {isSignedIn ? (
              <li>
                <Link
                  to="/settings"
                  activeProps={{
                    className: 'font-bold',
                  }}
                  activeOptions={{ exact: true }}
                >
                  Settings
                </Link>
              </li>
            ) : (
              <>
              <li>
                <Link
                  to="/auth/sign_in"
                  activeProps={{
                    className: 'font-bold',
                  }}
                  activeOptions={{ exact: true }}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  activeProps={{
                    className: 'font-bold',
                  }}
                  activeOptions={{ exact: true }}
                >
                  Register
                </Link>
              </li>
              </>
            )}
           </ul>
        </nav>
      </div>
    </div>
    </>
  )
}
