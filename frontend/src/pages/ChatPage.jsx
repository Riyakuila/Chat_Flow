import { useState, useEffect, useRef } from 'react';
import { Search, Menu, MoreVertical, Phone, Video, Send, Smile, Paperclip, Circle, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { format } from 'date-fns';
import axiosInstance from '../lib/axiosInstance';

const ChatPage = () => {
  const { authUser } = useAuthStore();
  const { 
    chats, 
    messages, 
    selectedChat, 
    isLoadingChats,
    isLoadingMessages,
    fetchChats,
    sendMessage,
    setSelectedChat,
    createChat,
    subscribeToMessages,
    unsubscribeFromMessages,
    handleNewMessage,
    restoreChat,
    unreadMessages
  } = useChatStore();
  
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Restore chat state on component mount
    restoreChat();
    
    // Set up message subscription
    subscribeToMessages();

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up message subscription");
      unsubscribeFromMessages();
    };
  }, [subscribeToMessages, unsubscribeFromMessages, restoreChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users');
        // Filter out current user from the list
        const filteredUsers = response.data.filter(user => user._id !== authUser?._id);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, [authUser]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add console logs to debug
  useEffect(() => {
    console.log('Auth User:', authUser);
    console.log('All Users:', allUsers);
    console.log('Chats:', chats);
    console.log('Selected Chat:', selectedChat);
    console.log('Messages:', messages);
  }, [authUser, allUsers, chats, selectedChat, messages]);

  // Debug log to check unread messages
  useEffect(() => {
    console.log("Current unread messages:", unreadMessages);
  }, [unreadMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      await sendMessage(selectedChat.participantId, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startNewChat = async (userId) => {
    try {
      const selectedUser = allUsers.find(user => user._id === userId);
      const chatData = await createChat(userId);
      // Add the user info to the chat object
      const chatWithUserInfo = {
        ...chatData,
        participantId: userId,
        participant: selectedUser
      };
      setSelectedChat(chatWithUserInfo);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  // Helper function to get the other user in the chat
  const getOtherUser = (chat) => {
    if (!chat || !authUser || !allUsers) return null;
    const otherUser = allUsers.find(user => user._id === chat.participantId);
    return otherUser || null;
  };

  // Helper function to safely format date
  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className="h-screen pt-16 flex bg-base-100">
      {/* Sidebar */}
      <div className="w-[320px] border-r border-base-300 flex flex-col bg-base-100">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
              {authUser?.profileImage ? (
                <img 
                  src={authUser.profileImage} 
                  alt="profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-base-content/40">
                  {authUser?.fullName?.charAt(0)}
                </span>
              )}
            </div>
            <h2 className="font-semibold">{authUser?.fullName}</h2>
          </div>
          <button className="btn btn-ghost btn-sm">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => {
                const unreadCount = unreadMessages[user._id] || 0; // Get unread count
                console.log(`Unread messages for ${user.fullName}:`, unreadCount); // Debug log

                return (
                  <div 
                    key={user._id}
                    onClick={() => startNewChat(user._id)}
                    className="flex items-center gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors relative"
                  >
                    {/* User Avatar with Online Status */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                        {user.profilePic ? (
                          <img 
                            src={user.profilePic} 
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-base-content/40">
                            {user.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      {/* Online Status Indicator */}
                      {user.isOnline && (
                        <div className="absolute -top-1 -right-1">
                          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {user.fullName}
                        </h3>
                        <span className="text-xs text-base-content/50">
                          {user.isOnline ? (
                            <span className="text-green-500">Active now</span>
                          ) : (
                            'Offline'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Unread Count Indicator */}
                    {unreadCount > 0 && (
                      <div className="absolute top-1 right-1 bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Picture and Name */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                  {getOtherUser(selectedChat)?.profilePic ? (
                    <img 
                      src={getOtherUser(selectedChat).profilePic} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-lg font-semibold">
                      {getOtherUser(selectedChat)?.fullName?.charAt(0)}
                    </span>
                  )}
                </div>
                {getOtherUser(selectedChat)?.isOnline && (
                  <div className="absolute -top-1 -right-1">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {getOtherUser(selectedChat)?.fullName}
                </h3>
                <p className="text-xs text-gray-500">
                  {getOtherUser(selectedChat)?.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-ghost btn-sm">
                <Phone className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost btn-sm">
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingMessages ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : messages?.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.senderId === authUser?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] break-words rounded-lg px-4 py-2 ${
                      msg.senderId === authUser?._id
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-base-200 rounded-bl-none'
                    }`}
                  >
                    <p className="mb-1">{msg.content}</p>
                    <p className="text-xs opacity-70 text-right">
                      {formatMessageTime(msg.createdAt || msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button type="button" className="btn btn-ghost btn-circle btn-sm">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="btn btn-ghost btn-circle btn-sm">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 input input-bordered focus:outline-none"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="btn btn-primary btn-circle btn-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Empty state when no chat is selected
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
            <p className="text-gray-500">Select an Account to Start a Conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;