import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Stack } from "./layout";
import { AppearOnMount, FadeIn, SlideIn } from "./motion";
import { Button, Text } from "./visual";

const meta = {
  title: "Motion",
} satisfies Meta;

export default meta;

// ─── AppearOnMount ───

export const AppearOnMountDefault: StoryObj = {
  name: "AppearOnMount — default",
  render: () => {
    function Demo() {
      const [seed, setSeed] = useState(0);
      return (
        <Stack gap="3">
          <Button onClick={() => setSeed((s) => s + 1)}>Remount</Button>
          <AppearOnMount key={seed}>
            <Box bg="raised" border="default" p="4">
              <Text size="body-sm" color="default">
                I appear on mount. Remount me to see the fade again.
              </Text>
            </Box>
          </AppearOnMount>
        </Stack>
      );
    }
    return <Demo />;
  },
};

// ─── FadeIn ───

export const FadeInDefault: StoryObj = {
  name: "FadeIn — slow",
  render: () => {
    function Demo() {
      const [seed, setSeed] = useState(0);
      return (
        <Stack gap="3">
          <Button onClick={() => setSeed((s) => s + 1)}>Remount</Button>
          <FadeIn key={seed} duration="slow">
            <Box bg="raised" border="default" p="4">
              <Text size="body-sm" color="default">
                Slower fade.
              </Text>
            </Box>
          </FadeIn>
        </Stack>
      );
    }
    return <Demo />;
  },
};

// ─── SlideIn ───

export const SlideInBottom: StoryObj = {
  name: "SlideIn — from bottom",
  render: () => {
    function Demo() {
      const [seed, setSeed] = useState(0);
      return (
        <Stack gap="3">
          <Button onClick={() => setSeed((s) => s + 1)}>Remount</Button>
          <SlideIn key={seed} from="bottom">
            <Box bg="raised" border="default" p="4">
              <Text size="body-sm" color="default">
                I slide in from the bottom.
              </Text>
            </Box>
          </SlideIn>
        </Stack>
      );
    }
    return <Demo />;
  },
};

export const SlideInLeft: StoryObj = {
  name: "SlideIn — from left",
  render: () => {
    function Demo() {
      const [seed, setSeed] = useState(0);
      return (
        <Stack gap="3">
          <Button onClick={() => setSeed((s) => s + 1)}>Remount</Button>
          <SlideIn key={seed} from="left" distance={32}>
            <Box bg="raised" border="default" p="4">
              <Text size="body-sm" color="default">
                I slide from the left, longer distance.
              </Text>
            </Box>
          </SlideIn>
        </Stack>
      );
    }
    return <Demo />;
  },
};
