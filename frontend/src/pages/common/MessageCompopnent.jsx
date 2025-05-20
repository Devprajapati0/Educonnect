import { memo, useEffect, useState } from "react";
import { Avatar, Box, Typography, Paper, Badge } from "@mui/material";
import { motion } from "framer-motion";
import { fileFormat } from "./RenderAttachment";
import { RenderAttachment } from "./RenderAttachment";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Enhanced avatar component with status indicator
const AvatarWithStatus = ({ avatar, name, isOnline = false, isUser = false }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Avatar
        src={avatar}
        alt={name || "User"}
        sx={{
          width: 44,
          height: 44,
          border: isUser ? "2px solid #3a7bd5" : "2px solid #e4e8ef",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
      {isOnline && (
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: isUser ? "#00d2ff" : "#4caf50",
            border: "2px solid #fff",
          }}
        />
      )}
    </Box>
  );
};

// Formatted time component
const TimeIndicator = ({ timestamp }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date and time without year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString() + ' · ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Typography 
      variant="caption" 
      sx={{ 
        color: "inherit", 
        fontSize: "0.7rem", 
        fontWeight: 500,
        opacity: 0.8,
      }}
    >
      {formatTime(timestamp)}
    </Typography>
  );
};

const MessageComponent = ({ message }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state) => state.auth);
  

  
  if (!message) return null;
  
  const sender = message?.sender || {};
  const content = message?.content || "";
  const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
  const createdAt = message?.createdAt || new Date().toISOString();
  
  if (!content && attachments.length === 0) return null;
  
  const isUserMessage = sender?._id === user?._id;
  
  // Customize colors based on message type
  const messageBgColor = isUserMessage 
    ? '#10B981' 
    : 'grey';
  
  const messageTextColor = isUserMessage ? '#fff' : '#fff';
  
  // Animation variants
  const messageVariants = {
    initial: { 
      opacity: 0, 
      x: isUserMessage ? 20 : -20,
      y: 10
    },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 40,
        mass: 1
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        display: "flex",
        justifyContent: isUserMessage ? "flex-end" : "flex-start",
        marginBottom: "1rem",
        width: "100%",
        padding: "0 8px",
      }}
    >
      {!isUserMessage && (
        <Box sx={{ mr: 1.5, alignSelf: "flex-end", mb: 0.5 }}>
          <AvatarWithStatus 
            avatar={sender?.avatar} 
            name={sender?.name} 
            isOnline={true}
            isUser={false}
          />
        </Box>
      )}
      
      <Box
        sx={{
          maxWidth: isMobile ? "85%" : "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUserMessage ? "flex-end" : "flex-start",
        }}
      >
        {sender?.name && !isUserMessage && (
          <Typography
            variant="body2"
            sx={{ 
              fontWeight: 600, 
              color: "#4a5568",
              mb: 0.5,
              ml: 1,
              fontSize: "0.85rem" 
            }}
          >
            {sender.name}
          </Typography>
        )}

        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: isUserMessage ? "18px 18px 0 18px" : "18px 18px 18px 0",
            background: messageBgColor,
            color: messageTextColor,
            position: "relative",
            maxWidth: "100%",
            wordBreak: "break-word",
            boxShadow: isUserMessage 
              ? "0 2px 8px rgba(58, 123, 213, 0.2)" 
              : "0 2px 8px rgba(0, 0, 0, 0.05)",
            border: isUserMessage 
              ? "none" 
              : "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          {content && (
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: "0.95rem",
                lineHeight: 1.5,
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              {content}
            </Typography>
          )}

          {attachments.length > 0 && (
            <Box sx={{ mt: content ? 1.5 : 0 }}>
              {attachments.map((file, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mt: index > 0 ? 1 : 0,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: isUserMessage ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.1)",
                    bgcolor: isUserMessage ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <a
                    href={file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: isUserMessage ? "#fff" : "#000", 
                      textDecoration: "none",
                      display: "block",
                    }}
                    download
                  >
                    {RenderAttachment(fileFormat(file?.url), file?.url)}
                  </a>
                </Box>
              ))}
            </Box>
          )}

          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              mt: 0.5,
              opacity: 0.8,
            }}
          >
            <TimeIndicator timestamp={createdAt} />
          </Box>
        </Paper>
      </Box>

      {isUserMessage && (
        <Box sx={{ ml: 1.5, alignSelf: "flex-end", mb: 0.5 }}>
          <AvatarWithStatus 
            avatar={sender?.avatar} 
            name="You" 
            isOnline={true}
            isUser={true}
          />
        </Box>
      )}
    </motion.div>
  );
};

export default memo(MessageComponent);