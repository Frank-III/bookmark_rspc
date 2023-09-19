import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function UserButton() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild></DropdownMenu.Trigger>
    </DropdownMenu.Root>
  );
}
