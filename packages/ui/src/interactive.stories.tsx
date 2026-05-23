import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "./interactive";
import { Stack } from "./layout";
import { Text } from "./visual";

const meta = {
  title: "Interactive",
} satisfies Meta;

export default meta;

// ─── Tabs ───

export const TabsDefault: StoryObj = {
  name: "Tabs — default",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("overview");
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="Opportunity sections">
            <Tab value="overview">Overview</Tab>
            <Tab value="awards" count={142}>
              Awards
            </Tab>
            <Tab value="contacts" count={28}>
              Contacts
            </Tab>
            <Tab value="docs">Docs</Tab>
          </TabList>
          <TabPanel value="overview">
            <Stack gap="2">
              <Text size="body-sm" color="default">
                The overview tab.
              </Text>
            </Stack>
          </TabPanel>
          <TabPanel value="awards">
            <Text size="body-sm" color="default">
              The awards tab.
            </Text>
          </TabPanel>
          <TabPanel value="contacts">
            <Text size="body-sm" color="default">
              The contacts tab.
            </Text>
          </TabPanel>
          <TabPanel value="docs">
            <Text size="body-sm" color="default">
              The docs tab.
            </Text>
          </TabPanel>
        </Tabs>
      );
    }
    return <Demo />;
  },
};

export const TabsWithDisabled: StoryObj = {
  name: "Tabs — with disabled",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("active");
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="Pipeline stages">
            <Tab value="active">Active</Tab>
            <Tab value="archived" disabled>
              Archived
            </Tab>
            <Tab value="all">All</Tab>
          </TabList>
          <TabPanel value="active">
            <Text size="body-sm" color="default">
              Active items.
            </Text>
          </TabPanel>
          <TabPanel value="all">
            <Text size="body-sm" color="default">
              All items.
            </Text>
          </TabPanel>
        </Tabs>
      );
    }
    return <Demo />;
  },
};

export const TabsKeepMounted: StoryObj = {
  name: "Tabs — keepMounted",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("a");
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="Persistent">
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a" keepMounted>
            <Text size="body-sm" color="default">
              Panel A — mounted even when inactive.
            </Text>
          </TabPanel>
          <TabPanel value="b" keepMounted>
            <Text size="body-sm" color="default">
              Panel B — mounted even when inactive.
            </Text>
          </TabPanel>
        </Tabs>
      );
    }
    return <Demo />;
  },
};
