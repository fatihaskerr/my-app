import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';


const { Title } = Typography;

const AuthPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleAuth = async ({ email, password }) => {
    if (isRegistering) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Kayıt başarılı!');
        onLogin();
      } catch (error) {
        alert(error.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
        navigate('/home');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Title level={2}>{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</Title>
      <Form
        onFinish={handleAuth}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Lütfen email adresinizi girin!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
          </Button>
        </Form.Item>
      </Form>

      <Button onClick={() => setIsRegistering(!isRegistering)} block>
        {isRegistering ? 'Zaten hesabınız var mı? Giriş Yap' : 'Hesabınız yok mu? Kayıt Ol'}
      </Button>
    </div>
  );
};

export default AuthPage;
