import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Stack,
  Typography,
  Badge,
  Box,
  useTheme,
  Avatar,
} from "@mui/material";

const ChatItem = React.memo(function ChatItem({
  avatar,
  name,
  _id,
  // groupChat = false,
  isSelected = false,
  role,
  subdomain,
  // isOnline = false,
  // newMessageAlert,
  // handleDeleteChat,
}) {
  // console.log("ChatItem rendered",subdomain);
  const theme = useTheme();

  return (
    <Link
      to={`/${subdomain}/${role}/chat/${_id}`}
      style={{ textDecoration: "none" }}
      // onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: isSelected ? theme.palette.action.selected : "transparent",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            bgcolor: theme.palette.action.hover,
            boxShadow: 1,
          },
        }}
      >
        {/* Avatar with optional online badge */}
        <Badge
          variant="dot"
          color="success"
          overlap="circular"
          // invisible={!isOnline}
          sx={{
            "& .MuiBadge-badge": {
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "2px solid white",
              backgroundColor: "#44b700",
              top: 4,
              right: 4,
            },
          }}
        >
          <Avatar
            src={avatar || "/default-avatar.png"}
            alt={name}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>

        {/* Chat Info */}
        <Stack spacing={0.2} overflow="hidden">
          <Typography
            fontWeight={600}
            color="text.primary"
            noWrap
            sx={{ maxWidth: "180px" }}
          >
            {name}
          </Typography>

          {/* Future use for new message alerts */}
          {/* {newMessageAlert?.count > 0 && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "white",
                px: 1,
                py: 0.25,
                borderRadius: "8px",
                fontWeight: 500,
                display: "inline-block",
                maxWidth: "140px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {newMessageAlert.count} new message{newMessageAlert.count > 1 ? "s" : ""}
            </Typography>
          )} */}
        </Stack>
      </Box>
    </Link>
  );
});



export { ChatItem };