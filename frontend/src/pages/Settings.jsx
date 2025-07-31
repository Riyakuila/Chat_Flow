import { useState, useRef } from "react";
import PageContainer from "../components/PageContainer";
import { 
  Bell, 
  Camera, 
  Globe, 
  Image, 
  Key, 
  Lock, 
  MessageSquare, 
  Moon, 
  Palette, 
  Shield, 
  Smartphone, 
  User, 
  Volume2 
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";
import toast from 'react-hot-toast';


const Settings = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    messages: true,
    updates: false,
    marketing: false,
    sound: true,
    preview: true,
  });

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    website: authUser?.website || ''
  });

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  const handleImageUpload = (type) => {
    if (type === 'profile') {
      profileImageRef.current?.click();
    } else {
      coverImageRef.current?.click();
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append(type === 'profile' ? 'profileImage' : 'coverImage', file);

    try {
      await updateProfile(formData);
      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} image updated successfully`);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "chat", label: "Chat Settings", icon: MessageSquare },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen pt-16">
      <PageContainer>
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text">
              Settings
            </h1>
            <p className="mt-2 text-base-content/70">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-[240px,1fr] gap-8">
            
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                      : "hover:bg-base-200"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

        
            <div className="card bg-base-200">
              <div className="card-body">
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    
            
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="flex items-center justify-center w-24 h-24 overflow-hidden rounded-full bg-base-300">
                          {authUser?.profileImage ? (
                            <img 
                              src={authUser.profileImage} 
                              alt="Profile" 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="w-12 h-12 text-base-content/40" />
                          )}
                        </div>
                        <button 
                          onClick={() => handleImageUpload('profile')}
                          className="absolute bottom-0 right-0 p-2 text-white transition-colors bg-purple-600 rounded-full hover:bg-purple-700"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="mb-2 text-sm text-base-content/70">
                          Upload a profile picture or choose from our avatars
                        </p>
                        <button 
                          onClick={() => handleImageUpload('profile')}
                          className="gap-2 btn btn-sm btn-outline"
                        >
                          <Image className="w-4 h-4" />
                          Choose Picture
                        </button>
                      </div>
                    </div>

            
                    <input 
                      type="file"
                      ref={profileImageRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profile')}
                    />
                    <input 
                      type="file"
                      ref={coverImageRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'cover')}
                    />

              
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="w-full max-w-md form-control">
                        <label className="label">
                          <span className="font-medium label-text">Display Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Your display name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="w-full max-w-md form-control">
                        <label className="label">
                          <span className="font-medium label-text">About</span>
                        </label>
                        <textarea
                          className="h-24 textarea textarea-bordered"
                          placeholder="Tell us about yourself"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                      </div>

                      <div className="w-full max-w-md form-control">
                        <label className="label">
                          <span className="font-medium label-text">Location</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Your location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>

                      <div className="w-full max-w-md form-control">
                        <label className="label">
                          <span className="font-medium label-text">Website</span>
                        </label>
                        <input
                          type="url"
                          className="input input-bordered"
                          placeholder="Your website URL"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <span className="loading loading-spinner"></span>
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Chat Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Chat Backup</h3>
                          <p className="text-sm text-base-content/70">
                            Automatically backup your chat history
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={true}
                        />
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Media Auto-Download</h3>
                          <p className="text-sm text-base-content/70">
                            Automatically download media files
                          </p>
                        </div>
                        <select className="w-48 select select-bordered">
                          <option>Wi-Fi Only</option>
                          <option>Always</option>
                          <option>Never</option>
                        </select>
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Chat Wallpaper</h3>
                          <p className="text-sm text-base-content/70">
                            Choose a background for your chats
                          </p>
                        </div>
                        <button className="gap-2 btn btn-outline">
                          <Image className="w-4 h-4" />
                          Choose Wallpaper
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Appearance</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between max-w-md">
                        <div>
                          <h3 className="font-medium">Theme Mode</h3>
                          <p className="text-sm text-base-content/70">
                            Choose between light and dark mode
                          </p>
                        </div>
                        <ThemeToggle />
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Font Size</h3>
                        <input 
                          type="range" 
                          className="range range-primary" 
                          step={25} 
                        />
                        <div className="flex justify-between text-sm text-base-content/70">
                          <span>Small</span>
                          <span>Medium</span>
                          <span>Large</span>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Language</h3>
                        <select className="w-full max-w-md select select-bordered">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Chinese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Message Notifications</h3>
                          <p className="text-sm text-base-content/70">
                            Get notified when you receive a message
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.messages}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              messages: e.target.checked,
                            })
                          }
                        />
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notification Sound</h3>
                          <p className="text-sm text-base-content/70">
                            Play sound for new messages
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.sound}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              sound: e.target.checked,
                            })
                          }
                        />
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Message Preview</h3>
                          <p className="text-sm text-base-content/70">
                            Show message content in notifications
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.preview}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              preview: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Privacy & Security</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-base-content/70">
                            Add an extra layer of security
                          </p>
                        </div>
                        <button className="gap-2 btn btn-outline">
                          <Lock className="w-4 h-4" />
                          Enable 2FA
                        </button>
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Last Seen</h3>
                          <p className="text-sm text-base-content/70">
                            Control who can see your last seen status
                          </p>
                        </div>
                        <select className="select select-bordered">
                          <option>Everyone</option>
                          <option>My Contacts</option>
                          <option>Nobody</option>
                        </select>
                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Read Receipts</h3>
                          <p className="text-sm text-base-content/70">
                            Show when you've read messages
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked
                        />
                      </div>

                      <div className="divider"></div>

                      <button className="w-full max-w-md gap-2 btn btn-outline">
                        <Key className="w-4 h-4" />
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Settings;
