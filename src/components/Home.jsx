import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Home</h2>
      {user ? <p>Welcome, {user.username}!</p> : <p>Welcome!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
