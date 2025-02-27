import { useState, useRef, useEffect } from 'react';
import { Camera, Edit2, Link as LinkIcon, MapPin, Mail, Calendar, Globe, Github, Briefcase, Plus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import PageContainer from '../components/PageContainer';
import toast from 'react-hot-toast';

const Profile = () => {
  const { authUser, updateProfile, updateProfileImage } = useAuthStore();
  const { theme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    website: authUser?.website || ''
  });

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || '',
        bio: authUser.bio || '',
        location: authUser.location || '',
        website: authUser.website || ''
      });
    }
  }, [authUser]);

  const handleImageUpload = async (type) => {
    const fileInput = type === 'profile' ? profileImageRef.current : coverImageRef.current;
    fileInput.click();
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      let response;
      if (type === 'profile') {
        response = await updateProfileImage(file);
      } else {
        const formData = new FormData();
        formData.append('coverImage', file);
        response = await updateProfile(formData);
      }

      console.log('Upload response:', response);
      
      if (response) {
        toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} image updated successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error uploading image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(formData);
      if (response) {
        setFormData({
          fullName: response.fullName || '',
          bio: response.bio || '',
          location: response.location || '',
          website: response.website || ''
        });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 text-base-content">
      <div className="min-h-screen pt-16">
        <PageContainer>
          
          <div className="relative mb-24">
            
            <div className="h-48 md:h-64 rounded-xl overflow-hidden border-2 border-base-300">
              <img 
                src={authUser?.coverImage || '/default-cover.jpg'} 
                alt="cover" 
                className="w-full h-full object-cover opacity-50"
              />
              <button 
                onClick={() => handleImageUpload('cover')}
                className="absolute top-4 right-4 p-2 rounded-full bg-base-100/50 hover:bg-base-100/70"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

           
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-base-100 bg-base-300 flex items-center justify-center overflow-hidden">
                  {authUser?.profileImage ? (
                    <img 
                      src={authUser.profileImage} 
                      alt="profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-base-content/40">
                      {authUser?.fullName?.charAt(0)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleImageUpload('profile')}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
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

          
            <div className="absolute -bottom-16 right-8">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-primary gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

         
          {isEditing ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="form-control">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label">Bio</label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="form-control">
                <label className="label">Location</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label">Website</label>
                <input
                  type="url"
                  className="input input-bordered"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="grid md:grid-cols-[2fr,1fr] gap-8">
              <div className="space-y-8">
                
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold">{authUser.fullName}</h1>
                  <p className="text-base-content/70">
                    {authUser.bio || 'No bio yet'}
                  </p>
                  
                 
                  <div className="flex flex-wrap gap-4 text-base-content/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{authUser.location || 'Location not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{authUser.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined March 2024</span>
                    </div>
                  </div>
                </div>

                
                <div className="grid grid-cols-3 gap-4">
                  <div className="card bg-base-200">
                    <div className="card-body p-4 text-center">
                      <div className="text-2xl font-bold">258</div>
                      <div className="text-sm text-base-content/70">Messages</div>
                    </div>
                  </div>
                  <div className="card bg-base-200">
                    <div className="card-body p-4 text-center">
                      <div className="text-2xl font-bold">45</div>
                      <div className="text-sm text-base-content/70">Contacts</div>
                    </div>
                  </div>
                  <div className="card bg-base-200">
                    <div className="card-body p-4 text-center">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-base-content/70">Groups</div>
                    </div>
                  </div>
                </div>

              
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-base-content/70" />
                        <div>
                          <h3 className="font-medium">Full Stack Developer</h3>
                          <p className="text-sm text-base-content/70">Tech Company • 2022 - Present</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-base-content/70" />
                        <div>
                          <h3 className="font-medium">Personal Website</h3>
                          <a href="#" className="text-sm text-primary hover:underline">https://yourwebsite.com</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Github className="w-5 h-5 text-base-content/70" />
                        <div>
                          <h3 className="font-medium">GitHub</h3>
                          <a href="#" className="text-sm text-primary hover:underline">@yourusername</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

           
              <div className="space-y-6">
                
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-sm">Updated profile picture</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-sm">Joined new group "Tech Talk"</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <p className="text-sm">Added new contact</p>
                      </div>
                    </div>
                  </div>
                </div>

               
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
                    <div className="space-y-4">
                      <button className="btn btn-outline w-full gap-2">
                        <Github className="w-4 h-4" />
                        Connect GitHub
                      </button>
                      <button className="btn btn-outline w-full gap-2">
                        <Globe className="w-4 h-4" />
                        Add Website
                      </button>
                      <button className="btn btn-outline w-full gap-2">
                        <Plus className="w-4 h-4" />
                        Add More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

export default Profile;