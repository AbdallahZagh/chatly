import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Signup is handled in the unified Auth page; redirect to /login
    navigate('/login');
  }, [navigate]);
  return null;
};

export default Signup;
