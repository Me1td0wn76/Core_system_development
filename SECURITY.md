# 🔒 セキュリティチェックリスト

## ✅ Gitにコミットする前の必須チェック

### 絶対にコミットしてはならないファイル
- [ ] `.env` - 環境変数ファイル
- [ ] `application-prod.properties` - 本番設定
- [ ] `application-local.properties` - ローカル設定  
- [ ] `*.key` - 秘密鍵ファイル
- [ ] `*.pem` - SSL証明書
- [ ] `*.jks` - Javaキーストア
- [ ] `credentials` - AWS認証情報
- [ ] `api-keys.*` - APIキーファイル

### コミット前の確認コマンド
```bash
# 機密ファイルが含まれていないかチェック
git status
git diff --cached

# .gitignoreが正しく動作しているかテスト
echo "test-secret" > .env
git status  # .envが表示されないことを確認
rm .env
```

### 本番環境での環境変数設定例
```bash
export DB_URL="jdbc:mariadb://prod-server:3306/coresystem"
export DB_USERNAME="prod_user"
export DB_PASSWORD="super-secure-password"
export JWT_SECRET="your-256-bit-secret-key-here"
```

### 緊急時の対応手順
機密情報を誤ってコミットした場合：
1. **即座にリポジトリをprivateに変更**
2. **該当のコミットを削除** (`git rebase -i` または `git filter-branch`)
3. **機密情報をローテーション** (パスワード、APIキー等の変更)
4. **履歴を完全に削除してforce push**

## 🛡️ 追加のセキュリティ対策

- 本番環境では`spring.jpa.show-sql=false`に設定
- `spring.jpa.hibernate.ddl-auto=validate`で本番運用
- SSL/HTTPS必須設定
- CORS設定の厳格化
- ログファイルに機密情報を出力しない
- データベース接続にSSL使用
