#!/bin/bash

# ログファイルの設定
LOG_FILE="delayed_job.log"

# Delayed Jobをバックグラウンドで起動
echo "Starting Delayed Job..." | tee -a $LOG_FILE
bundle exec bin/delayed_job start >> $LOG_FILE 2>&1

# Delayed Jobの起動確認
sleep 5
bundle exec bin/delayed_job status >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    echo "Delayed Job failed to start." | tee -a $LOG_FILE
    exit 1
fi
echo "Delayed Job is running." | tee -a $LOG_FILE

# Webサーバーをフォアグラウンドで起動
echo "Starting Rails server..." | tee -a $LOG_FILE
bundle exec rails server -p $PORT -e $RAILS_ENV >> $LOG_FILE 2>&1
