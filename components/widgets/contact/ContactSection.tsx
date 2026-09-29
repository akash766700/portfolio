"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email as EmailIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  ArrowOutward as ArrowOutwardIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { Colors } from "@/utils/enum";
import { PORTFOLIO_DATA } from "@/assets/generic-data";

export default function ContactSection() {
  const { contact } = PORTFOLIO_DATA;
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sentAlert, setSentAlert] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    const mailto = `mailto:${contact.email}?subject=Portfolio Inquiry from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailto;
    setSentAlert(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        position: "relative",
        minHeight: "75vh",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        pt: { xs: 12, md: 16 },
        pb: { xs: 10, md: 14 },
        overflow: "hidden",
      }}
    >
      {/* ── Background Glow ── */}
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: { xs: 300, md: 600 },
          height: { xs: 300, md: 600 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(97, 218, 251, 0.06) 0%, rgba(206, 242, 168, 0.04) 50%, transparent 75%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 6, lg: 10 },
          }}
        >
          {/* ── Left Column: Contact Info & Direct Links ── */}
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 2,
                py: 0.6,
                borderRadius: "20px",
                backgroundColor: "rgba(97, 218, 251, 0.06)",
                border: "1px solid rgba(97, 218, 251, 0.2)",
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#61DAFB",
                  boxShadow: "0 0 8px #61DAFB",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#61DAFB",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                AVAILABLE FOR OPPORTUNITIES
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.4rem", sm: "3.2rem", md: "3.8rem" },
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-titillium-web), sans-serif",
                mb: 2.5,
              }}
            >
              Let’s Build Something{" "}
              <Box
                component="span"
                sx={{
                  color: "#CEF2A8",
                  textShadow: "0 0 35px rgba(206, 242, 168, 0.35)",
                }}
              >
                Remarkable
              </Box>
              .
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                color: Colors.GREY,
                lineHeight: 1.65,
                maxWidth: 500,
                mb: 4.5,
                fontWeight: 300,
              }}
            >
              Have a high-impact product in mind, need interactive 3D WebGL experiences, or want to level up your engineering team? Let's connect.
            </Typography>

            {/* Email Copy Pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.8,
                p: "6px 10px 6px 18px",
                borderRadius: "30px",
                backgroundColor: "rgba(18, 18, 22, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(14px)",
                mb: 4,
              }}
            >
              <EmailIcon sx={{ fontSize: 18, color: "#61DAFB" }} />
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: Colors.WHITE,
                  letterSpacing: "0.02em",
                }}
              >
                {contact.email}
              </Typography>
              <Button
                size="small"
                onClick={handleCopyEmail}
                startIcon={
                  copied ? (
                    <CheckIcon sx={{ fontSize: 14, color: "#CEF2A8" }} />
                  ) : (
                    <CopyIcon sx={{ fontSize: 14 }} />
                  )
                }
                sx={{
                  backgroundColor: copied
                    ? "rgba(206, 242, 168, 0.15)"
                    : "rgba(255, 255, 255, 0.06)",
                  color: copied ? "#CEF2A8" : Colors.WHITE,
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  px: 1.6,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(97, 218, 251, 0.2)",
                  },
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                component="a"
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: Colors.WHITE,
                  "&:hover": {
                    borderColor: "#61DAFB",
                    color: "#61DAFB",
                    backgroundColor: "rgba(97, 218, 251, 0.1)",
                  },
                }}
              >
                <GitHubIcon sx={{ fontSize: 20 }} />
              </IconButton>

              <IconButton
                component="a"
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: Colors.WHITE,
                  "&:hover": {
                    borderColor: "#61DAFB",
                    color: "#61DAFB",
                    backgroundColor: "rgba(97, 218, 251, 0.1)",
                  },
                }}
              >
                <LinkedInIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* ── Right Column: Interactive Quick Message Card ── */}
          <Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3.5, sm: 4.5 },
                borderRadius: "24px",
                backgroundColor: "rgba(18, 18, 22, 0.65)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.6)",
                display: "flex",
                flexDirection: "column",
                gap: 2.6,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: Colors.WHITE,
                  fontFamily: "var(--font-titillium-web), sans-serif",
                }}
              >
                Send a Direct Message
              </Typography>

              <TextField
                label="Your Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: Colors.WHITE,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                    "&:hover fieldset": { borderColor: "#61DAFB" },
                    "&.Mui-focused fieldset": { borderColor: "#61DAFB" },
                  },
                  "& .MuiInputLabel-root": { color: Colors.GREY },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#61DAFB" },
                }}
              />

              <TextField
                label="Your Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: Colors.WHITE,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                    "&:hover fieldset": { borderColor: "#61DAFB" },
                    "&.Mui-focused fieldset": { borderColor: "#61DAFB" },
                  },
                  "& .MuiInputLabel-root": { color: Colors.GREY },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#61DAFB" },
                }}
              />

              <TextField
                label="Project Details or Message"
                variant="outlined"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: Colors.WHITE,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                    "&:hover fieldset": { borderColor: "#61DAFB" },
                    "&.Mui-focused fieldset": { borderColor: "#61DAFB" },
                  },
                  "& .MuiInputLabel-root": { color: Colors.GREY },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#61DAFB" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                sx={{
                  backgroundColor: "#CEF2A8",
                  color: "#0A0A0C",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  py: 1.4,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow: "0 0 25px rgba(206, 242, 168, 0.3)",
                  "&:hover": {
                    backgroundColor: "#b8ea88",
                    boxShadow: "0 0 35px rgba(206, 242, 168, 0.5)",
                  },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={sentAlert}
        autoHideDuration={4000}
        onClose={() => setSentAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSentAlert(false)}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "#182218",
            color: "#CEF2A8",
            border: "1px solid #CEF2A8",
          }}
        >
          Your mail client has been opened to send this message!
        </Alert>
      </Snackbar>
    </Box>
  );
}
