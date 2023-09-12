import { SignOutButton } from '@clerk/clerk-react';
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  Popover,
  Stack,
  rem,
  Collapse,
  Blockquote,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {useJwtStore} from '../../store'

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    paddingRight: `${rem(12)}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    '&:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  }
}));

interface UserButtonProps extends UnstyledButtonProps {
  // image: string;
  // name: string;
  // email: string;
  user: {avatar:string, name: string | null, email: any};
}

// TODO: redesign to be a collapsible that shows bio and something else
export function UserButton({user, ...others }: UserButtonProps) {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const handle_logout = (o: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    useJwtStore.getState().setExpired(true)
    setOpen(false)
  }
  return (
    <>
      <UnstyledButton onClick={() => setOpen((o) => !o)} className={classes.user}>
        <Group>
          <Avatar src={user.avatar} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {user.name? user.name : "My friend"}
          </Text>
          {user.email && <Text color="dimmed" size="xs">
            {user.email}
          </Text>}
        </div>
        <IconChevronRight size="0.9rem" stroke={1.5} />
        </Group>
      </UnstyledButton>
      <Collapse in={open}>
        <Blockquote color="blue">
          Life is like an npm install – you never know what you are going to get.
        </Blockquote>
      </Collapse>
    </>
    // <Popover closeOnEscape={true} opened={open} width="target" >
    //   <Popover.Target >
    //     {/* <UnstyledButton className={classes.user} /> */}
    //       <div className={classes.user} onClick={(o) => setOpen((o) => !o)}>
            // <Group>
            // <Avatar src={user.avatar} radius="xl" />
            // <div style={{ flex: 1 }}>
            //   <Text size="sm" weight={500}>
            //     {user.name? user.name : "My friend"}
            //   </Text>
            //   {user.email && <Text color="dimmed" size="xs">
            //     {user.email}
            //   </Text>}
            // </div>
            // <IconChevronRight size="0.9rem" stroke={1.5} />
            // </Group>
    //       </div>
    //     {/* <UnstyledButton /> */}
    //   </Popover.Target>
    //   <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
    //     <Stack spacing="sm" >
    //     <Link to="/me" className={classes.link} onClick={(o) => setOpen(false)}>
    //       <UnstyledButton>
    //         Me
    //       </UnstyledButton>
    //     </Link >
    //     <Link className={classes.link} onClick={handle_logout}>
    //       <SignOutButton >
    //         <UnstyledButton>
    //           Sign Out
    //         </UnstyledButton>
    //       </SignOutButton>
    //     </Link>
    //     </Stack>
    //   </Popover.Dropdown>
    // </Popover>
    )
}