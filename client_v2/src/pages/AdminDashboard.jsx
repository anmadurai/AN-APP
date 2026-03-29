import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Users as UsersIcon, Play as PlayIcon, Plus, Trash2, ShieldOff, CheckCircle, Edit, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  
  // MODALS
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(false);

  // FORMS
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'client' });
  const [editUserForm, setEditUserForm] = useState({ id: '', password: '' });
  const [videoForm, setVideoForm] = useState({ title: '', youtube_url: '' });
  const [editVideoForm, setEditVideoForm] = useState({ id: '', title: '', youtube_url: '' });

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(`${API_BASE_URL}/users`);
      setUsers(usersRes.data.users);
      const videosRes = await axios.get(`${API_BASE_URL}/videos`);
      setVideos(videosRes.data.videos);
    } catch (err) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- USER ACTIONS ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users`, userForm);
      toast.success('User added successfully');
      setShowAddUser(false);
      setUserForm({ username: '', password: '', role: 'client' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleEditUserPass = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/users/${editUserForm.id}/password`, { password: editUserForm.password });
      toast.success('Password updated successfully');
      setShowEditUser(false);
      setEditUserForm({ id: '', password: '' });
      fetchData(); // to reflect potential session revocation
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        toast.success('User deleted');
        fetchData();
      } catch (err) { toast.error('Delete failed'); }
    }
  };

  const handleRevokeSession = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/${id}/revoke-session`);
      toast.success('Session revoked');
      fetchData();
    } catch (err) { toast.error('Revoke failed'); }
  };

  // --- VIDEO ACTIONS ---
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/videos`, videoForm);
      toast.success('Video added');
      setShowAddVideo(false);
      setVideoForm({ title: '', youtube_url: '' });
      fetchData();
    } catch (err) { toast.error('Failed to add video'); }
  };

  const handleEditVideo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/videos/${editVideoForm.id}`, { 
        title: editVideoForm.title, 
        youtube_url: editVideoForm.youtube_url 
      });
      toast.success('Video updated successfully');
      setShowEditVideo(false);
      setEditVideoForm({ id: '', title: '', youtube_url: '' });
      fetchData();
    } catch (err) { toast.error('Failed to update video'); }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Delete video?')) {
      try {
        await axios.delete(`${API_BASE_URL}/videos/${id}`);
        toast.success('Video removed');
        fetchData();
      } catch (err) { toast.error('Delete failed'); }
    }
  };

  return (
    <div style={{ paddingBottom: '4rem', minHeight: '90vh' }}>
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '2rem 0',
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Management portal for users and sermons</p>
          </div>
          <div style={{ 
            display: 'flex', 
            background: 'var(--background)',
            padding: '4px',
            borderRadius: '10px',
            gap: '4px' 
          }}>
            <button 
              className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{ padding: '0.5rem 1rem' }}
            >
              <UsersIcon size={18} /> Users
            </button>
            <button 
              className={`btn ${activeTab === 'videos' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('videos')}
              style={{ padding: '0.5rem 1rem' }}
            >
              <PlayIcon size={18} /> Videos
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {activeTab === 'users' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Active Users ({users.length})</h2>
              <button onClick={() => setShowAddUser(true)} className="btn btn-primary">
                <Plus size={18} /> Add New User
              </button>
            </div>

            <div style={{ overflowX: 'auto', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--background)' }}>
                   <tr>
                     <th style={{ padding: '1rem' }}>User</th>
                     <th style={{ padding: '1rem' }}>Role</th>
                     <th style={{ padding: '1rem' }}>Sess Status</th>
                     <th style={{ padding: '1rem' }}>Added On</th>
                     <th style={{ padding: '1rem' }}>Actions</th>
                   </tr>
                </thead>
                <tbody>
                   {users.map(user => (
                     <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                       <td style={{ padding: '1rem', fontWeight: 600 }}>{user.username}</td>
                       <td style={{ padding: '1rem' }}>
                         <span style={{ 
                           padding: '0.2rem 0.6rem', 
                           background: user.role === 'admin' ? '#fee2e2' : '#e0f2fe',
                           color: user.role === 'admin' ? '#991b1b' : '#075985',
                           borderRadius: '4px',
                           fontSize: '0.75rem',
                           fontWeight: 700
                         }}>{user.role.toUpperCase()}</span>
                       </td>
                       <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             {user.current_session_id ? (
                               <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                 <CheckCircle size={14} /> Active
                               </span>
                             ) : (
                               <span style={{ color: 'var(--text-muted)' }}>Idle</span>
                             )}
                          </div>
                       </td>
                       <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                       <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                             {user.current_session_id && (
                                <button className="btn btn-secondary" onClick={() => handleRevokeSession(user.id)} title="Revoke Session" style={{ padding: '0.4rem' }}>
                                  <ShieldOff size={16} />
                                </button>
                             )}
                             <button className="btn btn-secondary" 
                               onClick={() => {
                                 setEditUserForm({ id: user.id, password: '' });
                                 setShowEditUser(true);
                               }} 
                               title="Change Password" style={{ padding: '0.4rem', color: 'var(--primary)' }}>
                               <Key size={16} />
                             </button>
                             <button className="btn btn-secondary" onClick={() => handleDeleteUser(user.id)} title="Delete User" style={{ color: 'var(--error)', padding: '0.4rem' }}>
                               <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Sermon Collection ({videos.length})</h2>
              <button onClick={() => setShowAddVideo(true)} className="btn btn-primary">
                <Plus size={18} /> Add Sermon Video
              </button>
            </div>

            <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
              {videos.map(vid => (
                <div key={vid.id} style={{ 
                  background: 'var(--surface)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                   <img src={vid.thumbnail_url} alt="" style={{ width: '80px', borderRadius: '4px' }} />
                   <div style={{ flex: 1 }}>
                     <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{vid.title}</h4>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vid.youtube_video_id}</p>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <button onClick={() => {
                         setEditVideoForm({ id: vid.id, title: vid.title, youtube_url: vid.youtube_video_id });
                         setShowEditVideo(true);
                     }} style={{ color: 'var(--primary)' }} title="Edit">
                       <Edit size={18} />
                     </button>
                     <button onClick={() => handleDeleteVideo(vid.id)} style={{ color: 'var(--error)' }} title="Delete">
                       <Trash2 size={18} />
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* ADD USER */}
        {showAddUser && (
          <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Create New Account</h3>
                <form onSubmit={handleAddUser}>
                   <div style={{ marginBottom: '1rem' }}>
                     <label>Username</label>
                     <input type="text" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ marginBottom: '1rem' }}>
                     <label>Temporary Password</label>
                     <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ marginBottom: '1.5rem' }}>
                     <label>Account Role</label>
                     <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }}>
                        <option value="client">Client / Member</option>
                        <option value="admin">Administrator</option>
                     </select>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => setShowAddUser(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save User</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}

        {/* EDIT USER */}
        {showEditUser && (
          <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Change User Password</h3>
                <form onSubmit={handleEditUserPass}>
                   <div style={{ marginBottom: '1rem' }}>
                     <label>New Password</label>
                     <input type="password" value={editUserForm.password} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required minLength={6} />
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => setShowEditUser(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Password</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}

        {/* ADD VIDEO */}
        {showAddVideo && (
          <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Upload Sermon Metadata</h3>
                <form onSubmit={handleAddVideo}>
                   <div style={{ marginBottom: '1rem' }}>
                     <label>Sermon Title</label>
                     <input type="text" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ marginBottom: '1.5rem' }}>
                     <label>YouTube Link or ID</label>
                     <input type="text" value={videoForm.youtube_url} onChange={e => setVideoForm({...videoForm, youtube_url: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => setShowAddVideo(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Sermon</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}

        {/* EDIT VIDEO */}
        {showEditVideo && (
          <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Edit Sermon Metadata</h3>
                <form onSubmit={handleEditVideo}>
                   <div style={{ marginBottom: '1rem' }}>
                     <label>Sermon Title</label>
                     <input type="text" value={editVideoForm.title} onChange={e => setEditVideoForm({...editVideoForm, title: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ marginBottom: '1.5rem' }}>
                     <label>YouTube Link or ID</label>
                     <input type="text" value={editVideoForm.youtube_url} onChange={e => setEditVideoForm({...editVideoForm, youtube_url: e.target.value})} className="btn" style={{ background: 'var(--background)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }} required />
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => setShowEditVideo(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Sermon</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        label { font-size: 0.85rem; font-weight: 600; color: var(--secondary); }
        th { color: var(--secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        @media (max-width: 640px) {
          h1 { font-size: 1.5rem; }
          .container { flex-direction: column; align-items: flex-start !important; gap: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
