import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleAuthError } from '../utils/auth';

type History = {
  id: number;
  date: string;
  user: string;
  detail: string;
};

function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [sortKey, setSortKey] = useState<'date' | 'user' | 'detail'>('date');
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ロール取得
    const role = localStorage.getItem('userRole') as 'admin' | 'staff' | null;
    setUserRole(role);
    // トークン取得
    const token = localStorage.getItem('token');
    if (!token) {
      handleAuthError(navigate);
      return;
    }
    axios.get('http://localhost:8080/api/sales/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setHistory(
          (res.data as any[]).map((s, idx) => ({
            id: s.id ?? idx,
            date: s.saleDate ? s.saleDate.replace('T', ' ').slice(0, 16) : '',
            user: s.username || s.user || '不明',
            detail: s.productName ? `${s.productName} を${s.amount ? s.amount + '個 ' : ''}操作` : s.detail || '操作',
          }))
        );
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          handleAuthError(navigate);
        } else {
          setError('履歴データの取得に失敗しました');
        }
        setLoading(false);
      });
  }, [navigate]);

  const sorted = [...history]
    .filter(h => h.user.includes(filter) || h.detail.includes(filter))
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  if (loading) return <div style={{ padding: 32 }}>読み込み中...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#222' }}>操作履歴一覧</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="ユーザー名や内容でフィルター"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 240 }}
        />
      </div>
      <table
        border={1}
        cellPadding={8}
        style={{
          width: '100%',
          background: '#fafafa',
          color: '#222'
        }}
      >
        <thead>
          <tr>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('date');
                setSortAsc(sortKey === 'date' ? !sortAsc : true);
              }}
            >
              日時 {sortKey === 'date' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('user');
                setSortAsc(sortKey === 'user' ? !sortAsc : true);
              }}
            >
              ユーザー {sortKey === 'user' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('detail');
                setSortAsc(sortKey === 'detail' ? !sortAsc : true);
              }}
            >
              内容 {sortKey === 'detail' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            {userRole === 'admin' && <th>編集</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map(h => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.user}</td>
              <td>{h.detail}</td>
              {userRole === 'admin' && <td><button disabled>編集</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, textAlign: 'right' }}>
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
          onClick={() => navigate('/dashboard')}
        >
          ダッシュボードへ戻る
        </button>
      </div>
    </div>
  );
}

export default HistoryPage;