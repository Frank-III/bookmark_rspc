import './app.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { rspc, client, queryClient } from "./utils/rspc";
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut, UserProfile} from "@clerk/clerk-react";
import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RouterContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {Layout} from './components/layout'



if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

const routerContext = new RouterContext<{
  queryClient: typeof queryClient
}>()


const rootRoute = routerContext.createRootRoute({
  component: () => {
    return (
      <>
        <Layout />
        <TanStackRouterDevtools position="bottom-left" />
      </>
    )
  },
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const versionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'version',
  component: () => {

    return (
      <div className="p-2 flex gap-2">
        <ul className="list-disc pl-4">
        </ul>
        <hr />
        <Outlet />
      </div>
    )
  },
  errorComponent: () => 'Oh crap!',
})


const versionIndexRoute = new Route({
  getParentRoute: () => versionRoute,
  path: '/',
  component: () => {
    const versionQuery = rspc.useQuery(['version'])

    return (
      <>
        <div>{versionQuery.data}</div>
      </>
    )
  },
})

const signRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'auth/sign_in',
  component: () => {
    return (
      <div className="grid w-full h-full place-items-center">
        <div className="w-full max-w-md p-4 h-fit rounded-xl md:py-10">
          <SignIn />
        </div>
      </div>
    )
  }
})

const meRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'me',
  component: () => {
    return (
      <>
      <SignedIn>
      <div className="w-full bg-base-200">
        <div className="w-full max-w-7xl p-4 mx-auto">
          <UserProfile />
        </div>
      </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>     
      </>
    )
  }
})


const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'auth/register',
  component: () => {
    return (
      <div className="grid w-full h-full place-items-center">
        <div className="w-full max-w-md p-4 h-fit rounded-xl md:py-10">
          <SignUp />
        </div>
      </div>
    )
  }
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  versionRoute.addChildren([versionIndexRoute]),
  signRoute,
  registerRoute,
  meRoute
])

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}



function App() {

  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>      
        <RouterProvider router={router} />
      </ClerkProvider>
    </rspc.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
