import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Customer[]>('http://localhost:8080/api/customers/list')
      .then(res => setCustomers(res.data))
      .catch(_err => alert("顧客データの取得に失敗しました"));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>顧客一覧</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>氏名</th>
            <th>メールアドレス</th>
            <th>電話番号</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
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

export default CustomerPage;