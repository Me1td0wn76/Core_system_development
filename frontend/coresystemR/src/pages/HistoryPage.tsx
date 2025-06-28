import { useState } from 'react';

type History = {
  id: number;
  date: string;
  user: string;
  detail: string;
};

const dummyHistory: History[] = [
  { id: 1, date: '2025-06-28 10:00', user: '山田太郎', detail: 'りんごを注文' },
  { id: 2, date: '2025-06-28 10:05', user: '佐藤花子', detail: 'バナナを補充' },
  { id: 3, date: '2025-06-28 11:00', user: '山田太郎', detail: 'みかんを注文' },
  { id: 4, date: '2025-06-28 12:00', user: '鈴木一郎', detail: 'ぶどうを補充' },
];

function HistoryPage() {
  const [history, setHistory] = useState<History[]>(dummyHistory);
  const [sortKey, setSortKey] = useState<'date' | 'user' | 'detail'>('date');
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState('');

  const sorted = [...history]
    .filter(h => h.user.includes(filter) || h.detail.includes(filter))
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#222' }}>操作履歴一覧</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="ユーザー名や内容でフィルター"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 240 }}
        />
      </div>
      <table
        border={1}
        cellPadding={8}
        style={{
          width: '100%',
          background: '#fafafa',
          color: '#222'
        }}
      >
        <thead>
          <tr>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('date');
                setSortAsc(sortKey === 'date' ? !sortAsc : true);
              }}
            >
              日時 {sortKey === 'date' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('user');
                setSortAsc(sortKey === 'user' ? !sortAsc : true);
              }}
            >
              ユーザー {sortKey === 'user' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortKey('detail');
                setSortAsc(sortKey === 'detail' ? !sortAsc : true);
              }}
            >
              内容 {sortKey === 'detail' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(h => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.user}</td>
              <td>{h.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;