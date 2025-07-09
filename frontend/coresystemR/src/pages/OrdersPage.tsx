import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Order = {
  id: number;
  product: string;
  quantity: number;
  status: '未発送' | '発送済み';
  date: string;
};

const dummyOrders: Order[] = [
  { id: 1, product: 'りんご', quantity: 2, status: '未発送', date: '2025-06-28' },
  { id: 2, product: 'バナナ', quantity: 1, status: '発送済み', date: '2025-06-27' },
];

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddOrder = () => {
    if (!product) return;
    setOrders([
      ...orders,
      {
        id: orders.length + 1,
        product,
        quantity,
        status: '未発送',
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setProduct('');
    setQuantity(1);
  };

  const handleStatusChange = (id: number) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === id
          ? { ...order, status: order.status === '未発送' ? '発送済み' : '未発送' }
          : order
      )
    );
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
                    cursor: 'pointer'
                  }}
                >
                  {order.status === '未発送' ? '発送済みにする' : '未発送に戻す'}
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