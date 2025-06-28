import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type SalesData = {
  month: string;
  sales: number;
  profit: number;
};

function SalesPage() {
  const [year, setYear] = useState<number>(2025);
  const [data, setData] = useState<SalesData[]>([]);
  const navigate = useNavigate();

  const fetchSalesData = async (year: number) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/sales/chart?year=${year}`);
      setData(res.data as SalesData[]);
    } catch (err) {
      alert("データ取得に失敗しました");
    }
  };

  useEffect(() => {
    fetchSalesData(year);
  }, [year]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{year}年 売上・利益推移グラフ</h2>

      <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
        <option value={2024}>2024年</option>
        <option value={2025}>2025年</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${v / 1000}千円`} />
          <Tooltip formatter={(v: any) => `${v.toLocaleString()} 円`} />
          <Legend />
          <Line type="monotone" dataKey="sales" name="売上" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="profit" name="利益" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

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

export default SalesPage;


// このページは売上管理のための画面です。将来的にはグラフや統計情報を表示する予定です。
// 現在は基本的な構造のみを提供しています。必要に応じて機能を追加してくださ