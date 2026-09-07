import { Box, Typography } from "@mui/material";
import { Navbar } from "@/components/widgets/navbar";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0C",
        color: "#FFFFFF",
        position: "relative",
      }}
    >
      <Navbar />

      {/* Placeholder container to test scrolling and layout */}
      <Box
        id="hero"
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2.5, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          pt: 10,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.2)",
          }}
        >
          Hero Section Next
        </Typography>
      </Box>
    </Box>
  );
}
