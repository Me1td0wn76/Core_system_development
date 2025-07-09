// 権限管理用のReactコンポーネント
import type { ReactNode } from 'react';
import { hasPermission, isAdmin, isStaff, getCurrentUserRole, type UserRole } from '../utils/auth';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: 'canView' | 'canCreate' | 'canEdit' | 'canDelete';
  role?: UserRole;
  fallback?: ReactNode;
}

/**
 * 権限に基づいて子コンポーネントの表示を制御
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  role, 
  fallback = null 
}: PermissionGuardProps) => {
  // 役割チェック
  if (role) {
    const currentRole = getCurrentUserRole();
    if (currentRole !== role) {
      return <>{fallback}</>;
    }
  }

  // 権限チェック
  if (permission) {
    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

/**
 * 管理者のみに表示するコンポーネント
 */
export const AdminOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => {
  return isAdmin() ? <>{children}</> : <>{fallback}</>;
};

/**
 * スタッフのみに表示するコンポーネント
 */
export const StaffOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => {
  return isStaff() ? <>{children}</> : <>{fallback}</>;
};

/**
 * 権限付きボタンコンポーネント
 */
interface PermissionButtonProps {
  permission: 'canView' | 'canCreate' | 'canEdit' | 'canDelete';
  onClick: () => void;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export const PermissionButton = ({ 
  permission, 
  onClick, 
  children, 
  style,
  className,
  disabled = false
}: PermissionButtonProps) => {
  const hasAccess = hasPermission(permission);
  
  if (!hasAccess) {
    return null; // 権限がない場合は非表示
  }

  return (
    <button 
      onClick={onClick}
      style={style}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

/**
 * 権限表示用のバッジコンポーネント
 */
export const RoleBadge = () => {
  const role = getCurrentUserRole();
  
  if (!role) return null;

  const badgeStyle: React.CSSProperties = {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    background: role === 'admin' ? '#f44336' : '#2196f3',
    display: 'inline-block'
  };

  return (
    <span style={badgeStyle}>
      {role === 'admin' ? '管理者' : 'スタッフ'}
    </span>
  );
};
