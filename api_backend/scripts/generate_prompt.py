import sys
import json

def generate_prompt(analysis_results):
    prompt = f"""
以下の分析結果に基づいて、「{analysis_results['target_keyword']}」に関するSEO上位表示を狙う記事を作成してください。

**分析結果**
1. ターゲットキーワード：{analysis_results['target_keyword']}
2. 平均文字数: {analysis_results['average_word_count']}
3. 平均見出し長さ: {analysis_results['average_heading_length']}
4. 平均見出し数: {analysis_results['average_num_headings']}
5. キーワード密度: {analysis_results['keyword_density']:.2f}
6. 感情分析: {analysis_results['average_sentiment']}
7. 最も頻出する上位30語: {', '.join(analysis_results['top_30_words'])}
8. {analysis_results['target_keyword']} の見出しに含めてほしいWord2Vecで学習した上位20語: {', '.join(analysis_results['word2vec_heading'])}
9. {analysis_results['target_keyword']} の本文に含めてほしいWord2Vecで学習した上位20語: {', '.join(analysis_results['word2vec_body'])}

**記事の構成例**
- 導入
- 著者プロフィール
- ゴール
- メインポイント1
- メインポイント2
- まとめ
※ 「ゴール」と「まとめ」は箇条書きで明記 、序文に見出しは必要ないです。

**著者プロフィール**
Webエンジニア歴5年以上。現在は、プログラミングスクールのメンターとして、次世代のエンジニア育成にも力を注いでいる。フロントエンドとバックエンドの開発に精通し、日々最新技術を追求しながら、実務経験をもとにした実践的な指導を行っている。スキル向上と学び続ける姿勢を大切にし、初心者から中級者まで幅広くサポートすることを得意としている。

**ポイント**
1. 見出し階層は、h1〜h3（必要に応じてh4）で構成され、タイトルはh1とする。
2. タイトルや序文はユーザーがが最初に目にする内容になります。記事を読みたくなるように意識する。
3. 具体的な経験談や日常的な例など自然な表現を交え、人間らしい親しみやすい語り口を重視する。
4. 類義語や言い換えを活用し、表現に変化を持たせる。
5. キーワード密度を適切に保ち、自然な文章を心がける。
6. セマンティックな関連性を高めるため、関連キーワードも適切に使用する。
7. 「皆さんはどう感じますか？」など、読者との対話や問いかけを適度に挿入する。
8. 必要に応じてコードを記載する。
9. 動作確認が必要となるコードは、VSCodeなどのコードエディタやコマンドで実装できるものに限定し、PCに直接インストールするものは記載しない。
10. 最新の情報を含めるため、公開日は最近のものを参考にする。
11. 技術ブログになるので、Mac, Windowsユーザーがいることを考慮する。
12. 公式ドキュメントの最新の情報を参照する。
13. 必要な場合は参照元として外部リンクを追加する。
14. あなたが書いた記事は生成AIが書いたコンテンツの判定を受けやすいので、人間のライターが書いた自然な表現になるように細心の注意を払う。
"""
    return prompt

def main():
    if len(sys.argv) < 2:
        print("Error: No data provided.")
        sys.exit(1)

    analysis_results_json = sys.argv[1]
    analysis_results = json.loads(analysis_results_json)

    prompt = generate_prompt(analysis_results)
    print(prompt)

if __name__ == "__main__":
    main()
