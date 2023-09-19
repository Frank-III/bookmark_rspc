import { Button, Group } from "@mantine/core";
import {
  SpotlightProvider,
  spotlight,
  SpotlightProviderProps,
} from "@mantine/spotlight";
import type { SpotlightAction } from "@mantine/spotlight";
import {
  IconHome,
  IconDashboard,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react";
import { ChildProcess } from "child_process";
import { extend } from "dayjs";
import React, { useEffect } from "react";
import { useState } from "react";

interface SearchProviderProps {
  children?: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [search, setSearch] = useState<string>("");

  const actions: SpotlightAction[] =
    search.trim().length > 0 && !search.includes(":")
      ? ["tag", "collection", "link"].map((kind) => {
          id: `${kind}-1`;
          title: `${kind}:${search}`;
          description: `Search name for ${kind}`;
          onTrigger: () => console.log(`Search for ${kind}:${search}`);
        })
      : [];

  useEffect(() => {
    console.log(actions);
  }, [search]);
  return (
    <SpotlightProvider
      actions={actions}
      query={search}
      onQueryChange={setSearch}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="Search..."
      shortcut="mod + k"
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </SpotlightProvider>
  );
}
