# Core System Development

このリポジトリは、Spring Boot（バックエンド）とReact（フロントエンド）による認証付きダッシュボードアプリのサンプルです。

## ⚠️ セキュリティに関する重要な注意事項

### 🔒 機密情報の取り扱い
- `.env`ファイルや`application-prod.properties`は**絶対にGitにコミットしないでください**
- 本番環境では必ず環境変数を使用してください
- JWTシークレットは最低256ビットの強力なランダム文字列を使用してください

### 🛡️ 初回セットアップ時の必須作業
1. `.env.template`をコピーして`.env`を作成
2. `.env`ファイルに実際の認証情報を記入
3. `application-prod.properties.template`をコピーして本番用設定を作成

---

## 構成

- `backend/coresystem`  
  Spring Boot（Java）によるAPIサーバー  
  JWT認証・ユーザー認証・CORS対応

- `frontend/coresystemR`  
  React + TypeScript + Vite  
  ログイン画面・ダッシュボード画面

---

## セットアップ手順

### 1. バックエンド（Spring Boot）

```sh
cd backend/coresystem
mvn clean install
mvn spring-boot:run
```

- Java 17以上が必要です
- ポート: `8080`

### 2. フロントエンド（React）

```sh
cd frontend/coresystemR
npm install
npm run dev
```

- ポート: `5173`

---

## ログイン情報（デフォルト）

- ユーザー名: `root`
- パスワード: `admin`

---

## 主なAPI

- `POST /api/auth/login`  
  ログイン（JWTトークン発行）

- `GET /api/auth/me`  
  JWTトークン検証・ユーザー情報取得

- `GET /api/hello`  
  サンプルAPI

---

## 備考

- バックエンドのCORS設定で`http://localhost:5173`からのリクエストを許可しています。
- JWTのシークレットキーはサンプル用に固定値です。本番運用時は環境変数等で管理してください。
- テストをスキップしてビルドする場合は `-DskipTests` オプションを利用してください。

---

## 変更履歴

- 2025-06-27: 初版作成
- 2025-06-27: APIエンドポイントの説明を追加
- 2025-06-27: セットアップ手順を一部修正
- 2025-06-27: バックエンドのポート番号を変更
- 2025-06-27: フロントエンドのポート番号を変更
- 2025-06-28: ログイン情報をデフォルト値にリセット
- 2025-06-28: READMEの表記を一部修正

---

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

---

## お問い合わせ

問題や質問がある場合は、[Issues](https://github.com/Me1td0wn76/Core_system_development?tab=readme-ov-file/issues)に投稿してください。

---

## コントリビュート

コントリビュートは大歓迎です！プルリクエストを作成する前に、必ず[CONTRIBUTING.md](CONTRIBUTING.md)をお読みください。

---

## クレジット

このプロジェクトは、[Spring Boot](https://spring.io/projects/spring-boot)、[React](https://reactjs.org/)、[Vite](https://vitejs.dev/)のコミュニティによって支えられています。

---

## 参考文献

- [Spring Boot 公式ドキュメント](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [React 公式ドキュメント](https://reactjs.org/docs/getting-started.html)
- [Vite 公式ドキュメント](https://vitejs.dev/guide/)

---

## FAQ

**Q1:** このプロジェクトは何ですか？  
**A1:** Spring BootとReactを使用した認証付きダッシュボードアプリのサンプルです。

**Q2:** どのようにセットアップしますか？  
**A2:** セットアップ手順は`## セットアップ手順`セクションを参照してください。

**Q3:** デフォルトのログイン情報は何ですか？  
**A3:** ユーザー名は`root`、パスワードは`admin`です。

**Q4:** APIのエンドポイントはどこですか？  
**A4:** 主なAPIエンドポイントは`## 主なAPI`セクションに記載されています。

**Q5:** バックエンドとフロントエンドのポート番号は？  
**A5:** バックエンドは`8080`、フロントエンドは`5173`です。

---

## トラブルシューティング

- **問題:** バックエンドが起動しない  
  **解決策:** Java 17以上がインストールされているか確認してください。

- **問題:** フロントエンドにアクセスできない  
  **解決策:** ポート番号が正しいか確認し、ファイアウォールの設定を確認してください。

- **問題:** JWTトークンが無効  
  **解決策:** 正しいユーザー名とパスワードでログインしているか確認してください。

---

## 開発者向け

このセクションは開発者向けの情報です。一般ユーザーはスキップしても問題ありません。

- 使用技術:
  - バックエンド: Spring Boot, Java, Maven
  - フロントエンド: React, TypeScript, Vite
- 開発環境:
  - エディタ: Visual Studio Code, IntelliJ IDEA
  - OS: Windows, macOS, Linux
- デバッグ:
  - バックエンド: ブラウザのデベロッパーツール, Postman
  - フロントエンド: ブラウザのデベロッパーツール, React Developer Tools

---

## 既知の問題

- フロントエンドの一部のスタイルが適用されないことがあります。これは、Viteのホットモジュールリプレースメント（HMR）による既知の問題です。ページをリフレッシュすると解決します。
- バックエンドのCORS設定が正しくない場合、フロントエンドからのリクエストがブロックされることがあります。その場合は、バックエンドの`application.yml`ファイルを確認してください。

---



## Dockerでの起動

### バックエンド（Spring Boot）

1. JARファイルをビルドします（初回のみ）:

    ```sh
    cd backend/coresystem
    mvn clean package -DskipTests
    ```

2. Dockerイメージをビルドします:

    ```sh
    docker build -t coresystem-backend .
    ```

3. コンテナを起動します:

    ```sh
    docker run -p 8080:8080 coresystem-backend
    ```

---

### フロントエンド（React）

1. Dockerイメージをビルドします:

    ```sh
    cd frontend/coresystemR
    docker build -t coresystem-frontend .
    ```

2. コンテナを起動します:

    ```sh
    docker run -p 80:80 coresystem-frontend
    ```

---

### docker-composeでまとめて起動する場合

プロジェクトルートにある`docker-compose.yml`を使って、バックエンド・フロントエンドを同時に起動できます。

```sh
docker-compose up --build
```

- バックエンド: http://localhost:8080
- フロントエンド: http://localhost

---

> ※ フロントエンドのDockerfileは `frontend/coresystemR` ディレクトリに配置してください。
> ※ バックエンドのDockerfileは `backend/coresystem` ディレクトリに配置してください。

---  
  
## 今後の予定  
  
- ユーザー登録機能の追加  
- パスワードリセット機能の追加  
- フロントエンドのUI/UX改善  
- バックエンドのAPIドキュメント自動生成  
- テスト自動化の強化    
  
---

# 最後に  
このプロジェクトは、React + Spring Boot の修行の旅の途中で生まれたものです。  
まだまだ道半ばですが、「あ、これ意外と使えるじゃん」と思ってもらえたら最高です。  
  
「バグ発見したよ！」「こっちの書き方の方がスマートだよ！」なんてツッコミも大歓迎です。  
むしろ一緒に育ててください  

技術は一日にして成らず。精進あるのみ。  
  
キーボードを叩きすぎて指が筋トレ状態です...  
  
以上、YAMA でした。
