import dayjs from "dayjs";
import { Link } from "../../bindings";
import { Paper, Stack, Text, Divider, Card, Center } from "@mantine/core";


interface DateLinksProps {
  date: Date;
  links?: Link[];
}


export function CalendarLinks({date, links}: DateLinksProps) {

  return (
    <Stack>
      <Paper>
        <div className="flex">
          <Divider orientation="vertical" color="green"/>
          <Text>
            {dayjs(date).format('YYYY-MM-DD')}
          </Text>
        </div>
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