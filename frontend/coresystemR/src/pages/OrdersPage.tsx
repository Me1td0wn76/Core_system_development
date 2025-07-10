import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Order = {
  id: number;
  product: string;
  quantity: number;
  status: '未発送' | '発送済み';
  date: string;
};

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // APIから注文一覧を取得
  useEffect(() => {
    axios.get<Order[]>('http://localhost:8080/api/orders')
      .then(res => {
        setOrders(
          res.data.map((o) => ({
            id: o.id,
            product: o.product,
            quantity: o.quantity,
            status: o.status === '発送済み' ? '発送済み' : '未発送',
            date: o.date ? o.date.replace('T', ' ').slice(0, 10) : ''
          }))
        );
      })
      .catch(() => setOrders([]));
  }, []);

  // 新規注文追加
  const handleAddOrder = async () => {
    if (!product) return;
    const newOrder = {
      product,
      quantity,
      status: '未発送' as const,
      date: new Date().toISOString(),
    };
    try {
      const res = await axios.post<Order>('http://localhost:8080/api/orders', newOrder);
      const o = res.data;
      setOrders([
        ...orders,
        {
          id: o.id,
          product: o.product,
          quantity: o.quantity,
          status: o.status === '発送済み' ? '発送済み' : '未発送',
          date: o.date ? o.date.replace('T', ' ').slice(0, 10) : ''
        }
      ]);
      setProduct('');
      setQuantity(1);
    } catch {
      // エラー処理
    }
  };

  // 注文ステータス変更
  const handleStatusChange = async (id: number) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const updated: Order = {
      ...order,
      status: order.status === '未発送' ? '発送済み' : '未発送',
      date: new Date(order.date).toISOString() // LocalDateTime互換で送信
    };
    try {
      await axios.put<Order>(`http://localhost:8080/api/orders/${id}`, updated);
      setOrders(orders.map(o =>
        o.id === id ? { ...updated } : o
      ));
    } catch {
      // エラー処理
    }
  };

  // 注文削除
  const handleDeleteOrder = async (id: number) => {
    if (!window.confirm('この注文を削除しますか？')) return;
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
    } catch {
      // エラー処理
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#222' }}>注文管理</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          placeholder="商品名"
          value={product}
          onChange={e => setProduct(e.target.value)}
          style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 80 }}
        />
        <button
          onClick={handleAddOrder}
          style={{
            padding: '8px 24px',
            borderRadius: '4px',
            border: 'none',
            background: '#8884d8',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          新規注文
        </button>
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
            <th>ID</th>
            <th>商品</th>
            <th>数量</th>
            <th>状態</th>
            <th>注文日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td style={{ color: order.status === '未発送' ? 'red' : 'green' }}>{order.status}</td>
              <td>{order.date}</td>
              <td>
                <button
                  onClick={() => handleStatusChange(order.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#8884d8',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginRight: 8
                  }}
                >
                  {order.status === '未発送' ? '発送済みにする' : '未発送に戻す'}
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#f44336',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
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

export default OrdersPage;