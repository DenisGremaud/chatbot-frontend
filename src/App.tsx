import { 
	useCallback, 
	useEffect, 
	useState 
} from "react";
import { 
	Grid, 
	Box
} from "@mui/material";
import ChatView from "./components/chatview/chatview";
import Sidebar from "./components/sidebar/sidebar";
import WelcomeBarComponent from "./components/welcomebar/welcomebar";
import ChatManager from "./components/chatview/chatmanager";
import AideModal from "./components/moadalhelp/modalhelp";
import ContactModal from "./components/modalcontact/modalcontact";
import { 
	MessageProps 
} from "./components/message/message";
import "./App.css";
import Config from "./config/config";

function App() {
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [listSessions, setListSessions] = useState<string[]>([]);
  const [chatManager] = useState(ChatManager.getInstance());
  const [activeSession, setActiveSession] = useState<string | null>(() => localStorage.getItem('sessionId'));
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  console.log('API URL:', Config.API_URL);
  console.log('API URL:', process.env.REACT_APP_BACKEND_URL);

  const handleOpenCloseHelpModal = () => {
	setHelpModalOpen((prev) => !prev);
  };

  const handleOpenCloseContactModal = () => {
	setContactModalOpen((prev) => !prev);
  }

  const handleOpenCloseNavMenu = () => {
    setShowNavMenu((prev) => !prev);
  };

  const handleRestoreSession = useCallback((sessionId: string) => {
    chatManager.restoreSession(sessionId);
    setActiveSession(sessionId);
    setShowNavMenu(false);
  }, [chatManager]);

  const handleCreateNewChat = useCallback(() => {
    chatManager.createNewSession();
	setShowNavMenu(false);
  }, [chatManager]);

  const initSessions = useCallback(async () => {
    try {
	  if (!chatManager.getUserUUID()) {
		await chatManager.createUserUUID();
	  } else {
		const isUserUUIDValid = await chatManager.testIfUserUUIDExists();
		if (!isUserUUIDValid) {
			await chatManager.createUserUUID();
		}
	  }
      const sessions = (await chatManager.getUserSessions())
      setListSessions(sessions);
      if (sessions.length > 0) {
        const storedSessionId = localStorage.getItem('sessionId');

        if (storedSessionId && sessions.includes(storedSessionId)) {
          setActiveSession(storedSessionId);
          chatManager.restoreSession(storedSessionId);
        } else {
          setActiveSession(sessions[0]);
          localStorage.setItem('sessionId', sessions[0]);
          chatManager.restoreSession(sessions[0]);
        }
      } else {
        chatManager.createNewSession();
      }
    } catch (error) {
      console.error('Error in initApp:', error);
    }
  }, [chatManager]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
	if (event.ctrlKey && event.key === 'b') {
	  event.preventDefault();
	  handleOpenCloseNavMenu();
	} else if (event.ctrlKey && event.shiftKey && event.key === 'o') {
	  event.preventDefault();
	  handleCreateNewChat();
	}
  }, [handleCreateNewChat]);

  useEffect(() => {
    chatManager.setNewMessageCallback((newMessages) => {
	  setMessages(newMessages);
	});
    chatManager.setNewSessionCallback((newSessionId) => {
      setActiveSession(newSessionId);
	  localStorage.setItem('sessionId', newSessionId);
	  initSessions();
    });
    initSessions();
	window.addEventListener('keydown', handleKeyDown);
    return () => {
	  window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chatManager, handleKeyDown, initSessions]);

  return (
    <Box className="App">
      <WelcomeBarComponent handleOpenCloseNavMenu={handleOpenCloseNavMenu} />
      <Grid container className="App-container">
        <Grid
          item
          xs={12}
          sm={12}
          md={showNavMenu ? 3 : 0}
          lg={showNavMenu ? 3 : 0}
          xl={showNavMenu ? 2 : 0}
          className={`Sidebar ${showNavMenu ? 'show' : 'hide'}`}
        >
          <Sidebar
            listSessions={listSessions}
            onRestoreSession={handleRestoreSession}
            onCreateNewChat={handleCreateNewChat}
            activeSessionId={activeSession}
			onHelpClick={handleOpenCloseHelpModal}
			onContactClick={handleOpenCloseContactModal}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={showNavMenu ? 9 : 12}
          lg={showNavMenu ? 9 : 12}
          xl={showNavMenu ? 10 : 12}
          className="Chat-container"
        >
          <ChatView messages={messages} isSidebarOpen={showNavMenu} />
        </Grid>
      </Grid>
	  <AideModal open={helpModalOpen} handleClose={handleOpenCloseHelpModal} />
	  <ContactModal open={contactModalOpen} handleClose={handleOpenCloseContactModal} />
    </Box>
  );
}

export default App;