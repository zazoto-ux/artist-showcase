import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { TopBar } from "../components/TopBar";

export const MainLayout = () => {
  return (
    <Box bg="gray.50" minH="100vh">
      <TopBar />
      <Box px={10} py={8}>
        <Outlet />
      </Box>
    </Box>
  );
};
