import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Oturum kapatma hatası:', error);
      }
    };

    performSignOut();
  }, [auth, navigate]);

  return (
    <div className="logout-container">
      <h1>Çıkış Yapılıyor...</h1>
    </div>
  );
};

export default Logout;
