class ArticleGenerationJob < ApplicationJob
  queue_as :default

  require 'json'
  require 'shellwords'
  require 'open3'

  # def perform(article_id, article_input)
  def perform(article_id, keyword)
    Rails.logger.info "記事自動生成ジョブ開始: article_id=#{article_id}"
    article = Article.find(article_id)
    Rails.logger.info "記事を取得しました: #{article.inspect}"
    # keyword = article_input['topic'] # トピックをキーワードとして使用
    Rails.logger.info "記事自動生成のキーワード: #{keyword}"

    # # 1. Webスクレイピング
    # Rails.logger.info "scrape.py が起動しています: #{keyword}"
    # scraped_data = run_python_script('scripts/scrape.py', keyword)
    # Rails.logger.debug "スクレイピングデータ: #{scraped_data}"
    # begin
    #   scraped_json = parse_json(scraped_data, 'scrape.py')
    #   Rails.logger.debug "スクレイピングデータ（parsed）: #{scraped_json}"
    # rescue JSON::ParserError => e
    #   Rails.logger.error "スクレイピングデータのパースに失敗: #{e.message}"
    #   raise e
    # end

    # # 2. 機械学習による分析
    # Rails.logger.info "analyze.py が起動しています"
    # analyzed_data = run_python_script('scripts/analyze.py', scraped_data)
    # Rails.logger.debug "分析データ: #{analyzed_data}"
    # begin
    #   analyzed_json = parse_json(analyzed_data, 'analyze.py')
    #   Rails.logger.debug "分析データ（parsed）: #{analyzed_json}"
    # rescue JSON::ParserError => e
    #   Rails.logger.error "分析データのパースに失敗: #{e.message}"
    #   Rails.logger.error "分析スクリプトの出力: #{analyzed_data}"
    #   raise e
    # end

    # 3. プロンプトの作成
    Rails.logger.info "generate_prompt.py が起動しています"
    # prompt = run_python_script('scripts/generate_prompt.py', analyzed_data)
    prompt = run_python_script('scripts/generate_prompt.py', keyword)
    Rails.logger.debug "プロンプト生成: #{prompt}"

    # 4. ChatGPT APIによる記事生成
    Rails.logger.info "generate_article.py が起動しています"
    article_content = run_python_script('scripts/generate_article.py', prompt)
    Rails.logger.debug "自動生成した記事: #{article_content}"

    # 5. 記事の更新（下書きとして保存）
    Rails.logger.info "ID: #{article_id} に自動生成した記事を下書きで更新しました"
    article.update!(
      content: article_content,
      status: 'draft' # 下書きとして設定
    )
    Rails.logger.info "ID: #{article_id} の更新が成功しました"

  rescue JSON::ParserError => e
    Rails.logger.error "JSON parsing に失敗しました [#{article_id}]: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e
  rescue => e
    Rails.logger.error "ArticleGenerationJob に失敗しました #{article_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e # ジョブを再試行する場合は例外を再発生
  end

  private

  def run_python_script(script_path, *args)
    absolute_script_path = Rails.root.join(script_path).to_s
    python_executable = python_exec_for_env
    command = [python_executable, absolute_script_path] + args.map(&:to_s)

    Rails.logger.info "起動しているコマンド: #{command.join(' ')}"

    stdout, stderr, status = Open3.capture3(*command)

    if status.success?
      Rails.logger.info "Python のスクリプト #{script_path} アウトプット: #{stdout}"
      if stdout.strip.empty?
        Rails.logger.error "Python スクリプト #{script_path} が空の出力を返しました。"
        raise "Python script #{script_path} returned empty output."
      end
      return stdout.strip
    else
      Rails.logger.error "Python のスクリプト #{script_path} エラー: #{stderr}"
      raise "Python script #{script_path} failed: #{stderr}"
    end
  end

  # 環境ごとにPython実行パスを切り替える
  def python_exec_for_env
    if Rails.env.production?
      # 本番環境: システムのpython3
      "python3"
    else
      # 開発 or テスト環境: venv/bin/python3
      Rails.root.join("venv", "bin", "python3").to_s
    end
  end

  def parse_json(json_string, script_name)
    begin
      JSON.parse(json_string)
    rescue JSON::ParserError => e
      Rails.logger.error "parse JSON で失敗しています #{script_name}: #{e.message}"
      Rails.logger.error "JSON string: #{json_string}"
      raise e
    end
  end
end
