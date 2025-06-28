import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Notification = {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
};

function Dashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    axios.get<Notification[]>('http://localhost:8080/api/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => setNotifications([{ type: 'error', message: '通知の取得に失敗しました' }]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // ログイン画面（ルート）に戻る
  };

  // 通知の色分け
  const getColor = (type: string) => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'info': return '#2196f3';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#888';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>ダッシュボード</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>通知</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n, i) => (
            <li
              key={i}
              style={{
                background: '#fff',
                borderLeft: `8px solid ${getColor(n.type)}`,
                marginBottom: '8px',
                padding: '8px 16px',
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                color: getColor(n.type),
                fontWeight: n.type === 'error' || n.type === 'warning' ? 'bold' : 'normal'
              }}
            >
              {n.message}
            </li>
          ))}
        </ul>
      </div>
      <p>ようこそ、{localStorage.getItem('username') || 'ユーザー'}さん！</p>
      <p>ここから各種管理機能にアクセスできます。</p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <button onClick={() => navigate('/sales')}>売上管理へ</button>
        <button onClick={() => navigate('/inventory')}>在庫管理へ</button>
        <button onClick={() => navigate('/customers')}>顧客管理へ</button>
      </div>
      <button
        onClick={handleLogout}
        style={{
          marginTop: '32px',
          padding: '8px 24px',
          borderRadius: '4px',
          border: 'none',
          background: '#8884d8',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ログイン画面に戻る
      </button>
    </div>
  );
}
export default Dashboard;
