# Blog+
コンテンツの作成が難しい方に向けて、記事を自動生成できるツールを作成。
## URL
### 管理画面
<https://blog-managementadminfrontend.vercel.app/login>
- 以下のメールアドレスとパスワードからログインできます。
  - メールアドレス: <admin@example.com>
  - パスワード: password
### ブログ画面
<https://blog-management-ashy.vercel.app/>
## 使用技術
- React（18.3.1）：管理画面
- Next.js（15.0.2）：ブログ画面
- Ruby（3.2.2）
- Rails（7.1.5）
- Python（3.13.1）
- PostgreSQL
- react-markdown-editor-lite（<https://github.com/HarryChen0506/react-markdown-editor-lite>）
- OpenAI API
- Gemini API
- Vercel（管理画面、ブログ画面デプロイ用）
- Render（バックエンド、PostgreSQLデプロイ用）
- Cloudinary（画像管理用）
## 機能一覧
### 【管理画面】
| ログイン画面 | 記事一覧画面 |
| ------------- | ------------- |
| ![ログイン画面](/img/admin-frontend/login.png) | ![記事一覧](/img/admin-frontend/article-list.png) |
| メールアドレスとパスワードでの認証機能を実装しました。 | 作成した記事のステータス管理や作成日などが一覧で確認できます。 |

| 記事編集画面 | 画像管理画面 |
| ------------- | ------------- |
| ![記事編集画面](/img/admin-frontend/article-form.gif) | ![画像管理](/img/admin-frontend/image.png) |
| Markdown形式で記事を編集、その他アイキャッチ画像やmetaタグなども編集できます。 | 画像のアップロードと管理機能を実装しました。 |

## 実装ポイント
### Rails API
- 記事自動生成機能について
  - `perform`メソッドで複数のPythonスクリプトを呼び出し、記事の自動生成を行なっている。
  - `Open3.capture3`を使った標準出力・標準エラーの取得、ログ出力、エラーハンドリングなどを適切に行っている。
  - 例外発生時にはログを出力し、`raise`で再スローしているため再試行可能。
- その他
  - ステータス管理（`draft` / `published`）を行い、公開前を下書き保存できる。
  - ページネーション`kaminari`を使用
  - `jwt_decode` / `jwt_encode` などの認証実装と組み合わせて、管理者向けと公開向けのエンドポイントを制御している。
### Python
- 事前に設計したプロンプトをもとに、Gemini APIから実際にコンテンツを自動生成。
- JSON形式で返すことで、Rails側からのエラーハンドリングがしやすくしている。
### React
- 管理画面はSEO最適化が不要なため、クライアント再度のみで画面遷移可能なSPAで実装。
- Markdownエディタや画像アップロード機能を実装。
- 記事を複数削除が可能となります。
- JWTをlocalStorageに保存し、APIリクエスト時に`Authorization`ヘッダーを付与する実装をしています。
### Next.js
- ブログ画面はSEO最適化する必要があるため、Pre-rendering機能を提供しているSSRで実装。
- `getServerSideProps`を使用し、初回アクセス時に記事データをAPIから取得して表示しています。

## その他関連資料
### カタログ設計
https://docs.google.com/spreadsheets/d/1FWzUq65WYtL9W5-CyxKlk3CAp8lYN3GAIsbLKvAWH90/edit?gid=782464957#gid=782464957
### テーブル定義署
https://docs.google.com/spreadsheets/d/1FWzUq65WYtL9W5-CyxKlk3CAp8lYN3GAIsbLKvAWH90/edit?gid=2020033787#gid=2020033787
### ER図
https://app.diagrams.net/#G1XlJVCUTCwJ_jS9k_NkYp0EShRhTSdGlu#%7B%22pageId%22%3A%22iz7lFp_31lQFbATgsLB6%22%7D
<img width="1223" alt="スクリーンショット 2024-12-25 14 35 43" src="https://github.com/user-attachments/assets/dfb08891-73e6-498c-af51-180ee333daec" />
### 画面遷移図
https://app.diagrams.net/#G1XlJVCUTCwJ_jS9k_NkYp0EShRhTSdGlu#%7B%22pageId%22%3A%22Yv7dz2-JqmFhlFjNYIA8%22%7D
<img width="1680" alt="スクリーンショット 2024-12-25 14 36 24" src="https://github.com/user-attachments/assets/76d7036e-6cee-46bd-8662-67a670204c72" />
### ワイヤーフレーム
https://app.diagrams.net/#G1XlJVCUTCwJ_jS9k_NkYp0EShRhTSdGlu#%7B%22pageId%22%3A%22PlB1XOqYMGXzPXKvK5lO%22%7D
