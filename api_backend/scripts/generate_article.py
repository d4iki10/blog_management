import sys
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
import openai  # OpenAI を保持する場合（必要に応じて）
import requests  # OpenAI を保持する場合（必要に応じて）

def load_local_env():
    """
    ローカル専用：.env があれば読み込む。
    なければ無視する（本番は Render の EnvVars を使用）。
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(script_dir, '..', '.env')

    if os.path.exists(dotenv_path):
        # .env ファイルがあれば読み込む（ローカル）
        load_dotenv(dotenv_path)
    else:
        # 本番想定：.env がなくてもエラーにしない
        pass

def generate_article_openai(prompt):
    """
    OpenAI APIを使用して記事を生成するメソッド。
    """
    load_local_env()   # ローカルなら .env を読み込む
    # 環境変数からAPIキーを取得
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        print(json.dumps({"error": "OpenAI APIキーが設定されていません。"}))
        sys.exit(1)

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

def generate_article_gemini(prompt):
    """
    Gemini APIを使用して記事を生成するメソッド。
    """
    load_local_env()   # ローカルなら .env を読み込む
    # 環境変数からGemini APIキーを取得
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        print(json.dumps({"error": "Gemini APIキーが設定されていません。"}))
        sys.exit(1)

    # Gemini API を設定
    genai.configure(api_key=GEMINI_API_KEY)

    # 使用するモデルを設定（例: 'gemini-1.5-flash' または 'gemini-1.5-pro'）
    model = genai.GenerativeModel('gemini-1.5-flash')  # 必要に応じてモデル名を変更

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini APIエラー: {e}", file=sys.stderr)
        return None

def generate_article(prompt):
    """
    環境変数に応じてOpenAI APIまたはGemini APIを使用して記事を生成するメソッド。
    """
    use_gemini = os.getenv('USE_GEMINI_API', 'false').lower() == 'true'

    if use_gemini:
        # Gemini APIを使用
        article = generate_article_gemini(prompt)
        if article:
            return article
        else:
            print(json.dumps({"error": "Gemini APIによる記事生成に失敗しました。"}))
            return None
    else:
        # OpenAI APIを使用
        article = generate_article_openai(prompt)
        if article:
            return article
        else:
            print(json.dumps({"error": "OpenAI APIによる記事生成に失敗しました。"}))
            return None

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
