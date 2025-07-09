// 認証関連のユーティリティ関数

// ユーザー役割の定義
export type UserRole = 'admin' | 'staff';

// 権限の定義
export interface Permissions {
  canView: boolean;      // 閲覧権限
  canCreate: boolean;    // 作成権限
  canEdit: boolean;      // 編集権限
  canDelete: boolean;    // 削除権限
}

/**
 * 役割別の権限設定
 */
const rolePermissions: Record<UserRole, Permissions> = {
  admin: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true
  },
  staff: {
    canView: true,
    canCreate: false,   // staffは作成不可
    canEdit: false,     // staffは編集不可
    canDelete: false    // staffは削除不可
  }
};

/**
 * ログアウト処理を実行
 * - ローカルストレージから認証情報を削除
 * - セッションストレージからも削除
 * - ログイン画面にリダイレクト
 */
export const handleLogout = (navigate: (path: string, options?: any) => void) => {
  // ローカルストレージから認証トークンを削除
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  
  // セッションストレージからも削除（念のため）
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userRole');
  
  // その他の認証関連データも削除
  localStorage.removeItem('loginTime');
  
  // ログイン画面にリダイレクト
  navigate('/login', { replace: true });
};

/**
 * 認証トークンの存在チェック
 * @returns {boolean} トークンが存在する場合はtrue
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * 認証エラー時の処理
 * @param navigate ナビゲーション関数
 */
export const handleAuthError = (navigate: (path: string, options?: any) => void) => {
  // 認証情報をクリア
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userRole');
  
  // ログイン画面にリダイレクト
  navigate('/login', { replace: true });
};

/**
 * 現在のユーザー役割を取得
 * @returns {UserRole | null} ユーザー役割、ログインしていない場合はnull
 */
export const getCurrentUserRole = (): UserRole | null => {
  const role = localStorage.getItem('userRole') as UserRole;
  if (role === 'admin' || role === 'staff') {
    return role;
  }
  return null;
};

/**
 * 現在のユーザーの権限を取得
 * @returns {Permissions} 現在のユーザーの権限
 */
export const getCurrentPermissions = (): Permissions => {
  const role = getCurrentUserRole();
  if (role && rolePermissions[role]) {
    return rolePermissions[role];
  }
  // デフォルトは閲覧のみ
  return {
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false
  };
};

/**
 * 特定の権限をチェック
 * @param permission チェックする権限
 * @returns {boolean} 権限がある場合はtrue
 */
export const hasPermission = (permission: keyof Permissions): boolean => {
  const permissions = getCurrentPermissions();
  return permissions[permission];
};

/**
 * 管理者権限をチェック
 * @returns {boolean} 管理者の場合はtrue
 */
export const isAdmin = (): boolean => {
  return getCurrentUserRole() === 'admin';
};

/**
 * スタッフ権限をチェック
 * @returns {boolean} スタッフの場合はtrue
 */
export const isStaff = (): boolean => {
  return getCurrentUserRole() === 'staff';
};

/**
 * ユーザー役割を保存
 * @param role ユーザー役割
 */
export const setUserRole = (role: UserRole): void => {
  localStorage.setItem('userRole', role);
};
