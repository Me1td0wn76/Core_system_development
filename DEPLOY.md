# デプロイ手順

このプロジェクト（Spring Boot + React）のデプロイ方法を説明します。

---

## 前提

- Java 17以上がインストールされていること
- Node.js（v18以上）とnpmがインストールされていること
- サーバーにgitがインストールされていること

---

## 1. ソースコードの取得

```sh
git clone https://github.com/Me1td0wn76/Core_system_development.git
cd Core_system_development
```

---

## 2. バックエンド（Spring Boot）のビルドと起動

```sh
cd backend/coresystem
mvn clean package -DskipTests
java -jar target/coresystem-0.0.1-SNAPSHOT.jar
```

- ポート番号はデフォルトで`8080`です。変更したい場合は`application.properties`で設定してください。

---

## 3. フロントエンド（React）のビルドと起動

### 開発モードで起動

```sh
cd frontend/coresystemR
npm install
npm run dev
```

### 本番ビルド & 静的ファイル配信

```sh
npm run build
```

- `dist`フォルダが生成されます。
- 静的ファイルサーバー（nginx等）やSpring Bootの`resources/static`配下に配置して配信できます。

---

## 4. 環境変数・設定

- JWTのシークレットキーやDB接続情報など、本番環境では環境変数や`application.properties`で安全に管理してください。

---

## 5. よくあるデプロイ先

- **VPS/クラウドサーバー**: Ubuntu等で上記手順を実行
- **Docker**: Dockerfileを用意してコンテナ化も可能
- **PaaS**: Heroku, Render, Railway等でもSpring Boot/Reactアプリは動作します

---

## 6. 注意事項

- 本番公開時はCORSやセキュリティ設定を見直してください
- テスト用の認証情報やシークレットは必ず本番用に変更してください

---

## 参考

- [Spring Boot公式デプロイガイド](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
- [Vite公式デプロイガイド](https://vitejs.dev/guide/static-deploy.html)