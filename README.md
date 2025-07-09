# Core System Development

このリポジトリは、Spring Boot（バックエンド）とReact（フロントエンド）による認証付きダッシュボードアプリのサンプルです。  
JWT認証、ユーザー管理機能、MySQL連携を含む包括的なWebアプリケーションです。

---

## 構成

- `backend/coresystem`  
  Spring Boot（Java）によるAPIサーバー  
  JWT認証・ユーザー管理・MySQL連携・CORS対応

- `frontend/coresystemR`  
  React + TypeScript + Vite  
  ログイン画面・ダッシュボード画面・ユーザー管理画面

---

## セットアップ手順

### 前提条件

- Java 17以上
- Node.js 16以上  
- MySQL 5.7以上
- Maven 3.6以上

### 1. データベースの準備

MySQLでデータベースを作成します：

```sql
CREATE DATABASE coresystem;
```

### 2. バックエンド（Spring Boot）

```sh
cd backend/coresystem
mvn clean install
mvn spring-boot:run
```

- ポート: `8080`
- データベース接続設定は `application.properties` で確認してください

### 3. フロントエンド（React）

```sh
cd frontend/coresystemR
npm install
npm run dev
```

- ポート: `5173`（または自動的に別のポートが選択される場合があります）

---

## ログイン情報（デフォルト）

- ユーザー名: `admin`
- パスワード: `admin`
- 権限: 管理者

※ 初回起動時にデータベースに自動的に管理者ユーザーが作成されます。

---

## 主なAPI

### 認証関連
- `POST /api/auth/login`  
  ログイン（JWTトークン発行）

- `GET /api/auth/me`  
  JWTトークン検証・ユーザー情報取得

### ユーザー管理関連
- `GET /api/users/list`  
  ユーザー一覧取得

- `POST /api/users/add`  
  新規ユーザー追加

- `DELETE /api/users/{id}`  
  ユーザー削除

### その他
- `GET /api/hello`  
  サンプルAPI

---

## 機能一覧

### 認証機能
- JWT認証によるセキュアなログイン
- ユーザーセッション管理
- 権限ベースのアクセス制御

### ユーザー管理機能
- 管理者による新規ユーザー追加
- ユーザー一覧表示（ID、ユーザー名、メールアドレス、権限、ステータス）
- ユーザー削除（管理者保護機能付き）
- ユーザー名重複チェック
- 入力値バリデーション

### データベース連携
- MySQL との連携
- Hibernateによる ORM
- Flyway マイグレーション

### フロントエンド機能
- レスポンシブデザイン
- リアルタイムエラー・成功メッセージ表示
- 直感的なユーザーインターフェース

---

## 備考

- バックエンドのCORS設定で`http://localhost:5173`からのリクエストを許可しています。
- JWTのシークレットキーはサンプル用に固定値です。本番運用時は環境変数等で管理してください。
- テストをスキップしてビルドする場合は `-DskipTests` オプションを利用してください。
- パスワードは現在平文で保存されています。本番環境では適切にハッシュ化してください。
- データベース接続情報は `application.properties` で設定してください。

---

## 変更履歴

- 2025-06-27: 初版作成
- 2025-06-27: APIエンドポイントの説明を追加
- 2025-06-27: セットアップ手順を一部修正
- 2025-06-27: バックエンドのポート番号を変更
- 2025-06-27: フロントエンドのポート番号を変更
- 2025-06-28: ログイン情報をデフォルト値にリセット
- 2025-06-28: READMEの表記を一部修正
- 2025-07-10: ユーザー管理機能を追加
- 2025-07-10: MySQL連携機能を追加
- 2025-07-10: JWT認証をDB連携に変更
- 2025-07-10: ユーザー管理APIエンドポイントを追加

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
**A3:** ユーザー名は`admin`、パスワードは`admin`です。

**Q4:** APIのエンドポイントはどこですか？  
**A4:** 主なAPIエンドポイントは`## 主なAPI`セクションに記載されています。

**Q5:** バックエンドとフロントエンドのポート番号は？  
**A5:** バックエンドは`8080`、フロントエンドは`5173`です。

**Q6:** ユーザー管理機能はどこで使えますか？  
**A6:** 管理者でログイン後、ダッシュボードからユーザー管理画面にアクセスできます。

**Q7:** 新しいユーザーを追加するには？  
**A7:** ユーザー管理画面で、ユーザー名・パスワード・メールアドレス・権限を入力して追加ボタンを押してください。

---

## トラブルシューティング

- **問題:** バックエンドが起動しない  
  **解決策:** Java 17以上がインストールされているか確認してください。また、MySQLが起動しているか確認してください。

- **問題:** フロントエンドにアクセスできない  
  **解決策:** ポート番号が正しいか確認し、ファイアウォールの設定を確認してください。

- **問題:** JWTトークンが無効  
  **解決策:** 正しいユーザー名とパスワードでログインしているか確認してください。

- **問題:** データベースに接続できない  
  **解決策:** MySQLが起動しており、`application.properties`の接続設定が正しいか確認してください。

- **問題:** ユーザー追加時にエラーが発生する  
  **解決策:** すべての必須フィールド（ユーザー名、パスワード、メールアドレス）が入力されているか確認してください。

---

## 開発者向け

このセクションは開発者向けの情報です。一般ユーザーはスキップしても問題ありません。

- 使用技術:
  - バックエンド: Spring Boot, Java, Maven, MySQL, Hibernate
  - フロントエンド: React, TypeScript, Vite, Axios
- 開発環境:
  - エディタ: Visual Studio Code, IntelliJ IDEA
  - OS: Windows, macOS, Linux
  - データベース: MySQL 5.7+
- デバッグ:
  - バックエンド: ブラウザのデベロッパーツール, Postman, MySQL Workbench
  - フロントエンド: ブラウザのデベロッパーツール, React Developer Tools

---

## 既知の問題

- フロントエンドの一部のスタイルが適用されないことがあります。これは、Viteのホットモジュールリプレースメント（HMR）による既知の問題です。ページをリフレッシュすると解決します。
- バックエンドのCORS設定が正しくない場合、フロントエンドからのリクエストがブロックされることがあります。その場合は、バックエンドの`application.properties`ファイルを確認してください。
- パスワードが平文で保存されているため、本番環境では適切にハッシュ化する必要があります。
- ユーザー削除時に関連データの整合性チェックは行われていません。

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
  
- パスワードハッシュ化の実装
- ユーザープロフィール編集機能の追加
- パスワードリセット機能の追加  
- フロントエンドのUI/UX改善  
- バックエンドのAPIドキュメント自動生成  
- テスト自動化の強化
- ユーザー権限管理の強化
- 監査ログ機能の追加    
  
---

# 最後に  
このプロジェクトは、React + Spring Boot の修行の旅の途中で生まれたものです。  
まだまだ道半ばですが、「あ、これ意外と使えるじゃん」と思ってもらえたら最高です。  

ユーザー管理機能も追加して、だいぶそれっぽくなってきました！  
「バグ発見したよ！」「こっちの書き方の方がスマートだよ！」なんてツッコミも大歓迎です。  
むしろ一緒に育ててください  

技術は一日にして成らず。精進あるのみ。  
  
MySQLと格闘しながらキーボードを叩きすぎて指が筋トレ状態です...  
  
以上、YAMA でした。  
