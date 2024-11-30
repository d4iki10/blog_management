Delayed::Worker.logger = Logger.new(Rails.root.join('log', 'delayed_job.log'))
Delayed::Worker.logger.level = Logger::INFO

# オプション設定
Delayed::Worker.max_attempts = 3
Delayed::Worker.max_run_time = 5.minutes
Delayed::Worker.destroy_failed_jobs = false
