import sys
import json
import nltk
from collections import Counter
from langdetect import detect
from textblob import TextBlob
from janome.tokenizer import Tokenizer
from gensim.models import Word2Vec
from stopwordsiso import stopwords
from bs4 import BeautifulSoup
import requests

# ダウンロードメッセージを抑制するために quiet=True を追加
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

jp_stopwords = set(stopwords('ja')) | set([
    'の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ',
    'ある', 'いる', 'も', 'など', 'な', 'ので', 'から', 'まで', 'より', 'です',
    ' ', '\n', ' \n', '\n \n', '  '
])

tokenizer = Tokenizer()

def scrape_page_content(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.content, 'html.parser')
        paragraphs = [p.get_text() for p in soup.find_all('p')]
        headings = [h.get_text() for h in soup.find_all(['h1', 'h2', 'h3'])]
        content = ' '.join(paragraphs)
        return {
            'content': content,
            'headings': headings
        }
    except requests.exceptions.HTTPError as e:
        if response.status_code == 403:
            print(f"Error scraping {url}: 403 Forbidden", file=sys.stderr)
        else:
            print(f"HTTP error scraping {url}: {e}", file=sys.stderr)
        return {
            'content': '',
            'headings': []
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}", file=sys.stderr)
        return {
            'content': '',
            'headings': []
        }

def analyze_content(search_results, target_keyword):
    total_words = 0
    total_headings = 0
    total_heading_length = 0
    keyword_count = 0
    all_text = []
    all_headings_text = []

    contents = []

    for result in search_results:
        url = result['URL']
        page_content = scrape_page_content(url)
        text = page_content['content']
        headings = page_content['headings']

        if not text:
            continue

        word_count = len(text)
        total_words += word_count

        num_headings = len(headings)
        total_headings += num_headings
        total_heading_length += sum(len(h) for h in headings)

        keyword_count += text.lower().count(target_keyword.lower())

        all_text.append(text)
        all_headings_text.extend(headings)

        contents.append(text)

    num_pages = len(all_text)
    if num_pages == 0:
        avg_word_count = 0
        avg_heading_length = 0
        avg_num_headings = 0
        keyword_density = 0.0
    else:
        avg_word_count = total_words / num_pages
        avg_heading_length = total_heading_length / total_headings if total_headings > 0 else 0
        avg_num_headings = total_headings / num_pages
        total_keywords = keyword_count
        total_words_all = sum(len(text) for text in all_text)
        keyword_density = (total_keywords / total_words_all) * 100 if total_words_all > 0 else 0.0

    sentiment_scores = []
    for text in all_text:
        try:
            blob = TextBlob(text)
            sentiment = blob.sentiment.polarity
            sentiment_scores.append(sentiment)
        except:
            continue
    average_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0

    tokens = []
    for text in all_text:
        tokens_in_text = [token.base_form for token in tokenizer.tokenize(text) if token.base_form not in jp_stopwords and len(token.base_form) > 1]
        tokens.extend(tokens_in_text)

    word_freq = Counter(tokens)
    top_30_words = [word for word, freq in word_freq.most_common(30)]

    sentences = []
    for text in all_text:
        tokens_in_text = [token.base_form for token in tokenizer.tokenize(text) if token.base_form not in jp_stopwords and len(token.base_form) > 1]
        sentences.append(tokens_in_text)

    if sentences:
        model = Word2Vec(sentences, vector_size=100, window=5, min_count=2, workers=4)
        heading_words = []
        for heading in all_headings_text:
            tokens_in_heading = [token.base_form for token in tokenizer.tokenize(heading) if token.base_form not in jp_stopwords and len(token.base_form) > 1]
            heading_words.extend(tokens_in_heading)
        heading_word_freq = Counter(heading_words)
        common_heading_words = [word for word, freq in heading_word_freq.most_common(50)]
        word2vec_heading = []
        for word in common_heading_words:
            if word in model.wv:
                similar = model.wv.most_similar(word, topn=1)
                if similar:
                    word2vec_heading.append(similar[0][0])
            if len(word2vec_heading) >= 20:
                break

        word2vec_body = []
        for word in top_30_words:
            if word in model.wv:
                similar = model.wv.most_similar(word, topn=1)
                if similar:
                    word2vec_body.append(similar[0][0])
            if len(word2vec_body) >= 20:
                break
    else:
        word2vec_heading = []
        word2vec_body = []

    analysis_results = {
        'target_keyword': target_keyword,
        'average_word_count': int(avg_word_count),
        'average_heading_length': int(avg_heading_length),
        'average_num_headings': round(avg_num_headings, 2),
        'keyword_density': round(keyword_density, 2),
        'average_sentiment': round(average_sentiment, 2),
        'top_30_words': top_30_words,
        'word2vec_heading': word2vec_heading[:20],
        'word2vec_body': word2vec_body[:20]
    }

    return analysis_results

def main():
    if len(sys.argv) < 2:
        print("Error: No data provided.")
        sys.exit(1)

    try:
        search_results_json = sys.argv[1]
        search_results = json.loads(search_results_json)
        target_keyword = search_results[0]['Keyword'] if search_results else 'default'

        analysis_results = analyze_content(search_results, target_keyword)
        print(json.dumps(analysis_results, ensure_ascii=False))
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
