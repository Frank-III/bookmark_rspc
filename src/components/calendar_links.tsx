import dayjs from "dayjs";
import { Link } from "../../bindings";
import {
  Paper,
  Stack,
  Text,
  Divider,
  Card,
  Center,
  createStyles,
  Box,
  ThemeIcon,
  useMantineTheme,
  ScrollArea,
} from "@mantine/core";

interface DateLinksProps {
  date: Date;
  links?: Link[];
}

const linkStyle = createStyles((theme) => ({
  link: {
    color: theme.colors.blue[7],
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export function CalendarLinks({ date, links }: DateLinksProps) {
  return (
    <Stack>
      <Paper shadow="xs" radius="md" withBorder={true}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Divider orientation="vertical" size="lg" color="red" />
          <ThemeIcon size="xl" m={4} color="violet" variant="light">
            <Text
              className=""
              size="lg"
              style={{ fontFamily: "Greycliff CF, sans-serif" }}
              variant="gradient"
              gradient={{ from: "pink", to: "yellow", deg: 45 }}
              fw={800}
            >
              {dayjs(date).format("ddd")}
            </Text>
          </ThemeIcon>
          <div>
            <Text
              style={{ fontFamily: "Greycliff CF, sans-serif" }}
              ta="center"
              fz="xl"
              fw={700}
              size="lg"
            >
              {dayjs(date).format("YYYY-MM-DD")}
            </Text>
            <Text color="dimmed">
              you have {links ? links.length : 0} links this day
            </Text>
          </div>
        </Box>
      </Paper>
      {links && links.length ? (
        <ScrollArea h={700}>
          {links.map((link) => {
            return (
              <Card>
                {/* TOD: make it better */}
                <Text>{link.name}</Text>
              </Card>
            );
          })}
        </ScrollArea>
      ) : (
        <Center
          // styles={{
          //   color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-2)))'
          // }}
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark" ? theme.white : theme.colors.gray[7],
            textShadow: "5px",
          })}
          mt="lg"
        >
          <Text color="dimmed" fw={800}>
            No Links available!
          </Text>
        </Center>
      )}
    </Stack>
  );
}
