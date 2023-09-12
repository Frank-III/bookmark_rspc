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
import { NavbarSearch } from './nav';
import React, { useState } from 'react';
import { ActionIcon, AppShell, Burger, Group, Header, MediaQuery, createStyles, rem, useMantineColorScheme } from '@mantine/core';
import {IconSun, IconMoonStars} from "@tabler/icons-react"


const headerStyle = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))



export function Layout() {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });
  const [opened, setOpened] = useState<boolean>(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { classes: headerClasses} = headerStyle();

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


  const HeaderBar = () => {
    return (
      <Header height={56} className={headerClasses.header} mb={120}>
        <div className={headerClasses.inner}>
          <Group>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" />
            </MediaQuery>
          </Group>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
            </ActionIcon>
        </div>
      </Header>
    )
  }

  return (
    <>
      <AppShell 
        navbar={<NavbarSearch hiddenBreakpoint="sm" hidden={!opened}/>} 
        header={<HeaderBar/>}>
        <Outlet />
      </AppShell>
    </>
  )
}
