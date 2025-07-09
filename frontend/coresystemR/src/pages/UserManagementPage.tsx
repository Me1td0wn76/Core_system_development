import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  role: 'admin' | 'staff';
};

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const navigate = useNavigate();

  // ユーザー一覧取得
  useEffect(() => {
    axios.get<User[]>('http://localhost:8080/api/users/list')
      .then(res => setUsers(res.data));
  }, []);

  // 追加
  const handleAdd = () => {
    if (!username) return;
    axios.post<User>('http://localhost:8080/api/users/add', { username, role })
      .then(res => setUsers([...users, res.data]));
    setUsername('');
    setRole('staff');
  };

  // 削除
  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8080/api/users/${id}`)
      .then(() => setUsers(users => users.filter(u => u.id !== id)));
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#222' }}>ユーザー管理</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'admin' | 'staff')}
          style={{ marginRight: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="admin">管理者</option>
          <option value="staff">スタッフ</option>
        </select>
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
            <th>権限</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role === 'admin' ? '管理者' : 'スタッフ'}</td>
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