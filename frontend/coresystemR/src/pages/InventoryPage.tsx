import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type InventoryItem = {
  id: number;
  name: string;
  stock: number;
};

function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState<{ type: string; message: string }[]>([]);
  const navigate = useNavigate(); // 追加

  useEffect(() => {
    axios.get<InventoryItem[]>('http://localhost:8080/api/inventory/list')
      .then(res => setItems(res.data))
      .catch(_err => alert("在庫データの取得に失敗しました"));

    // 在庫通知だけ取得
    axios.get<{ type: string; message: string }[]>('http://localhost:8080/api/notifications/inventory')
      .then(res => setNotifications(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>在庫一覧</h2>
      {/* 通知欄追加 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>通知</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n, i) => (
            <li
              key={i}
              style={{
                background: '#fff',
                borderLeft: `8px solid ${n.type === 'warning' ? '#ff9800' : '#888'}`,
                marginBottom: '8px',
                padding: '8px 16px',
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                color: n.type === 'warning' ? '#ff9800' : '#888',
                fontWeight: n.type === 'warning' ? 'bold' : 'normal'
              }}
            >
              {n.message}
            </li>
          ))}
        </ul>
      </div>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>商品名</th>
            <th>在庫数</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const isLow = item.stock < 5;
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td style={{ color: isLow ? 'red' : 'white' }}>{item.stock}</td>
                <td>{isLow ? '在庫少' : '十分'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
       <button
        style={{
          marginTop: '24px',
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
        ダッシュボードに戻る
      </button>
    </div>
  );
}

export default InventoryPage;

// このページは在庫管理のための画面です。将来的には在庫一覧や詳細情報を表示する予定です。
// 現在は基本的な構造のみを提供しています。必要に応じて機能を追加してください。