import { RefObject, useState } from 'react';
import { Divider, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { on } from 'events';

interface DateLinksProps {
  onDateChange: (date: Date) => void
}
export function DateLinks({onDateChange}: DateLinksProps) {
  // get today date as Date
  const today = dayjs().toDate();

  const [value, setValue] = useState<Date | undefined>();
  const handleChange = (date: Date) => {
    setValue(date);
    onDateChange(date);
  }
  return (
    <>
    <Group position="center">
      <DatePicker value={value} onChange={handleChange} excludeDate={(d) => { return (d > today)}} />
    </Group>
    </>
  );
}
