import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleLogout, isAuthenticated, handleAuthError } from '../utils/auth';
import { RoleBadge, PermissionButton } from '../components/PermissionGuard';
import styles from './Dashboard.module.css';
import { NavButtonFA } from './NavButtonFA';

const TABS = ['all', 'info', 'warning', 'error', 'success'] as const;
type TabType = typeof TABS[number];

type Notification = {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  link?: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const intervalRef = useRef<number | null>(null);
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    setUser({ role: 'admin' });
    // トランザクション履歴をAPIから取得
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/sales/list', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setTransactions(
        (res.data as any[]).map((s) => ({
          id: s.id,
          detail: s.productName || '売上',
          date: s.saleDate ? s.saleDate.replace('T', ' ').slice(0, 16) : '',
          amount: s.amount ? `¥${Number(s.amount).toLocaleString()}` : ''
        }))
      );
    }).catch(() => {
      setTransactions([]);
    });
  }, []);

  const fetchNotifications = () => {
    if (!isAuthenticated()) {
      handleLogout(navigate);
      return;
    }
    const token = localStorage.getItem('token');
    axios.get<Notification[]>('http://localhost:8080/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setNotifications(res.data.map(n => ({ ...n, read: false }))
      ))
      .catch((error) => {
        if (error.response?.status === 401) {
          handleAuthError(navigate);
        } else {
          setNotifications([{ type: 'error', message: '通知の取得に失敗しました', read: false }]);
        }
      });
  };

  useEffect(() => {
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

  const handleRead = (idx: number) => {
    setNotifications(notifications =>
      notifications.map((n, i) => i === idx ? { ...n, read: true } : n)
    );
  };
  const handleDelete = (idx: number) => {
    setNotifications(notifications => notifications.filter((_, i) => i !== idx));
  };
  const handleNotificationClick = (n: Notification, idx: number) => {
    handleRead(idx);
    if (n.link) {
      navigate(n.link);
    }
  };
  const filtered = notifications.filter(n =>
    tab === 'all' ? true : n.type === tab
  );
  const getColor = (type: string) => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'info': return '#2196f3';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#888';
    }
  };

  // --- UI ---
  return (
    <div className={styles.dashboardRoot}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/vite.svg" alt="logo" className={styles.logo} />
          <div>
            <h1 className={styles.headerTitle}>ダッシュボード</h1>
            <div className={styles.headerSub}>ようこそ！快適な業務体験を。</div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <RoleBadge />
          <button
            onClick={() => handleLogout(navigate)}
            className={styles.logoutBtn}
          >
            <span style={{ marginRight: 8 }}>
              <img src="https://fonts.gstatic.com/s/i/materialicons/logout/v15/24px.svg" alt="logout" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
            </span>
            ログアウト
          </button>
        </div>
      </header>
      <main className={styles.mainGrid}>
        {/* 通知カード */}
        <section className={styles.card}>
          <div className={styles.tabs}>
            <h2 style={{ color: '#333', fontWeight: 700, fontSize: 22, margin: 0, flex: 1 }}>通知</h2>
            <div>
              {TABS.map(t => (
                <button
                  key={t}
                  className={tab === t ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
                  onClick={() => setTab(t)}
                >
                  {t === 'all' ? 'すべて' : t}
                </button>
              ))}
            </div>
          </div>
          <ul className={styles.notificationList}>
            {filtered.length === 0 && <li style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>通知はありません</li>}
            {filtered.map((n, i) => (
              <li
                key={i}
                className={n.read ? `${styles.notificationItem} ${styles.notificationItemRead}` : styles.notificationItem}
                style={{ borderLeftColor: getColor(n.type) }}
              >
                <span
                  onClick={() => handleNotificationClick(n, i)}
                  style={{ flex: 1 }}
                  title={n.link ? 'クリックで詳細へ' : '' }
                >
                  {n.message}
                </span>
                <PermissionButton
                  permission="canDelete"
                  onClick={() => handleDelete(i)}
                  style={{
                    marginLeft: 16,
                    background: 'transparent',
                    border: 'none',
                    color: '#888',
                    fontSize: '1.3em',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </PermissionButton>
              </li>
            ))}
          </ul>
        </section>
        {/* トランザクション一覧カード */}
        <section className={styles.card}>
          <h2 style={{ color: '#333', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>トランザクション</h2>
          <div className={styles.transactionList}>
            {transactions.map(tx => (
              <div key={tx.id} className={styles.transactionCard}>
                <div>
                  <span className={styles.transactionDetail}>{tx.detail}</span>
                  <span className={styles.transactionDate}>{tx.date}</span>
                </div>
                <span className={styles.transactionAmount}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* ナビゲーションボタン */}
      <nav className={styles.navGrid}>
        <NavButtonFA iconClass="fa fa-chart-line text-primary" label="売上管理" onClick={() => navigate('/sales')} />
        <NavButtonFA iconClass="fa fa-boxes text-info" label="在庫管理" onClick={() => navigate('/inventory')} />
        <NavButtonFA iconClass="fa fa-users text-success" label="顧客管理" onClick={() => navigate('/customers')} />
        <NavButtonFA iconClass="fa fa-history text-warning" label="操作履歴" onClick={() => navigate('/history')} />
        <NavButtonFA iconClass="fa fa-shopping-cart text-danger" label="注文管理" onClick={() => navigate('/orders')} />
        {user?.role === 'admin' && (
          <NavButtonFA iconClass="fa fa-user-cog text-dark" label="ユーザー管理" onClick={() => navigate('/users')} />
        )}
      </nav>
    </div>
  );
}

export default Dashboard;
