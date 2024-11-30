#!/bin/bash

# エラー発生時にスクリプトを終了
set -e

# 仮想環境の作成
echo "Creating virtual environment..."
python3 -m venv venv

# 仮想環境の有効化
echo "Activating virtual environment..."
source venv/bin/activate

# pip のアップグレード
echo "Upgrading pip..."
pip install --upgrade pip

# 依存関係のインストール
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# NLTKデータのダウンロード
echo "Downloading NLTK data..."
python -m nltk.downloader punkt stopwords

echo "Setup completed successfully."
