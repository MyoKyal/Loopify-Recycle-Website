import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        } else {
          console.log('No such document!');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name,
        phone: phone,
        address: address,
      });
      setUserData({ ...userData, name, phone, address });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-loopifyLight py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-loopifyDark font-title">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-loopifyDark">Email</label>
            <p className="mt-1 text-sm text-loopifyMuted">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-loopifyDark">Name</label>
            {editMode ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-loopifyMuted rounded-md shadow-sm focus:outline-none focus:ring-loopifyMain focus:border-loopifyMain sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-sm text-loopifyMuted">{name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-loopifyDark">Phone</label>
            {editMode ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-loopifyMuted rounded-md shadow-sm focus:outline-none focus:ring-loopifyMain focus:border-loopifyMain sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-sm text-loopifyMuted">{phone || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-loopifyDark">Address</label>
            {editMode ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-loopifyMuted rounded-md shadow-sm focus:outline-none focus:ring-loopifyMain focus:border-loopifyMain sm:text-sm"
              ></textarea>
            ) : (
              <p className="mt-1 text-sm text-loopifyMuted">{address || 'Not provided'}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-loopifyMain text-white px-4 py-2 rounded-md hover:bg-loopifySecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loopifyMain"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-loopifyMuted text-loopifyDark px-4 py-2 rounded-md hover:bg-loopifySoft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loopifyMuted"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-loopifyMain text-white px-4 py-2 rounded-md hover:bg-loopifySecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loopifyMain"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
