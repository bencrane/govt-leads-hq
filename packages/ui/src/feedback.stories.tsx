import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { Drawer, Modal } from "./dialog";
import { Banner } from "./feedback";
import { Stack } from "./layout";
import { Toast, useToastQueue } from "./toast";
import { Tooltip } from "./tooltip";
import { Button, Text } from "./visual";

const meta = {
  title: "Feedback",
} satisfies Meta;

export default meta;

// ─── Banner ───

export const BannerInfo: StoryObj = {
  name: "Banner — info",
  render: () => (
    <Banner tone="info" title="NIGHTLY SYNC">
      Daily SAM.gov ingest completes at 03:00 UTC.
    </Banner>
  ),
};

export const BannerSuccess: StoryObj = {
  name: "Banner — success",
  render: () => (
    <Banner tone="success" title="SAVED">
      Search saved. We'll notify you when a matching award posts.
    </Banner>
  ),
};

export const BannerWarn: StoryObj = {
  name: "Banner — warn",
  render: () => (
    <Banner tone="warn" title="STALE FEED">
      Data engine last refresh was 6 hours ago.
    </Banner>
  ),
};

export const BannerError: StoryObj = {
  name: "Banner — error",
  render: () => (
    <Banner tone="error" title="ERR" onDismiss={() => {}}>
      Failed to load opportunities. Retry.
    </Banner>
  ),
};

// ─── Modal ───

export const ModalDefault: StoryObj = {
  name: "Modal — default",
  render: () => {
    function ModalDemo() {
      const [open, setOpen] = useState(false);
      const container = useRef<HTMLDivElement>(null);
      return (
        <div ref={container} style={{ position: "relative", minHeight: "300px" }}>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Modal
            open={open}
            onOpenChange={setOpen}
            title="Confirm action"
            description="This will remove the saved search."
            portalContainer={container.current}
            actions={
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Confirm</Button>
              </>
            }
          >
            <Text size="body-sm" color="muted">
              You can re-create the search later from any opportunity list.
            </Text>
          </Modal>
        </div>
      );
    }
    return <ModalDemo />;
  },
};

// ─── Drawer ───

export const DrawerRight: StoryObj = {
  name: "Drawer — right",
  render: () => {
    function DrawerDemo() {
      const [open, setOpen] = useState(false);
      const container = useRef<HTMLDivElement>(null);
      return (
        <div
          ref={container}
          style={{ position: "relative", minHeight: "400px", overflow: "hidden" }}
        >
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="Opportunity detail"
            portalContainer={container.current}
          >
            <Stack gap="4">
              <Text size="body-sm" color="default">
                Solicitation 12345-DOE-2026
              </Text>
              <Text size="body-sm" color="muted">
                NAICS 541330 — engineering services. Posted 2026-05-12.
              </Text>
            </Stack>
          </Drawer>
        </div>
      );
    }
    return <DrawerDemo />;
  },
};

export const DrawerLeft: StoryObj = {
  name: "Drawer — left",
  render: () => {
    function DrawerDemo() {
      const [open, setOpen] = useState(false);
      const container = useRef<HTMLDivElement>(null);
      return (
        <div
          ref={container}
          style={{ position: "relative", minHeight: "400px", overflow: "hidden" }}
        >
          <Button onClick={() => setOpen(true)}>Open left drawer</Button>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            side="left"
            title="Filters"
            portalContainer={container.current}
          >
            <Text size="body-sm" color="default">
              Pretend filters live here.
            </Text>
          </Drawer>
        </div>
      );
    }
    return <DrawerDemo />;
  },
};

// ─── Tooltip ───

export const TooltipDefault: StoryObj = {
  name: "Tooltip — default",
  render: () => {
    function TipDemo() {
      const container = useRef<HTMLDivElement>(null);
      return (
        <div ref={container} style={{ padding: "32px" }}>
          <Tooltip label="Cmd-K — open search" portalContainer={container.current}>
            <Button variant="secondary">Search</Button>
          </Tooltip>
        </div>
      );
    }
    return <TipDemo />;
  },
};

// ─── Toast ───

export const ToastQueue: StoryObj = {
  name: "Toast — queue",
  render: () => {
    function ToastDemo() {
      const { toasts, push, dismiss } = useToastQueue();
      return (
        <Stack gap="3" align="start">
          <Button
            onClick={() =>
              push({
                tone: "success",
                title: "SAVED",
                description: "Search persisted to your workspace.",
              })
            }
          >
            Push success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              push({ tone: "error", title: "ERR", description: "Could not reach the data engine." })
            }
          >
            Push error
          </Button>
          <Toast toasts={toasts} onDismiss={dismiss} />
        </Stack>
      );
    }
    return <ToastDemo />;
  },
};
