#!/bin/bash

# Delayed Jobをバックグラウンドで起動
echo "Starting Delayed Job..."
bundle exec bin/delayed_job start

# Delayed Jobの起動確認
sleep 5
if bundle exec bin/delayed_job status; then
    echo "Delayed Job is running."
else
    echo "Failed to start Delayed Job."
    exit 1
fi

# Webサーバーを起動
echo "Starting Rails server..."
bundle exec rails server -p $PORT -e $RAILS_ENV
