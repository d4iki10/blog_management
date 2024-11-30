# scripts/generate_article.py
import sys
import os
# import openai  # ChatGPT APIのコードはコメントアウト
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def generate_article(prompt):
    # ChatGPT APIを使用する場合
    # openai.api_key = os.getenv('OPENAI_API_KEY')  # 環境変数からAPIキーを取得
    # response = openai.Completion.create(
    #     engine="text-davinci-003",
    #     prompt=prompt,
    #     max_tokens=1500,
    #     n=1,
    #     stop=None,
    #     temperature=0.7,
    # )
    # article_content = response.choices[0].text.strip()
    # return article_content

    # Hugging Face Transformersを使用する場合
    try:
        # モデルとトークナイザーの読み込み
        tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        model = GPT2LMHeadModel.from_pretrained("gpt2")

        # プロンプトのエンコード
        inputs = tokenizer.encode(prompt, return_tensors="pt")

        # テキスト生成
        outputs = model.generate(
            inputs,
            max_length=1500,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
            temperature=0.7,
        )

        # 生成されたテキストのデコード
        article_content = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return article_content
    except Exception as e:
        print(f"Error generating article: {e}", file=sys.stderr)
        raise e

def main():
    if len(sys.argv) < 2:
        print("Error: No prompt provided.")
        sys.exit(1)

    prompt = sys.argv[1]
    article = generate_article(prompt)
    print(article)

if __name__ == "__main__":
    main()
