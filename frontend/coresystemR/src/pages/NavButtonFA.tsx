// SVGアイコンの代わりにPixelcaveのデモサイトのFontAwesomeクラス名を利用するNavButton
import styles from './Dashboard.module.css';

export function NavButtonFA({ iconClass, label, onClick }: { iconClass: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={styles.navBtn}>
      <span className={iconClass + ' ' + styles.navIcon} style={{ fontSize: 32, marginBottom: 4 }} aria-hidden="true" />
      {label}
    </button>
  );
}
