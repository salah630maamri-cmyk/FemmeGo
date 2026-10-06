import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function FemmeGoApp() {
  const [step, setStep] = useState('phone_input');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [role, setRole] = useState('');
  const [destination, setDestination] = useState('');
  const [priceOffer, setPriceOffer] = useState('');
  const [activeRides, setActiveRides] = useState([]);
  const [notification, setNotification] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 9) {
      alert('يرجى إدخال رقم هاتف صحيح في الجزائر');
      return;
    }
    setNotification('تم إرسال رمز التحقق إلى هاتفك 📱');
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== '1234') {
      alert('رمز التحقق التجريبي هو: 1234');
      return;
    }
    setNotification('تم تسجيل الدخول بنجاح! 🎉');
    setStep('role_select');
  };

  const handleSelectRole = async (selectedRole) => {
    setRole(selectedRole);
    await supabase.from('profiles').upsert([
      { phone: phone, role: selectedRole, is_verified: true }
    ]);
    setStep('dashboard');
    if (selectedRole === 'driver') {
      fetchDriverRequests();
    }
  };

  const handleCreateRide = async () => {
    if (!destination || !priceOffer) {
      alert('يرجى إدخال الوجهة والسعر المقترح');
      return;
    }
    const { error } = await supabase.from('rides').insert([
      { customer_phone: phone, pickup: 'الجزائر العاصمة', dropoff: destination, price: priceOffer + ' دج', status: 'pending' }
    ]);
    if (error) {
      alert('خطأ: ' + error.message);
    } else {
      setNotification('تم إرسال طلبك للسائقات بنجاح! 🟢');
      setDestination('');
      setPriceOffer('');
    }
  };

  const fetchDriverRequests = async () => {
    let { data } = await supabase.from('rides').select('*').eq('status', 'pending');
    if (data) setActiveRides(data);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ color: '#d63384', textAlign: 'center' }}>FemmeGo - الجزائر 🚗</h2>
      {notification && <div style={{ background: '#d1e7dd', color: '#0f5132', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{notification}</div>}

      {step === 'phone_input' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>تسجيل الدخول برقم الهاتف</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <span style={{ padding: '10px', background: '#eee', borderRadius: '5px' }}>+213</span>
            <input type="tel" placeholder="06XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <button onClick={handleSendOtp} style={{ width: '100%', padding: '10px', background: '#d63384', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>إرسال الرمز</button>
        </div>
      )}

      {step === 'otp' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>أدخل رمز التحقق (جرب 1234)</h3>
          <input type="text" placeholder="رمز التحقق" value={otpCode} onChange={(e) => setOtp
