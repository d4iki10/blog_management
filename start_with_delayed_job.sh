#!/bin/bash

# Delayed Jobをバックグラウンドで起動
echo "Delayed Jobをバックグラウンドで起動開始..."
bundle exec bin/delayed_job start &

# Delayed Jobの起動確認
sleep 5
bundle exec bin/delayed_job status
if [ $? -ne 0 ]; then
    echo "Delayed Jobの起動に失敗しました"
    exit 1
fi
echo "Delayed Jobが起動中です"

# Webサーバーをフォアグラウンドで起動
echo "Webサーバーをフォアグラウンドでの起動が開始しました..."
bundle exec rails server -p $PORT -e $RAILS_ENV
