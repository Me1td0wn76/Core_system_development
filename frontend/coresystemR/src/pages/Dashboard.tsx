import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello', {
      headers: {
        'Authorization': 'Basic ' + btoa('root:admin')
      },
      credentials: 'include'
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error: ${res.status}\n${text}`);
        }
        return res.text();
      })
      .then(setMessage)
      .catch((e) => setMessage('API呼び出し失敗\n' + e.message));
  }, []);

  return (
    <div>
      <h1>ダッシュボード</h1>
      <pre>{message}</pre>
    </div>
  );
};

export default Dashboard;