import { Fragment, useState } from "react";
import {
  Stack,
  Divider,
  Box,
  Tabs,
  Tab,
  Typography,
  Fab,
  Dialog,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ChatItem } from "./ChatItem.jsx";
import NewChatDialogContent from "./NewChatDialogContent.jsx";
import {
  useCreateGroupChatMutation,
  useGetAllUsersBasedOnRoleQuery,
} from "../../store/api/api.js";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";
  return { institution, role };
}

const ChatList = ({
  categorizedChats = {},
  flag,
  setFlag,
  newMessageAlert,
  categories,
}) => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("students");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const chats = categorizedChats[selectedTab] || [];
  const { institution, role } = getInstitutionAndRoleFromPath();
  const [createGroupChat] = useCreateGroupChatMutation();

  const handleStartChat = (user) => {
    const avatar = user.avatar || null;
    const chatData = {
      name: user.name,
      description: null,
      subdomain: institution,
      role,
      members: [
        {
          _id: user._id,
          role: user.role,
          name: user.name,
          avatar: avatar,
        },
      ],
      groupchat: false,
      addmembersallowed: false,
      sendmessageallowed: true,
      avatar: avatar,
    };

    createGroupChat(chatData)
      .unwrap()
      .then((response) => {
        if (response.success === false) {
          console.error("Error creating chat:", response.message);
          return toast.error(response.message);
        }
        toast.success(response.message);
        setFlag(!flag);
      })
      .catch((error) => {
        console.error("Error creating chat:", error);
        toast.error("Error creating chat");
      });

    setDialogOpen(false);
  };

  const { data, isLoading, isError } = useGetAllUsersBasedOnRoleQuery({
    subdomain: institution,
    role,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    toast.error("Something went wrong");
    return null;
  }

  return (
    <Fragment>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          px: 2,
          py: 2,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
        >
          Your Chats
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "capitalize",
              fontWeight: 500,
            },
          }}
        >
          {categories.map((cat) => {
            const hasUnreadInCategory = (categorizedChats[cat] || []).some(
              (chat) => {
                const alert = newMessageAlert?.find(
                  (item) => item.chatId === chat._id
                );
                return alert && alert.count > 0;
              }
            );

            return (
              <Tab
                key={cat}
                value={cat}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {cat}
                    {hasUnreadInCategory && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "#1976d2",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
            pr: 1,
          }}
        >
          <Stack spacing={1}>
            {chats.length > 0 ? (
              chats.map((chat) => {
                const alert = newMessageAlert?.find(
                  (item) => item.chatId === chat._id
                );

                return (
                  <ChatItem
                    key={chat._id}
                    avatar={chat.avatar}
                    name={chat.name}
                    _id={chat._id}
                    isSelected={chat._id === id}
                    onClick={() => {}}
                    subdomain={institution}
                    role={role}
                    newMessageAlert={alert}
                  />
                );
              })
            ) : (
              <Typography>No chats available</Typography>
            )}
          </Stack>
        </Box>

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setDialogOpen(true)}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1300,
          }}
        >
          <EditIcon />
        </Fab>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <NewChatDialogContent
            data={data?.data || []}
            onStartChat={handleStartChat}
            onClose={() => setDialogOpen(false)}
          />
        </Dialog>
      </Box>
    </Fragment>
  );
};

export { ChatList };