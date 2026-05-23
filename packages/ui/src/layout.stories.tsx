import type { Meta, StoryObj } from "@storybook/react";
import {
  Box,
  Divider,
  Grid,
  Inline,
  Page,
  PageActions,
  PageBody,
  PageEmptyState,
  PageHeader,
  PageSection,
  Stack,
} from "./layout";
import { Button, Text } from "./visual";

const meta = {
  title: "Layout",
} satisfies Meta;

export default meta;

// ── Stack ──

export const StackPrimitive: StoryObj = {
  name: "Stack",
  render: () => (
    <Stack gap="4">
      <Box bg="raised" border="subtle" p="4">
        one
      </Box>
      <Box bg="raised" border="subtle" p="4">
        two
      </Box>
      <Box bg="raised" border="subtle" p="4">
        three
      </Box>
    </Stack>
  ),
};

// ── Inline ──

export const InlinePrimitive: StoryObj = {
  name: "Inline",
  render: () => (
    <Inline gap="3" wrap>
      {Array.from({ length: 8 }, (_, i) => `chip-${i}`).map((id, i) => (
        <Box key={id} bg="raised" border="subtle" p="3">
          chip {i + 1}
        </Box>
      ))}
    </Inline>
  ),
};

// ── Grid ──

export const GridPrimitive: StoryObj = {
  name: "Grid",
  render: () => (
    <Grid cols={1} mdCols={3} gap="4">
      <Box bg="raised" border="subtle" p="4">
        a
      </Box>
      <Box bg="raised" border="subtle" p="4">
        b
      </Box>
      <Box bg="raised" border="subtle" p="4">
        c
      </Box>
    </Grid>
  ),
};

// ── Box ──

export const BoxPrimitive: StoryObj = {
  name: "Box",
  render: () => (
    <Box bg="raised" border="subtle" p="6" rounded="xl">
      raised box with subtle border
    </Box>
  ),
};

// ── Divider ──

export const DividerPrimitive: StoryObj = {
  name: "Divider",
  render: () => (
    <Stack gap="4">
      <Box bg="raised" border="subtle" p="3">
        above
      </Box>
      <Divider />
      <Box bg="raised" border="subtle" p="3">
        below
      </Box>
    </Stack>
  ),
};

// ── Page ──

export const PagePrimitive: StoryObj = {
  name: "Page",
  render: () => (
    <Page variant="narrow" py="8">
      <Box bg="raised" border="subtle" p="6">
        Page constrains route width — variant="narrow" (48rem). Routes never set max-w-* themselves.
      </Box>
    </Page>
  ),
};

// ── PageHeader ──

export const PageHeaderDefault: StoryObj = {
  name: "PageHeader — default",
  render: () => (
    <PageHeader
      section="01"
      title="Opportunities"
      description="Federal contracting opportunities surfaced and scored."
      actions={
        <>
          <Button variant="ghost">Saved searches</Button>
          <Button>New search</Button>
        </>
      }
    />
  ),
};

export const PageHeaderMinimal: StoryObj = {
  name: "PageHeader — minimal (title only)",
  render: () => <PageHeader title="Settings" />,
};

// ── PageBody ──

export const PageBodyDefault: StoryObj = {
  name: "PageBody — default",
  render: () => (
    <PageBody>
      <Box bg="raised" border="subtle" p="4">
        section 1
      </Box>
      <Box bg="raised" border="subtle" p="4">
        section 2
      </Box>
      <Box bg="raised" border="subtle" p="4">
        section 3
      </Box>
    </PageBody>
  ),
};

// ── PageSection ──

export const PageSectionDefault: StoryObj = {
  name: "PageSection — with header",
  render: () => (
    <PageSection
      section="02"
      title="Recent awards"
      description="Last 30 days, filtered by saved search."
    >
      <Box bg="raised" border="subtle" p="6">
        body content
      </Box>
    </PageSection>
  ),
};

export const PageSectionPlain: StoryObj = {
  name: "PageSection — plain body",
  render: () => (
    <PageSection>
      <Box bg="raised" border="subtle" p="6">
        no header, just the body
      </Box>
    </PageSection>
  ),
};

// ── PageActions ──

export const PageActionsDefault: StoryObj = {
  name: "PageActions — default (end)",
  render: () => (
    <PageActions>
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </PageActions>
  ),
};

export const PageActionsBetween: StoryObj = {
  name: "PageActions — between",
  render: () => (
    <PageActions align="between">
      <Button variant="ghost">Delete</Button>
      <Button>Save</Button>
    </PageActions>
  ),
};

// ── PageEmptyState ──

export const PageEmptyStateDefault: StoryObj = {
  name: "PageEmptyState — default",
  render: () => (
    <PageEmptyState
      title="No opportunities yet"
      description="Save a search to start receiving daily matches from SAM.gov."
      actions={
        <>
          <Button variant="ghost">Browse all</Button>
          <Button>New search</Button>
        </>
      }
    />
  ),
};

export const PageEmptyStateMinimal: StoryObj = {
  name: "PageEmptyState — minimal",
  render: () => <PageEmptyState title="Nothing here" />,
};

// ── Composite ──

export const PageComposite: StoryObj = {
  name: "Page — composite (header + body + sections)",
  render: () => (
    <Page>
      <PageHeader
        section="01"
        title="Opportunities"
        description="Federal contracting opportunities scored against your saved searches."
        actions={<Button>New search</Button>}
      />
      <PageBody>
        <PageSection section="02" title="Recent awards">
          <Box bg="raised" border="subtle" p="6">
            <Text size="body-sm" color="default">
              Pretend the recent-awards table lives here.
            </Text>
          </Box>
        </PageSection>
        <PageSection section="03" title="Pipeline">
          <Box bg="raised" border="subtle" p="6">
            <Text size="body-sm" color="default">
              And the pipeline lives here.
            </Text>
          </Box>
        </PageSection>
      </PageBody>
    </Page>
  ),
};
