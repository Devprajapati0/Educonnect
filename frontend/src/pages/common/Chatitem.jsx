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
import { useDispatch } from "react-redux";
import { setAvatar } from "../../store/slice/chatSlice.js";


const ChatItem = React.memo(function ChatItem({
  avatar,
  name,
  _id,
  isSelected = false,
  role,
  subdomain,
  newMessageAlert,
  onClick, // NEW
}) {
  console.log("alert",newMessageAlert)
  const theme = useTheme();
   const dispatch = useDispatch();
    const handleClick = () => {
      dispatch(setAvatar({
        image:avatar,
        chatId:_id,
        name:name
      }))
    }
  // const typer = useSelector((state) => state.chat.startTyping)
  return (
    <Link
      to={`/${subdomain}/${role}/chat/${_id}`}
      style={{ textDecoration: "none" }}
      onClick={handleClick} // NEW
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
        <Badge
          variant="dot"
          color="success"
          overlap="circular"
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

        <Stack spacing={0.2} overflow="hidden">
          <Typography
            fontWeight={600}
            color="text.primary"
            noWrap
            sx={{ maxWidth: "180px" }}
          >
            {name}
          </Typography>

          {newMessageAlert?.count > 0 && (
            <Typography
              sx={{
                fontSize: "12px",
                bgcolor: "#1976d2",
                color: "white",
                px: 1,
                py: 0.25,
                borderRadius: "10px",
                display: "inline-block",
                width: "fit-content",
                fontWeight: 500,
              }}
            >
              {newMessageAlert.count} new message
              {newMessageAlert.count > 1 ? "s" : ""}
            </Typography>
          )}
        </Stack>
        
      </Box>
    </Link>
  );
});



export { ChatItem };