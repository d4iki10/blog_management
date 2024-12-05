# scripts/generate_article.py
import sys
import os
import json
import openai
from dotenv import load_dotenv  # dotenvをインポート
# from transformers import T5Tokenizer, AutoModelForCausalLM

def generate_article(prompt):
    # スクリプトのディレクトリを取得
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # .env ファイルのパスを設定（プロジェクトのルートに配置している場合）
    dotenv_path = os.path.join(script_dir, '..', '.env')
    # .env ファイルを読み込む
    if not load_dotenv(dotenv_path):
        print(json.dumps({"error": f".env ファイルが見つかりませんでした: {dotenv_path}"}))
        sys.exit(1)

    # 環境変数からAPIキーを取得
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        print(json.dumps({"error": "APIキーが設定されていません。"}))
        sys.exit(1)

    # デバッグ用（セキュリティ上、部分的に表示）
    # print(json.dumps({"debug": f"APIキー取得成功: {OPENAI_API_KEY[:4]}***"}))

    openai.api_key = OPENAI_API_KEY
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            n=1,
            stop=None
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI APIエラー: {e}", file=sys.stderr)
        return None

    # # rinna社の日本語GPT-2モデルを使用する場合
    # try:
    #     # モデルとトークナイザーの読み込み
    #     # print("トークナイザーとモデルをロード中...")
    #     tokenizer = T5Tokenizer.from_pretrained("rinna/japanese-gpt2-medium")
    #     model = AutoModelForCausalLM.from_pretrained("rinna/japanese-gpt2-medium")

    #     # プロンプトのエンコード
    #     # print("プロンプトをエンコード中...")
    #     input_ids = tokenizer.encode(prompt, return_tensors="pt")

    #     # テキスト生成
    #     # print("テキストを生成中...")
    #     output = model.generate(
    #         input_ids,
    #         max_length=1000,
    #         num_return_sequences=1,
    #         no_repeat_ngram_size=2,
    #         temperature=0.7,
    #         do_sample=True,
    #         top_p=0.9,
    #         pad_token_id=tokenizer.eos_token_id
    #     )

    #     # 生成されたテキストのデコード
    #     # print("生成されたテキストをデコード中...")
    #     article_content = tokenizer.decode(output[0], skip_special_tokens=True)

    #     # デリミタ以降のみ記事本文として抽出
    #     delimiter = "---ARTICLE_START---"
    #     if delimiter in article_content:
    #         article_content = article_content.split(delimiter, 1)[-1].strip()
    #     else:
    #         # 万一デリミタが見つからない場合は全体を記事として扱う（fallback）
    #         article_content = article_content.strip()

    #     # print("記事生成が完了しました。")
    #     return article_content
    # except Exception as e:
    #     print(f"記事生成中にエラーが発生しました: {e}", file=sys.stderr)
    #     raise e

def main():
    if len(sys.argv) < 2:
        error_message = {"error": "No prompt provided."}
        print(json.dumps(error_message))
        sys.exit(1)

    prompt = sys.argv[1]
    article = generate_article(prompt)
    if article:
        print(article)
    else:
        print(json.dumps({"error": "記事の生成に失敗しました。"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
