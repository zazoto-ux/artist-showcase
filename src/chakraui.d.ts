import { PropsWithChildren } from "react";

declare module "@chakra-ui/react" {
  export interface PaginationNextTriggerProps extends PropsWithChildren {}

  interface PaginationPrevTriggerProps {
    children?: React.ReactNode; // same for previous trigger
  }
}
