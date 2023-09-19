import { useUser } from "@clerk/clerk-react";

import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Box,
  Alert,
  getStylesRef,
  Grid,
  NavbarProps,
  Loader,
  Center,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconPinned,
  IconBookmark,
  IconUser,
  IconLuggage,
  IconSearch,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react";
import { UserButton } from "./buttons/userbutton";
import { rspc } from "../utils/rspc";
import { LinksGroup } from "./collapsible_links";
import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    paddingRight: `${rem(12)}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    // '&:hover': {
    //   backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    //   color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    // },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkActive: {
    "&": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    right: 0,
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(6),
  },

  collectionLink: {
    display: "block",
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

// const links = [
//   { icon: IconBookmark, href: tagsRoute.to, label: 'Tags', notifications: 3 },
//   { icon: IconLuggage, href:collectionRoute.to, label: 'Collections', notifications: 4 },
//   { icon: IconUser, href: meRoute.to, label: 'Me' },
// ];

const links = [
  { icon: IconBookmark, href: "/tags", label: "Tags" },
  { icon: IconLuggage, href: "/collections", label: "Collections" },
  { icon: IconUser, href: "/me", label: "Me" },
] as const;

interface NavbarSearchProps extends Omit<NavbarProps, "children"> {}

export function NavbarSearch({ ...others }: NavbarSearchProps) {
  const { isSignedIn, user } = useUser();
  const { classes, cx } = useStyles();

  const {
    status,
    error,
    data: pinnedCollections,
  } = rspc.useQuery(["collections.getPinned"], { enabled: isSignedIn });

  const mainLinks = links.map((link) => (
    <Link
      to={link.href}
      key={link.label}
      activeProps={{ className: classes.mainLinkActive }}
      className={classes.mainLink}
    >
      <UnstyledButton key={link.label} className={classes.mainLink}>
        <div className={classes.mainLinkInner}>
          <Group position="apart">
            <link.icon
              size={20}
              className={classes.mainLinkIcon}
              stroke={1.5}
            />
            <Text size={"20"}>{link.label}</Text>
          </Group>
        </div>
        {/* {link.notifications && (
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {link.notifications}
            </Badge>
          )} */}
      </UnstyledButton>
    </Link>
  ));

  const collectionLinks = pinnedCollections?.map(({ collection }) => ({
    color: collection.color,
    name: collection.name,
    link: `/collections/${collection.id}`,
  }));

  const collectionLinksGroup = {
    icon: IconPinned,
    label: "Pinned Collections",
    links: collectionLinks,
  };

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar} {...others}>
      <Navbar.Section className={classes.section}>
        {!isSignedIn ? (
          <Link to="/auth/sign_in">
            <UnstyledButton className={classes.user}>
              <Group>
                <Avatar radius="xl" color="blue">
                  U
                </Avatar>
                Sign In
              </Group>
            </UnstyledButton>
          </Link>
        ) : (
          <UserButton
            user={{
              avatar: user?.imageUrl,
              name: user.username,
              email: user.fullName,
            }}
          ></UserButton>
        )}
      </Navbar.Section>

      <TextInput
        placeholder="Search"
        size="xs"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        mb="sm"
      />

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        {/* TODO: make it  */}
        <div className={classes.collections}>
          {status == "success" ? (
            <LinksGroup {...collectionLinksGroup} />
          ) : status == "loading" ? (
            <Center mt="lg">
              <Loader variant="dots" />
            </Center>
          ) : (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Bummer!"
              color="yellow"
            >
              You may want to Log in or Register Now!
            </Alert>
          )}
        </div>
      </Navbar.Section>
    </Navbar>
  );
}
