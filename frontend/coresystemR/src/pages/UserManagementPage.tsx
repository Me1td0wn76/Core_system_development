import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  role: 'admin' | 'staff';
  email?: string;
  active?: number;
};

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // ユーザー一覧取得
  useEffect(() => {
    axios.get<User[]>('http://localhost:8080/api/users/list')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('ユーザー一覧取得エラー:', err);
        setError('ユーザー一覧の取得に失敗しました');
      });
  }, []);

  // 追加
  const handleAdd = () => {
    setError('');
    setSuccess('');

    if (!username || !password || !email) {
      setError('すべてのフィールドを入力してください');
      return;
    }

    axios.post<User>('http://localhost:8080/api/users/add', { 
      username, 
      password, 
      email, 
      role 
    })
      .then(res => {
        setUsers([...users, res.data]);
        setSuccess('ユーザーが正常に追加されました');
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('staff');
      })
      .catch(err => {
        console.error('ユーザー追加エラー:', err);
        setError(err.response?.data?.message || 'ユーザー追加に失敗しました');
      });
  };

  // 削除
  const handleDelete = (id: number) => {
    setError('');
    setSuccess('');

    axios.delete(`http://localhost:8080/api/users/${id}`)
      .then(() => {
        setUsers(users => users.filter(u => u.id !== id));
        setSuccess('ユーザーが正常に削除されました');
      })
      .catch(err => {
        console.error('ユーザー削除エラー:', err);
        setError(err.response?.data?.message || 'ユーザー削除に失敗しました');
      });
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#222' }}>ユーザー管理</h2>
      
      {error && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#ffebee', 
          color: '#c62828', 
          borderRadius: 4,
          border: '1px solid #e57373'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16, 
          background: '#e8f5e8', 
          color: '#2e7d32', 
          borderRadius: 4,
          border: '1px solid #81c784'
        }}>
          {success}
        </div>
      )}
      
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="ユーザー名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ 
              marginRight: 8, 
              marginBottom: 8,
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ 
              marginRight: 8, 
              marginBottom: 8,
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ 
              marginRight: 8, 
              marginBottom: 8,
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'admin' | 'staff')}
            style={{ 
              marginRight: 8, 
              marginBottom: 8,
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #ccc',
              width: '220px'
            }}
          >
            <option value="admin">管理者</option>
            <option value="staff">スタッフ</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
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
          追加
        </button>
      </div>
      <table border={1} cellPadding={8} style={{ width: '100%', background: '#fafafa', color: '#222' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ユーザー名</th>
            <th>メールアドレス</th>
            <th>権限</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email || 'N/A'}</td>
              <td>{u.role === 'admin' ? '管理者' : 'スタッフ'}</td>
              <td>{u.active === 1 ? 'アクティブ' : '無効'}</td>
              <td>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#f44336',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  disabled={u.role === 'admin'}
                  title={u.role === 'admin' ? '管理者は削除できません' : ''}
                >
                  削除
                </button>
              </td>
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

export default UserManagementPage;