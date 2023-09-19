import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RouterContext,
} from "@tanstack/react-router";
import { useIsFetching } from "@tanstack/react-query";
import { useJwtStore } from "../store";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { NavbarSearch } from "./nav";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  ActionIcon,
  AppShell,
  Aside,
  Burger,
  Group,
  Header,
  MediaQuery,
  createStyles,
  rem,
  useMantineColorScheme,
  UnstyledButton,
  Avatar,
  Divider,
  Center,
  Loader,
  Alert,
} from "@mantine/core";
import { IconSun, IconMoonStars, IconAlertCircle } from "@tabler/icons-react";
import { DateLinks } from "./calendar_picker";
import { rspc } from "../utils/rspc";
import dayjs from "dayjs";
import { CalendarLinks } from "./calendar_links";
import { AsideView } from "./aside_view";

export const headerStyle = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.colors.blue[7] : theme.white,
  },

  inner: {
    height: rem(56),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export function Layout() {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === "loading",
  });

  const { getToken, isSignedIn, userId } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes: headerClasses } = headerStyle();

  const [opened, setOpened] = useState<boolean>(false);

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
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
              />
            </MediaQuery>
            <Link to="/">
              <UnstyledButton>
                <Group>
                  <Avatar src="/TOV3AU.jpg" />
                  <div className="">
                    <Text
                      className=""
                      size="lg"
                      sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                      variant="gradient"
                      gradient={{ from: "pink", to: "yellow", deg: 45 }}
                      fw={800}
                    >
                      BookMarks
                    </Text>
                    <Text color="dimmed" size="xs" fw={900}>
                      for web
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Link>
          </Group>
          <Group>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? (
                <IconSun size="1.1rem" />
              ) : (
                <IconMoonStars size="1.1rem" />
              )}
            </ActionIcon>
          </Group>
        </div>
      </Header>
    );
  };

  // TODO: absract links outside of NavbarSearch, to make open works
  return (
    <>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="md"
        navbar={<NavbarSearch hiddenBreakpoint="sm" hidden={!opened} />}
        aside={<AsideView />}
        header={<HeaderBar />}
      >
        <Outlet />
      </AppShell>
    </>
  );
}
