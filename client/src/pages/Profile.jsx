import { useAuth } from '../context/AuthContext';
const Profile = () => {
  const { user } = useAuth();
  return <div style={{ padding: 40 }}><h1>Profile: {user?.fullName}</h1></div>;
};
export default Profile;