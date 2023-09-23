import { route as rootRoute } from './routes/__root';
import { route as TagsRoute } from './routes/tags';
import { route as CollectionsRoute } from './routes/collections';
import { route as IndexRoute } from './routes/index';

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      parentRoute: typeof rootRoute;
    };
    '/collections': {
      parentRoute: typeof rootRoute;
    };
    '/tags': {
      parentRoute: typeof rootRoute;
    };
  }
}

Object.assign(IndexRoute.options, {
  path: '/',
  getParentRoute: () => rootRoute,
});

Object.assign(CollectionsRoute.options, {
  path: '/collections',
  getParentRoute: () => rootRoute,
});

Object.assign(TagsRoute.options, {
  path: '/tags',
  getParentRoute: () => rootRoute,
});

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  CollectionsRoute,
  TagsRoute,
]);
