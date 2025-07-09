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
  const [editId, setEditId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const navigate = useNavigate(); // 追加

  useEffect(() => {
    axios.get<InventoryItem[]>('http://localhost:8080/api/inventory/list')
      .then(res => setItems(res.data))
      .catch(_err => alert("在庫データの取得に失敗しました"));
  }, []);

  const handleEdit = (id: number, stock: number) => {
    setEditId(id);
    setEditStock(stock);
  };

  const handleSave = (id: number) => {
    axios.put(`http://localhost:8080/api/inventory/${id}`, { stock: editStock })
      .then(() => {
        setItems(items.map(i => i.id === id ? { ...i, stock: editStock } : i));
        setEditId(null);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>在庫一覧</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>商品名</th>
            <th>在庫数</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => {
            const isLow = i.stock < 5;
            return (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td style={{ color: isLow ? 'red' : 'white' }}>
                  {editId === i.id ? (
                    <input
                      type="number"
                      value={editStock}
                      onChange={e => setEditStock(Number(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  ) : (
                    i.stock
                  )}
                </td>
                <td>{isLow ? '在庫少' : '十分'}</td>
                <td>
                  {editId === i.id ? (
                    <button onClick={() => handleSave(i.id)}>保存</button>
                  ) : (
                    <button onClick={() => handleEdit(i.id, i.stock)}>編集</button>
                  )}
                </td>
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