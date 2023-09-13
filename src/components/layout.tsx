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
import { useAuth, UserButton} from '@clerk/clerk-react';
import { NavbarSearch } from './nav';
import React, { useEffect, useRef, useState } from 'react';
import { Text, ActionIcon, AppShell, Aside, Burger, Group, Header, MediaQuery, createStyles, rem, useMantineColorScheme, UnstyledButton, Avatar, Divider, Center, Loader, Alert } from '@mantine/core';
import {IconSun, IconMoonStars, IconAlertCircle} from "@tabler/icons-react"
import { DateLinks } from './calendar_picker';
import { rspc } from '../utils/rspc';
import dayjs from 'dayjs';
import { CalendarLinks } from './calendar_links';


export const headerStyle = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.colors.blue[7] : theme.white ,
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

  const { getToken, isSignedIn, userId } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { classes: headerClasses} = headerStyle();

  const [opened, setOpened] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null >(null);
  const { status: dateLinkStatus, error, data: dateLinks} =  rspc.useQuery(["links.getByDate", dayjs(selectedDate).format('YYYY-MM-DD')], {enabled: isSignedIn && (selectedDate !== null)})

  const setToken = useJwtStore((s) => s.setJwt);
  const isExpired = useJwtStore((s) => s.expired);

  React.useEffect(() => {
    console.log("enters:", isSignedIn);
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
            <Link to="/">
            <UnstyledButton >
              <Group>
              <Avatar src="/TOV3AU.jpg"/>
              <div className=''>
                <Text 
                className=""
                size="lg" 
                sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                variant="gradient"
                gradient={{ from: 'pink', to: 'yellow', deg: 45 }}
                fw={800}>
                  BookMarks
                </Text>
                <Text color="dimmed" size="xs" fw={900} >for web</Text>
              </div>
              </Group>
            </UnstyledButton>
            </Link>
          </Group>
          <Group>
            <UserButton afterSignOutUrl="/"/>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
            </ActionIcon>
          </Group>
        </div>
      </Header>
    )
  }

  // TODO: absract links outside of NavbarSearch, to make open works
  return (
    <>
      <AppShell 
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="md"
        navbar={<NavbarSearch hiddenBreakpoint="sm" hidden={!opened}>Nothing</NavbarSearch>} 
        aside={
          <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
            <Aside p="md" hiddenBreakpoint="md" width={{ sm: 200, lg: 300 }}>
              <DateLinks onDateChange={setSelectedDate}/>
              <Divider my="sm"/>
              {/* TODO: use switch here*/}
              {dateLinkStatus === "loading" ? 
                (<Center><Loader variant='dots'/></Center>) : 
                dateLinkStatus=== "error" ?
                (<Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="yellow">
                  You may want to Log in or Register Now!
                </Alert>) : (
                  <CalendarLinks date={selectedDate} links={dateLinks}/>
                )}
            </Aside>
          </MediaQuery>
        }
        header={<HeaderBar/>}>
        <Outlet />
      </AppShell>
    </>
  )
}
