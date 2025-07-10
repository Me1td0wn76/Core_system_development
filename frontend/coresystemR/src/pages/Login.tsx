import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUserRole } from '../utils/auth';

type User = {
  username: string;
  password?: string;
  role?: string;
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
    axios.get<{ username: string; role: string }>('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser({ username: res.data.username, role: res.data.role });
      setUserRole(res.data.role as 'admin' | 'staff');
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
    // 入力値の前後の空白を除去
    const trimmedForm = {
      username: form.username.trim(),
      password: form.password?.trim() ?? ''
    };
    try {
      const res = await axios.post<{ token: string; username: string; role: string }>('http://localhost:8080/api/auth/login', trimmedForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setUserRole(res.data.role as 'admin' | 'staff');
      setUser({ username: res.data.username, role: res.data.role });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('ユーザー名またはパスワードが間違っています');
      } else if (err.response?.data?.error) {
        setError(`ログイン失敗: ${err.response.data.error}`);
      } else {
        setError('ログイン失敗: サーバーエラーが発生しました');
      }
    }
  };

  // ワンクリックログイン用の関数
  const quickLogin = (username: string, password: string) => {
    setForm({ username, password });
    setTimeout(async () => {
      try {
        // 入力値の前後の空白を除去
        const trimmed = { username: username.trim(), password: password.trim() };
        const res = await axios.post<{ token: string; username: string; role: string }>('http://localhost:8080/api/auth/login', trimmed);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setUserRole(res.data.role as 'admin' | 'staff');
        setUser({ username: res.data.username, role: res.data.role });
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Quick login error:', err);
        setError('ワンクリックログインに失敗しました');
      }
    }, 100);
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
          
          {/* テストアカウント情報 */}
          <div style={{ 
            background: '#333', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            fontSize: '12px',
            color: '#ccc'
          }}>
            <strong style={{ color: '#fff' }}>テストアカウント:</strong><br/>
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                onClick={() => quickLogin('root', 'admin')}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '10px', 
                  background: '#4caf50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                root/admin
              </button>
              <button 
                type="button"
                onClick={() => quickLogin('admin', 'password123')}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '10px', 
                  background: '#4caf50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                admin/password123
              </button>
              <button 
                type="button"
                onClick={() => quickLogin('staff1', 'staff123')}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '10px', 
                  background: '#2196f3', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                staff1/staff123
              </button>
            </div>
          </div>
          
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
