Delayed::Worker.logger = Rails.logger
Delayed::Worker.logger.level = Logger::INFO

# オプション設定
Delayed::Worker.max_attempts = 3
Delayed::Worker.max_run_time = 5.minutes
Delayed::Worker.destroy_failed_jobs = false
