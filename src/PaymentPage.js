import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCustomer } from './utils';
import { Button, Form, Input, Typography } from 'antd';

const { Title } = Typography;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice: initialTotalPrice, tripType } = location.state || {};
  
  const [form] = Form.useForm();
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);

  useEffect(() => {
    if (tripType === 'round-trip') {
      setTotalPrice(initialTotalPrice);
    } else {
      setTotalPrice(initialTotalPrice);
    }
  }, [tripType, initialTotalPrice]);

  const handlePayment = async () => {
    try {
      const values = await form.validateFields();
      const { userName } = values;

      const isPaymentSuccessful = true; 

      if (isPaymentSuccessful) {
        setIsPaymentConfirmed(true);
        await addCustomer(userName); 
        sendConfirmationEmail();
      } else {
        setIsPaymentConfirmed(false);
      }
    } catch (error) {
      console.error('Ödeme işlemi sırasında bir hata oluştu:', error);
    }
  };

  const sendConfirmationEmail = () => {
    console.log('Ödeme onaylandı. Onay maili gönderildi.');
  };

  const logout = () => {
    navigate('/login');
  };

  return (
    <div className="payment-container" style={{ textAlign: 'center', padding: '100px' }}>
      {isPaymentConfirmed ? (
        <div className="payment-confirmation">
          <Title level={2}>
            Ödeme Onaylandı
          </Title>
          <p>Ödemeniz başarıyla tamamlandı.</p>
          <p>Rezervasyon onayı mail olarak gönderildi.</p>
          <Button type="primary" onClick={logout} style={{ width: '10%' }}>
            Çıkış Yap
          </Button>
        </div>
      ) : (
        <div className="payment-form">
          <Title level={2}>
            Ödeme Bilgileri
          </Title>
          <Form form={form} onFinish={handlePayment} layout="vertical">
            <Form.Item
              label="Kart Numarası"
              name="cardNumber"
              rules={[{ required: true, message: 'Kart numarası zorunludur' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Son Kullanma Tarihi"
              name="cardExpiry"
              rules={[{ required: true, message: 'Son kullanma tarihi zorunludur' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="CVC"
              name="cardCVC"
              rules={[{ required: true, message: 'CVC zorunludur' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Kullanıcı Adı"
              name="userName"
              rules={[{ required: true, message: 'Kullanıcı adı zorunludur' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <p>Toplam Fiyat: {totalPrice} TL</p>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Ödemeyi Tamamla
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
