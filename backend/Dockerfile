# ベースイメージ（Java 17）
FROM eclipse-temurin:17-jdk-alpine

# 作業ディレクトリ作成
WORKDIR /app

# jarファイルをコンテナにコピー
COPY target/coresystem-0.0.1-SNAPSHOT.jar app.jar

# ポート開放
EXPOSE 8080

# アプリ起動
ENTRYPOINT ["java", "-jar", "app.jar"]