import sys
import json
import time
import random
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import requests

def get_search_results(keyword, num_pages=5):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-gpu')
    options.add_argument('--lang=ja-JP')
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36"
    options.add_argument(f'user-agent={user_agent}')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    search_results = []

    try:
        encoded_keyword = urllib.parse.quote_plus(keyword)
        pages = [0, 10, 20, 30, 40]
        rank = 1

        for idx, page in enumerate(pages, start=1):
            target_url = f'https://www.google.co.jp/search?q={encoded_keyword}&start={page}&hl=ja&lr=lang_ja'
            driver.get(target_url)
            wait = WebDriverWait(driver, 10)
            wait.until(EC.presence_of_element_located((By.ID, 'search')))
            time.sleep(1)

            elements = driver.find_elements(By.CSS_SELECTOR, 'div.g')

            for element in elements:
                try:
                    if element.get_attribute('data-hveid'):
                        pass
                    else:
                        continue

                    title_element = element.find_element(By.TAG_NAME, 'a')
                    title = title_element.text
                    url = title_element.get_attribute('href')

                    search_results.append({
                        'Keyword': keyword,
                        'Rank': rank,
                        'Title': title,
                        'URL': url
                    })

                    rank += 1

                except Exception:
                    continue

            time.sleep(random.uniform(2, 5))

    finally:
        driver.quit()

    return search_results

def main():
    if len(sys.argv) < 2:
        print("Error: No keyword provided.")
        sys.exit(1)

    keyword = sys.argv[1]
    print(keyword)
    results = get_search_results(keyword)
    print(json.dumps(results, ensure_ascii=False))

if __name__ == "__main__":
    main()
