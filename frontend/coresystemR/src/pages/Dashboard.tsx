import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

type Notification = {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  read?: boolean;
};

const TABS = ['all', 'info', 'warning', 'error', 'success'] as const;
type TabType = typeof TABS[number];

function Dashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabType>('all');
  const intervalRef = useRef<number | null>(null);

  // 通知取得
  const fetchNotifications = () => {
    axios.get<Notification[]>('http://localhost:8080/api/notifications')
      .then(res => setNotifications(res.data.map(n => ({ ...n, read: false }))))
      .catch(() => setNotifications([{ type: 'error', message: '通知の取得に失敗しました', read: false }]));
  };

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 既読処理
  const handleRead = (idx: number) => {
    setNotifications(notifications =>
      notifications.map((n, i) => i === idx ? { ...n, read: true } : n)
    );
  };

  // タブ切替
  const filtered = notifications.filter(n =>
    tab === 'all' ? true : n.type === tab
  );

  // 色分け
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
    <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>
      <h2>ダッシュボード</h2>
      {/* 通知カード */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        marginBottom: 24,
        padding: 24
      }}>
        <h3 style={{ color: '#222' }}>通知</h3>
        <div style={{ marginBottom: 12 }}>
          {TABS.map(t => (
            <button
              key={t}
              style={{
                marginRight: 8,
                padding: '4px 16px',
                borderRadius: 4,
                border: tab === t ? '2px solid #8884d8' : '1px solid #ccc',
                background: tab === t ? '#f0f0ff' : '#fafafa',
                color: tab === t ? '#8884d8' : '#333',
                fontWeight: tab === t ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
              onClick={() => setTab(t)}
            >
              {t === 'all' ? 'すべて' : t}
            </button>
          ))}
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map((n, i) => (
            <li
              key={i}
              onClick={() => handleRead(i)}
              style={{
                background: n.read ? '#f5f5f5' : '#fff',
                borderLeft: `8px solid ${getColor(n.type)}`,
                marginBottom: '8px',
                padding: '8px 16px',
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                color: n.read ? '#aaa' : '#222', // 通知の文字色を黒に
                fontWeight: n.type === 'error' || n.type === 'warning' ? 'bold' : 'normal',
                opacity: n.read ? 0.5 : 1,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              title="クリックで既読"
            >
              {n.message}
            </li>
          ))}
        </ul>
      </div>
      {/* 管理ページへの遷移ボタン */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <button onClick={() => window.location.href = '/sales'}>売上管理へ</button>
        <button onClick={() => window.location.href = '/inventory'}>在庫管理へ</button>
        <button onClick={() => window.location.href = '/customers'}>顧客管理へ</button>
      </div>
      {/* ここにグラフや履歴など他のカードを追加 */}
      {/* ... */}
    </div>
  );
}

export default Dashboard;
