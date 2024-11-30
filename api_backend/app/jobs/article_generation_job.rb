class ArticleGenerationJob < ApplicationJob
  queue_as :default

  require 'json'
  require 'shellwords'

  def perform(article_id, article_input)
    Rails.logger.info "ArticleGenerationJob started for Article ID #{article_id}"
    article = Article.find(article_id)
    keyword = article_input['topic'] # トピックをキーワードとして使用

    Rails.logger.info "Keyword for article generation: #{keyword}"

    # 1. Webスクレイピング
    Rails.logger.info "Running scrape.py with keyword: #{keyword}"
    scraped_data = run_python_script('scripts/scrape.py', keyword)
    Rails.logger.debug "Scraped data: #{scraped_data}"
    scraped_json = parse_json(scraped_data, 'scrape.py')

    # 2. 機械学習による分析
    Rails.logger.info "Running analyze.py with scraped data"
    analyzed_data = run_python_script('scripts/analyze.py', scraped_data)
    Rails.logger.debug "Analyzed data: #{analyzed_data}"
    analyzed_json = parse_json(analyzed_data, 'analyze.py')

    # 3. プロンプトの作成
    Rails.logger.info "Running generate_prompt.py with analyzed data"
    prompt = run_python_script('scripts/generate_prompt.py', analyzed_data)
    Rails.logger.debug "Generated prompt: #{prompt}"

    # 4. ChatGPT APIによる記事生成
    Rails.logger.info "Running generate_article.py with prompt"
    article_content = run_python_script('scripts/generate_article.py', prompt)
    Rails.logger.debug "Generated article content: #{article_content}"

    # 5. 記事の更新（下書きとして保存）
    Rails.logger.info "Updating article ID #{article_id} with generated content"
    article.update!(
      content: article_content,
      status: 'draft' # 下書きとして設定
    )
    Rails.logger.info "Article ID #{article_id} updated successfully"

  rescue JSON::ParserError => e
    Rails.logger.error "JSON parsing failed for ArticleGenerationJob [#{article_id}]: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e
  rescue => e
    Rails.logger.error "ArticleGenerationJob failed for Article ID #{article_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e # ジョブを再試行する場合は例外を再発生
  end

  private

  def run_python_script(script_path, *args)
    absolute_script_path = Rails.root.join(script_path).to_s
    escaped_args = args.map { |arg| Shellwords.escape(arg.to_s) }
    command = ["python3", absolute_script_path] + escaped_args

    Rails.logger.info "Running command: #{command.join(' ')}"
    output = `#{command.join(' ')}`
    exit_status = $?.exitstatus

    if exit_status != 0
      Rails.logger.error "Python script #{script_path} failed with status #{exit_status}: #{output}"
      raise "Python script #{script_path} failed"
    end

    Rails.logger.info "Python script #{script_path} output: #{output}"
    output.strip # 余分な空白や改行を削除
  end

  def parse_json(json_string, script_name)
    begin
      JSON.parse(json_string)
    rescue JSON::ParserError => e
      Rails.logger.error "Failed to parse JSON from #{script_name}: #{e.message}"
      Rails.logger.error "JSON string: #{json_string}"
      raise e
    end
  end
end
