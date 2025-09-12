import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const api = import.meta.env.VITE_API_URL;

function Settings({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState(0);
  const [user, setUser] = useState({ username: "", email: "" });
  const [prevEmail, setPrevEmail] = useState("");
  const [prevUser, setPrevUser] = useState("");

  const handleSignOut = () => {
    axios
      .post(`http://localhost:5001/logout`, {}, { withCredentials: true })
      .finally(() => {
        setIsAuthenticated(false);
        navigate('/login');
        window.localStorage.setItem("logout", Date.now());
      });
  };

  const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/users/${id}`, {withCredentials: true});
            window.location.reload(); // refresh after delete
        } catch (err) {
            console.error("Error deleting user:", err.response?.data || err.message);
        }
    };


  useEffect(() => {
    document.title = "Settings";
    axios.get(`http://localhost:5001/info`, { withCredentials: true })
    .then(res => {
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPrevEmail(res.data.email);
      setPrevUser(res.data.username);
      setId(res.data.id);
    }).catch(err => console.log(err))
  }, []);

    console.log(username);
    console.log(email);
    console.log(prevEmail);
    console.log(prevUser);

  const saveInfo = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    

    try {
      const response = await axios.put(`http://localhost:5001/users/${id}`, {
        username,
        email
      }, {withCredentials: true});

      setUser({ ...user, username, email });
      setPrevEmail(email);
      setPrevUser(username);
      window.location.reload();
    }catch(err)
    {
      console.log(err.respnse?.data || err.message);

      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to update user info. Please try again.");
      }
    }


      console.log("Saved user info:", { username, email });
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Profile</h2>
        <div className="space-y-3">
          <form onSubmit={saveInfo}>
            <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 mt-3">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          {username != prevUser || email != prevEmail ? <button className='bg-blue-500 w-full h-10 font-bold text-white rounded-xl hover:bg-blue-800 mt-8' type='submit'>Save</button> : null}
          </form>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Settings</h2>
        <div className="space-y-3">
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={handleDelete}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings
