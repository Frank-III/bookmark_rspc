import dayjs from "dayjs";
import { Link } from "../../bindings";
import { Paper, Stack, Text, Divider, Card, Center, createStyles, Box, ThemeIcon} from "@mantine/core";


interface DateLinksProps {
  date: Date;
  links?: Link[];
}


const linkStyle = createStyles((theme) => ({

  header: {

  },

  link: {
    color: theme.colors.blue[7],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  }))

export function CalendarLinks({date, links}: DateLinksProps) {

  return (
    <Stack>
      <Paper shadow="xs" radius="md" withBorder={true}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Divider orientation="vertical" size="lg" color="red" />
          <ThemeIcon size="xl" m={4} color="violet" variant="light">
            <Text 
            size="lg" 
            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
            variant="gradient"
            gradient={{ from: 'pink', to: 'yellow', deg: 45 }}
            fw={800}>
              {dayjs(date).format("ddd")}
            </Text>
          </ThemeIcon>
          <Stack ml="">
            <Text sx={{ fontFamily: 'Greycliff CF, sans-serif' }} ta="center" fz="xl" fw={700} size="lg">
              {dayjs(date).format('YYYY-MM-DD')}
            </Text>
            <Text>
              you have {links ? links.length : 0} links this day
            </Text>
          </Stack>
        </Box>
      </Paper>
      {links && (links.length) ? (
        links.map((link) => {
          return (
            <Card>
              <Text>{link.name}</Text>
            </Card>
          )})) : (
            <Center>
              <Text>No Links available!</Text>
            </Center>
          )
      }
    </Stack>
  );
}