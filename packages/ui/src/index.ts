/**
 * @govt-leads-hq/ui — UI primitives.
 *
 * Sub-layers:
 *   - Layout primitives (`layout.tsx`) own geometry: Stack, Inline, Grid, Box,
 *     Divider, Page, plus Page-chrome (PageHeader, PageBody, PageSection,
 *     PageActions, PageEmptyState).
 *   - Visual primitives (`visual.tsx`) own surface/type/color: Text, Card,
 *     Badge, Button.
 *   - Form primitives (`form.tsx`) — Field, Label, Input, Textarea, Select,
 *     MultiSelect, Combobox, TagInput, NumberInput, DateRangePicker, Checkbox,
 *     FieldGroup, FormErrors.
 *   - Display primitives (`display.tsx`) — Avatar, Stat, KVTable, DataTable,
 *     Pagination, Spinner, SectionLabel, ScrollArea, CompanyLogo.
 *   - Feedback primitives (`feedback.tsx`) — Drawer, Modal, Tooltip, Banner,
 *     Toast (+ useToastQueue helper).
 *   - Motion primitives (`motion.tsx`) — AppearOnMount, FadeIn, SlideIn.
 *   - Interactive primitives (`interactive.tsx`) — Tabs, TabList, Tab, TabPanel.
 *
 * Source-exported — there is no compiled build; consumers import `./src`
 * directly. `build` runs `tsc --noEmit` as a typecheck. See ADR-08 in
 * `docs/design-decisions.md` for the rationale.
 */

// ── Layout sub-layer ──
export {
  Stack,
  Inline,
  Grid,
  Box,
  Divider,
  Page,
  PageHeader,
  PageBody,
  PageSection,
  PageActions,
  PageEmptyState,
  type StackProps,
  type InlineProps,
  type GridProps,
  type BoxProps,
  type DividerProps,
  type PageProps,
  type PageHeaderProps,
  type PageBodyProps,
  type PageSectionProps,
  type PageActionsProps,
  type PageEmptyStateProps,
} from "./layout";

// ── Visual sub-layer ──
export {
  Text,
  Card,
  Badge,
  Button,
  type TextProps,
  type CardProps,
  type BadgeProps,
  type BadgeTone,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./visual";

// ── Form sub-layer ──
export {
  Field,
  Label,
  Input,
  Textarea,
  NumberInput,
  Checkbox,
  Select,
  MultiSelect,
  Combobox,
  TagInput,
  DateRangePicker,
  FieldGroup,
  FormErrors,
  type FieldProps,
  type LabelProps,
  type InputProps,
  type TextareaProps,
  type NumberInputProps,
  type CheckboxProps,
  type SelectProps,
  type SelectOption,
  type MultiSelectProps,
  type MultiSelectOption,
  type ComboboxProps,
  type TagInputProps,
  type DateRangePickerProps,
  type DateRange,
  type FieldGroupProps,
  type FormErrorsProps,
  type FormErrorEntry,
} from "./form";

// ── Display sub-layer ──
export {
  Avatar,
  CompanyLogo,
  Stat,
  KVTable,
  DataTable,
  Pagination,
  Spinner,
  SectionLabel,
  ScrollArea,
  type AvatarProps,
  type CompanyLogoProps,
  type StatProps,
  type KVRow,
  type KVTableProps,
  type DataTableColumn,
  type DataTableProps,
  type PaginationProps,
  type SpinnerProps,
  type SectionLabelProps,
  type ScrollAreaProps,
} from "./display";

// ── Feedback sub-layer ──
export {
  Banner,
  type BannerProps,
  type BannerTone,
} from "./feedback";

export {
  Modal,
  Drawer,
  type ModalProps,
  type ModalSize,
  type DrawerProps,
  type DrawerSide,
} from "./dialog";

export { Tooltip, type TooltipProps } from "./tooltip";

export {
  Toast,
  useToastQueue,
  type ToastProps,
  type ToastInstance,
  type ToastTone,
} from "./toast";

// ── Motion sub-layer ──
export {
  AppearOnMount,
  FadeIn,
  SlideIn,
  type SlideInProps,
} from "./motion";

// ── Interactive sub-layer ──
export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TabsProps,
  type TabListProps,
  type TabProps,
  type TabPanelProps,
} from "./interactive";

// ── Token-prop utilities ──
export {
  cx,
  type SpacingProp,
  type TextColorProp,
  type SurfaceProp,
  type BorderProp,
  type FontSizeProp,
  type PageVariantProp,
} from "./utils";
