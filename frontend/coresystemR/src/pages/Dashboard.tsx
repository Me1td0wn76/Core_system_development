import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleLogout, isAuthenticated, handleAuthError } from '../utils/auth';
import { RoleBadge, PermissionButton } from '../components/PermissionGuard';

const TABS = ['all', 'info', 'warning', 'error', 'success'] as const;
type TabType = typeof TABS[number];

type Notification = {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  link?: string; // 追加: 通知クリックで遷移するパス
  read?: boolean;
};

type Transaction = {
  id: number;
  detail: string;
  date: string;
  amount: string;
};



function Dashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabType>('all');
  const [transactions] = useState<Transaction[]>([
    { id: 1, detail: '売上登録', date: '2025-06-28 10:00', amount: '¥10,000' },
    { id: 2, detail: '在庫補充', date: '2025-06-28 11:00', amount: '¥5,000' }
  ]);
  const intervalRef = useRef<number | null>(null);
  // 仮のユーザー情報（本来は認証情報やAPIから取得）
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    // ここで本来はAPIや認証情報からユーザー情報を取得
    setUser({ role: 'admin' }); // 仮にadminユーザーとしてセット
  }, []);

  // 通知取得
  const fetchNotifications = () => {
    if (!isAuthenticated()) {
      handleLogout(navigate);
      return;
    }

    const token = localStorage.getItem('token');
    axios.get<Notification[]>('http://localhost:8080/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setNotifications(res.data.map(n => ({ ...n, read: false }))))
      .catch((error) => {
        if (error.response?.status === 401) {
          // 認証エラーの場合
          handleAuthError(navigate);
        } else {
          setNotifications([{ type: 'error', message: '通知の取得に失敗しました', read: false }]);
        }
      });
  };

  useEffect(() => {
    // 初回ロード時に認証チェック
    if (!isAuthenticated()) {
      handleLogout(navigate);
      return;
    }

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

  // 通知削除
  const handleDelete = (idx: number) => {
    setNotifications(notifications => notifications.filter((_, i) => i !== idx));
  };

  // 通知クリックで画面遷移
  const handleNotificationClick = (n: Notification, idx: number) => {
    handleRead(idx);
    if (n.link) {
      navigate(n.link);
    }
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
      {/* ヘッダー */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, color: '#222' }}>ダッシュボード</h2>
          <RoleBadge />
        </div>
        <button
          onClick={() => handleLogout(navigate)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: '#fff',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
            e.currentTarget.style.borderColor = '#999';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#ccc';
          }}
          title="ログアウトしてログイン画面に戻る"
        >
          🚪 ログアウト
        </button>
      </div>
      {/* 通知カード */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(3, 3, 3, 0.08)',
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
              style={{
                background: n.read ? '#f5f5f5' : '#fff',
                borderLeft: `8px solid ${getColor(n.type)}`,
                marginBottom: '8px',
                padding: '8px 16px',
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                color: n.read ? '#aaa' : '#222', // ここで黒文字
                fontWeight: n.type === 'error' || n.type === 'warning' ? 'bold' : 'normal',
                opacity: n.read ? 0.5 : 1,
                cursor: n.link ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span
                onClick={() => handleNotificationClick(n, i)}
                style={{ flex: 1 }}
                title={n.link ? "クリックで詳細へ" : ""}
              >
                {n.message}
              </span>
              <PermissionButton
                permission="canDelete"
                onClick={() => handleDelete(i)}
                style={{
                  marginLeft: 12,
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '1.2em',
                  cursor: 'pointer'
                }}
              >
                ×
              </PermissionButton>
            </li>
          ))}
        </ul>
      </div>
      {/* トランザクション一覧カード */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: 24,
        padding: 24
      }}>
        <h3 style={{ color: '#222' }}>トランザクション一覧</h3>
        <table
          border={1}
          cellPadding={8}
          style={{
            width: '100%',
            background: '#fafafa',
            color: '#222' // ここを追加
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>内容</th>
              <th>日時</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.detail}</td>
                <td>{tx.date}</td>
                <td>{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ナビゲーションボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          onClick={() => navigate('/sales')}
        >
          売上管理へ
        </button>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          onClick={() => navigate('/inventory')}
        >
          在庫管理へ
        </button>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          onClick={() => navigate('/customers')}
        >
          顧客管理へ
        </button>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          onClick={() => navigate('/history')}
        >
          操作履歴へ
        </button>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px'
          }}
          onClick={() => navigate('/orders')}
        >
          注文管理へ
        </button>
        {user?.role === 'admin' && (
          <button
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: 'none',
              background: '#8884d8',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '12px'
            }}
            onClick={() => navigate('/users')}
          >
            ユーザー管理へ
          </button>
        )}
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => {
            // ログアウト処理
            localStorage.removeItem('token');
            // 必要なら他のセッション情報も削除
            window.location.href = '/'; // 強制的にログイン画面へ
          }}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
