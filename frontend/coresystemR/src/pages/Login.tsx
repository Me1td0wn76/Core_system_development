import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  username: string;
  password?: string;
};

function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<User>({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    axios.get<{ username: string }>('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser({ username: res.data.username });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post<{ token: string }>('http://localhost:8080/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser({ username: form.username });
    } catch {
      setError('ログイン失敗');
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!user) {
    return (
      <div>
        <h2>ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>ユーザー名: <input name="username" value={form.username} onChange={handleChange} /></label>
          </div>
          <div>
            <label>パスワード: <input name="password" type="password" value={form.password} onChange={handleChange} /></label>
          </div>
          <button type="submit">ログイン</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>ダッシュボード</h2>
      <p>ようこそ、{user.username}さん</p>
    </div>
  );
}

export default Login;
