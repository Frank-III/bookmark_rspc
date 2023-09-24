import { route as rootRoute } from "./routes/__root"
import { route as TagsRoute } from "./routes/tags"
import { route as MeRoute } from "./routes/me"
import { route as CollectionsRoute } from "./routes/collections"
import { route as IndexRoute } from "./routes/index"
import { route as CollectionsCollectionIdRoute } from "./routes/collections.$collectionId"
import { route as CollectionsIndexRoute } from "./routes/collections.index"

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      parentRoute: typeof rootRoute
    }
    "/collections": {
      parentRoute: typeof rootRoute
    }
    "/me": {
      parentRoute: typeof rootRoute
    }
    "/tags": {
      parentRoute: typeof rootRoute
    }
    "/collections/": {
      parentRoute: typeof CollectionsRoute
    }
    "/collections/$collectionId": {
      parentRoute: typeof CollectionsRoute
    }
  }
}

Object.assign(IndexRoute.options, {
  path: "/",
  getParentRoute: () => rootRoute,
})

Object.assign(CollectionsRoute.options, {
  path: "/collections",
  getParentRoute: () => rootRoute,
})

Object.assign(MeRoute.options, {
  path: "/me",
  getParentRoute: () => rootRoute,
})

Object.assign(TagsRoute.options, {
  path: "/tags",
  getParentRoute: () => rootRoute,
})

Object.assign(CollectionsIndexRoute.options, {
  path: "/",
  getParentRoute: () => CollectionsRoute,
})

Object.assign(CollectionsCollectionIdRoute.options, {
  path: "/$collectionId",
  getParentRoute: () => CollectionsRoute,
})

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  CollectionsRoute.addChildren([
    CollectionsIndexRoute,
    CollectionsCollectionIdRoute,
  ]),
  MeRoute,
  TagsRoute,
])
