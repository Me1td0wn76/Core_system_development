import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.text())
      .then(setMessage);
  }, []);

  return (
    <div>
      <h1>ダッシュボード</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;