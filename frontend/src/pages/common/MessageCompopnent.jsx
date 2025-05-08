import { memo } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { fileFormat } from "./RenderAttachment";
import { RenderAttachment } from "./RenderAttachment";
import { useSelector } from "react-redux";


// Fallback avatar card if needed
const AvatarCard = ({ avatar }) => (
  <Avatar src={avatar} sx={{ width: 40, height: 40, ml: 1 }} />
);

const MessageComponent = ({ message }) => {
    // console.log("message", message)
  const { user } = useSelector((state) => state.auth);

  if (!message) return null;

  const sender = message?.sender || {};
  const content = message?.content || "";
  const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
  const createdAt = message?.createdAt || new Date().toISOString();

  if (!content && attachments.length === 0) return null;

  const isUserMessage = sender?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: isUserMessage ? "100%" : "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: isUserMessage ? "flex-end" : "flex-start",
        marginBottom: "1rem",
        width: "100%",
      }}
    >
      {!isUserMessage && (
        <Avatar
          src={sender?.avatar}
          alt={sender?.name || "User"}
          sx={{ width: 40, height: 40, mr: 1 }}
        />
      )}

      <Box
        sx={{
          maxWidth: "70%",
          p: 1.5,
          borderRadius: 2,
          bgcolor: isUserMessage ? "#dcf8c6" : "#f2f2f2",
          boxShadow: 1,
        }}
      >
        {sender?.name && (
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "gray", mb: 0.5 }}
          >
            {sender.name}
          </Typography>
        )}

        {content && (
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {content}
          </Typography>
        )}

        {attachments.length > 0 &&
          attachments.map((file, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <a
                href={file?.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black", textDecoration: "none" }}
                download
              >
                {RenderAttachment(fileFormat(file?.url), file?.url)}
              </a>
            </Box>
          ))}

        <Typography
          variant="caption"
          sx={{ color: "gray", display: "block", mt: 1 }}
        >
          {new Date(createdAt).toLocaleString()}
        </Typography>
      </Box>

      {isUserMessage && <AvatarCard avatar={sender?.avatar} />}
    </motion.div>
  );
};

export default memo(MessageComponent);