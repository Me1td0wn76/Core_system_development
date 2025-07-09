import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type User = {
  username: string;
  password?: string;
};

function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<User>({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      navigate('/dashboard');
    }).catch(() => {
      // トークンが無効なら消してログイン画面へ
      localStorage.removeItem('token');
      setLoading(false);
    });
  }, [navigate]);

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
      navigate('/dashboard');
    } catch {
      setError('ログイン失敗');
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'inherit'
      }}>
        <div style={{
          background: '#222',
          padding: '32px 40px',
          borderRadius: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          minWidth: '320px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#fff' }}>ログイン</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#fff' }}>
                ユーザー名: <input name="username" value={form.username} onChange={handleChange} style={{ width: '100%' }} />
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#fff' }}>
                パスワード: <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%' }} />
              </label>
            </div>
            <button type="submit" style={{ width: '100%', padding: '8px 0' }}>ログイン</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
        </div>
      </div>
    );
  }

  // ログイン済みなら何も表示しない
  return null;
}

export default Login;