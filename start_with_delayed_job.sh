#!/bin/bash

# Delayed Jobをバックグラウンドで起動
echo "Starting Delayed Job..."
bundle exec bin/delayed_job start &

# Delayed Jobの起動確認
sleep 5
bundle exec bin/delayed_job status
if [ $? -ne 0 ]; then
    echo "Delayed Job failed to start."
    exit 1
fi
echo "Delayed Job is running."

# Webサーバーをフォアグラウンドで起動
echo "Starting Rails server..."
bundle exec rails server -p $PORT -e $RAILS_ENV
