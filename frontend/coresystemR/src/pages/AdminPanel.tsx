import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminOnly, PermissionButton } from '../components/PermissionGuard';
import { handleAuthError } from '../utils/auth';

interface Staff {
  id: number;
  username: string;
  role: string;
  email: string;
  active: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface StaffForm {
  username: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

interface InventoryForm {
  name: string;
  stock: number;
  price: number;
}

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'staff' | 'customers' | 'inventory'>('staff');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [error, setError] = useState('');

  // フォーム表示状態
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // フォームデータ
  const [staffForm, setStaffForm] = useState<StaffForm>({
    username: '',
    email: '',
    password: '',
    role: 'staff',
    active: true
  });

  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: '',
    email: '',
    phone: ''
  });

  const [inventoryForm, setInventoryForm] = useState<InventoryForm>({
    name: '',
    stock: 0,
    price: 0
  });

  // 共通のヘッダー設定
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // スタッフデータ取得
  const fetchStaff = async () => {
    try {
      const response = await axios.get<Staff[]>('http://localhost:8080/api/staff/list', {
        headers: getAuthHeaders()
      });
      setStaff(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleAuthError(navigate);
      } else {
        setError('スタッフデータの取得に失敗しました');
      }
    }
  };

  // 顧客データ取得
  const fetchCustomers = async () => {
    try {
      const response = await axios.get<Customer[]>('http://localhost:8080/api/customers/list', {
        headers: getAuthHeaders()
      });
      setCustomers(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleAuthError(navigate);
      } else {
        setError('顧客データの取得に失敗しました');
      }
    }
  };

  // 在庫データ取得
  const fetchInventory = async () => {
    try {
      const response = await axios.get<InventoryItem[]>('http://localhost:8080/api/inventory/list', {
        headers: getAuthHeaders()
      });
      setInventory(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleAuthError(navigate);
      } else {
        setError('在庫データの取得に失敗しました');
      }
    }
  };

  // スタッフ削除
  const deleteStaff = async (id: number) => {
    if (!confirm('このスタッフを削除しますか？')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/staff/delete/${id}`, {
        headers: getAuthHeaders()
      });
      setStaff(staff.filter(s => s.id !== id));
    } catch (error: any) {
      setError('スタッフの削除に失敗しました');
    }
  };

  // 顧客削除
  const deleteCustomer = async (id: number) => {
    if (!confirm('この顧客を削除しますか？')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/customers/delete/${id}`, {
        headers: getAuthHeaders()
      });
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error: any) {
      setError('顧客の削除に失敗しました');
    }
  };

  // 在庫削除
  const deleteInventory = async (id: number) => {
    if (!confirm('この在庫アイテムを削除しますか？')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/inventory/delete/${id}`, {
        headers: getAuthHeaders()
      });
      setInventory(inventory.filter(i => i.id !== id));
    } catch (error: any) {
      setError('在庫の削除に失敗しました');
    }
  };

  // スタッフ追加
  const addStaff = async () => {
    try {
      const response = await axios.post<Staff>('http://localhost:8080/api/staff/add', staffForm, {
        headers: getAuthHeaders()
      });
      setStaff([...staff, response.data]);
      setStaffForm({ username: '', email: '', password: '', role: 'staff', active: true });
      setShowAddForm(false);
    } catch (error: any) {
      setError('スタッフの追加に失敗しました');
    }
  };

  // 顧客追加
  const addCustomer = async () => {
    try {
      const response = await axios.post<Customer>('http://localhost:8080/api/customers/add', customerForm, {
        headers: getAuthHeaders()
      });
      setCustomers([...customers, response.data]);
      setCustomerForm({ name: '', email: '', phone: '' });
      setShowAddForm(false);
    } catch (error: any) {
      setError('顧客の追加に失敗しました');
    }
  };

  // 在庫追加
  const addInventory = async () => {
    try {
      const response = await axios.post<InventoryItem>('http://localhost:8080/api/inventory/add', inventoryForm, {
        headers: getAuthHeaders()
      });
      setInventory([...inventory, response.data]);
      setInventoryForm({ name: '', stock: 0, price: 0 });
      setShowAddForm(false);
    } catch (error: any) {
      setError('在庫の追加に失敗しました');
    }
  };

  // スタッフ編集
  const updateStaff = async () => {
    try {
      const response = await axios.put<Staff>(`http://localhost:8080/api/staff/update/${editingItem.id}`, staffForm, {
        headers: getAuthHeaders()
      });
      setStaff(staff.map(s => s.id === editingItem.id ? response.data : s));
      setEditingItem(null);
    } catch (error: any) {
      setError('スタッフの更新に失敗しました');
    }
  };

  // 顧客編集
  const updateCustomer = async () => {
    try {
      const response = await axios.put<Customer>(`http://localhost:8080/api/customers/update/${editingItem.id}`, customerForm, {
        headers: getAuthHeaders()
      });
      setCustomers(customers.map(c => c.id === editingItem.id ? response.data : c));
      setEditingItem(null);
    } catch (error: any) {
      setError('顧客の更新に失敗しました');
    }
  };

  // 在庫編集
  const updateInventory = async () => {
    try {
      const response = await axios.put<InventoryItem>(`http://localhost:8080/api/inventory/update/${editingItem.id}`, inventoryForm, {
        headers: getAuthHeaders()
      });
      setInventory(inventory.map(i => i.id === editingItem.id ? response.data : i));
      setEditingItem(null);
    } catch (error: any) {
      setError('在庫の更新に失敗しました');
    }
  };

  // 編集開始
  const startEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'staff') {
      setStaffForm({
        username: item.username,
        email: item.email,
        password: '',
        role: item.role,
        active: item.active
      });
    } else if (activeTab === 'customers') {
      setCustomerForm({
        name: item.name,
        email: item.email,
        phone: item.phone
      });
    } else if (activeTab === 'inventory') {
      setInventoryForm({
        name: item.name,
        stock: item.stock,
        price: item.price
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaff();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'inventory') {
      fetchInventory();
    }
  }, [activeTab]);

  return (
    <AdminOnly>
      <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2>管理者パネル</h2>
        
        {/* タブナビゲーション */}
        <div style={{ marginBottom: '20px' }}>
          {['staff', 'customers', 'inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                background: activeTab === tab ? '#8884d8' : '#f0f0f0',
                color: activeTab === tab ? '#fff' : '#333',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {tab === 'staff' ? 'スタッフ管理' : tab === 'customers' ? '顧客管理' : '在庫管理'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* スタッフ管理タブ */}
        {activeTab === 'staff' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>スタッフ管理</h3>
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '10px 20px',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                新規追加
              </button>
            </div>

            {/* 追加・編集フォーム */}
            {(showAddForm || editingItem) && (
              <div style={{ 
                background: '#f9f9f9', 
                padding: '20px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                border: '1px solid #ddd' 
              }}>
                <h4>{editingItem ? 'スタッフ編集' : 'スタッフ追加'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="ユーザー名"
                    value={staffForm.username}
                    onChange={(e) => setStaffForm({...staffForm, username: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="password"
                    placeholder={editingItem ? "新しいパスワード（空白で変更なし）" : "パスワード"}
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({...staffForm, role: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  >
                    <option value="staff">スタッフ</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={staffForm.active}
                      onChange={(e) => setStaffForm({...staffForm, active: e.target.checked})}
                    />
                    アクティブ
                  </label>
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={editingItem ? updateStaff : addStaff}
                    style={{
                      padding: '8px 16px',
                      background: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    {editingItem ? '更新' : '追加'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setStaffForm({ username: '', email: '', password: '', role: 'staff', active: true });
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ユーザー名</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>役割</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>メール</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>状態</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.username}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.role}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {s.active ? '有効' : '無効'}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => startEdit(s)}
                          style={{
                            padding: '5px 10px',
                            background: '#2196F3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          編集
                        </button>
                        <PermissionButton
                          permission="canDelete"
                          onClick={() => deleteStaff(s.id)}
                          style={{
                            padding: '5px 10px',
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          削除
                        </PermissionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 顧客管理タブ */}
        {activeTab === 'customers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>顧客管理</h3>
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '10px 20px',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                新規追加
              </button>
            </div>

            {/* 追加・編集フォーム */}
            {(showAddForm || editingItem) && (
              <div style={{ 
                background: '#f9f9f9', 
                padding: '20px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                border: '1px solid #ddd' 
              }}>
                <h4>{editingItem ? '顧客編集' : '顧客追加'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="顧客名"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="tel"
                    placeholder="電話番号"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={editingItem ? updateCustomer : addCustomer}
                    style={{
                      padding: '8px 16px',
                      background: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    {editingItem ? '更新' : '追加'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setCustomerForm({ name: '', email: '', phone: '' });
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>名前</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>メール</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>電話番号</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.phone}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => startEdit(c)}
                          style={{
                            padding: '5px 10px',
                            background: '#2196F3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          編集
                        </button>
                        <PermissionButton
                          permission="canDelete"
                          onClick={() => deleteCustomer(c.id)}
                          style={{
                            padding: '5px 10px',
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          削除
                        </PermissionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 在庫管理タブ */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>在庫管理</h3>
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '10px 20px',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                新規追加
              </button>
            </div>

            {/* 追加・編集フォーム */}
            {(showAddForm || editingItem) && (
              <div style={{ 
                background: '#f9f9f9', 
                padding: '20px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                border: '1px solid #ddd' 
              }}>
                <h4>{editingItem ? '在庫編集' : '在庫追加'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="商品名"
                    value={inventoryForm.name}
                    onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="number"
                    placeholder="在庫数"
                    value={inventoryForm.stock}
                    onChange={(e) => setInventoryForm({...inventoryForm, stock: parseInt(e.target.value) || 0})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                  <input
                    type="number"
                    placeholder="価格"
                    value={inventoryForm.price}
                    onChange={(e) => setInventoryForm({...inventoryForm, price: parseFloat(e.target.value) || 0})}
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '3px' }}
                  />
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={editingItem ? updateInventory : addInventory}
                    style={{
                      padding: '8px 16px',
                      background: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    {editingItem ? '更新' : '追加'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setInventoryForm({ name: '', stock: 0, price: 0 });
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>商品名</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>在庫数</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>価格</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{i.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{i.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{i.stock}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>¥{i.price}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => startEdit(i)}
                          style={{
                            padding: '5px 10px',
                            background: '#2196F3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          編集
                        </button>
                        <PermissionButton
                          permission="canDelete"
                          onClick={() => deleteInventory(i.id)}
                          style={{
                            padding: '5px 10px',
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          削除
                        </PermissionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminOnly>
  );
}

export default AdminPanel;
