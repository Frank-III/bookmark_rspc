import {
  Text,
  Alert,
  Aside,
  Center,
  Divider,
  Loader,
  MediaQuery,
} from "@mantine/core";
import { CalendarLinks } from "./calendar_links";
import { DateLinks } from "./calendar_picker";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { rspc } from "../utils/rspc";
import dayjs from "dayjs";
import { IconAlertCircle } from "@tabler/icons-react";
import { useIsFetching } from "@tanstack/react-query";

export function AsideView() {
  // TODO: fix this

  const { getToken, isSignedIn, userId } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const {
    status: dateLinkStatus,
    error,
    data: dateLinks,
    isFetching,
  } = rspc.useQuery(
    ["links.getByDate", selectedDate?.toISOString()?.slice(0, 10)],
    { enabled: isSignedIn && !!selectedDate },
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const LinksView = () => {
    switch (dateLinkStatus) {
      case "loading":
        return (
          <Center mt="lg">
            <Loader variant="dots" />
          </Center>
        );
        break;

      case "error":
        return error.code === 400 ? (
          <Text mt="lg">Please choose a date!</Text>
        ) : (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="yellow"
          >
            You may want to Log in or Register Now!
          </Alert>
        );
        break;
      case "success":
        return <CalendarLinks date={selectedDate} links={dateLinks} />;
    }
  };

  return (
    <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
      <Aside p="md" hiddenBreakpoint="md" width={{ sm: 200, lg: 300 }}>
        <DateLinks onDateChange={handleDateChange} />
        <Divider my="sm" />
        {/* TODO: use switch here*/}
        <LinksView />
      </Aside>
    </MediaQuery>
  );
}
