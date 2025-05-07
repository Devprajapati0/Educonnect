import { Box, IconButton, Typography, Avatar } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CallIcon from "@mui/icons-material/Call"
import SettingsIcon from "@mui/icons-material/Settings"

const LeftSidebar = () => {
  return (
    <Box
      sx={{
        width: 80,
        height: "100vh",
        bgcolor: "grey.900",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        gap: 2,
        borderRight: "1px solid #333",
      }}
    >
      <Avatar src="/logo.png" />
      <IconButton sx={{ color: "white" }}>
        <ChatIcon />
      </IconButton>
      <IconButton sx={{ color: "white" }}>
        <CallIcon />
      </IconButton>
      <IconButton sx={{ color: "white" }}>
        <SettingsIcon />
      </IconButton>
    </Box>
  )
}


const ChatList = () => {
  return (
    <Box
      sx={{
        width: 300,
        height: "100vh",
        bgcolor: "grey.950",
        color: "white",
        borderRight: "1px solid #333",
        p: 2,
      }}
    >
      <Typography variant="h6" mb={2}>Placement Updates</Typography>
      <Typography fontSize={13} color="grey.400" mb={2}>
        ~ Pankaj Kumar added Antrima 🌸
      </Typography>
      <Typography fontSize={14}>
        Today mock interview are postponed and the details would be shared soon.
      </Typography>
    </Box>
  )
}

import SearchIcon from "@mui/icons-material/Search"

import VideocamIcon from "@mui/icons-material/Videocam"
import MoreVertIcon from "@mui/icons-material/MoreVert"

const TopBar = () => {
  return (
    <Box
      sx={{
        height: 60,
        bgcolor: "grey.900",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src="/group.png" />
        <Box>
          <Typography fontWeight="bold">2026 Placement Updates Official</Typography>
          <Typography fontSize={12} color="grey.400">Group • 245 members</Typography>
        </Box>
      </Box>

      <Box>
        <IconButton sx={{ color: "white" }}><SearchIcon /></IconButton>
        <IconButton sx={{ color: "white" }}><CallIcon /></IconButton>
        <IconButton sx={{ color: "white" }}><VideocamIcon /></IconButton>
        <IconButton sx={{ color: "white" }}><MoreVertIcon /></IconButton>
      </Box>
    </Box>
  )
}

const Conversation = () => {
  const messages = [
    { from: "Antrima 🌸", content: "Dear Student, mock interview details soon.", time: "2:26 PM" },
    { from: "Pankaj Kumar", content: "Harneek and Ayushi cleared the technical rounds.", time: "3:35 PM" },
  ]

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#000",
        color: "white",
        p: 2,
        overflowY: "auto",
        height: "calc(100vh - 60px)", // minus top bar
      }}
    >
      {messages.map((msg, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography fontSize={12} color="grey.400">{msg.from}</Typography>
          <Typography fontSize={14}>{msg.content}</Typography>
          <Typography fontSize={10} color="grey.600">{msg.time}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export {
  LeftSidebar,
  ChatList,
  TopBar,
  Conversation
}

