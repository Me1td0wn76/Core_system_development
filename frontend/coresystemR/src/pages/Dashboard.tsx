import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetch('http://localhost:8080/api/hello', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error: ${res.status}\n${text}`);
        }
        return res.text();
      })
      .then(setMessage)
      .catch((e) => setMessage('API呼び出し失敗\n' + e.message));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>ダッシュボード</h1>
      <pre>{message}</pre>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Dashboard;