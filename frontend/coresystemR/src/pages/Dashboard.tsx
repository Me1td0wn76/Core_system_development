import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // ログイン画面（ルート）に戻る
  };
//ユーザ名を表示
  return (
    <div style={{ padding: '20px' }}>
      <h2>ダッシュボード</h2>
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
