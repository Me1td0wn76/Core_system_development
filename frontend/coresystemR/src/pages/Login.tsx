import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  username: string;
  // 他に必要なフィールドがあればここに追加
};

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<User>('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
    }).catch(() => {
      alert('認証エラー。再ログインしてください');
    });
  }, []);

  return (
    <div>
      <h2>ダッシュボード</h2>
      {user ? <p>ようこそ、{user.username}さん</p> : <p>読み込み中...</p>}
    </div>
  );
}

export default Dashboard;
