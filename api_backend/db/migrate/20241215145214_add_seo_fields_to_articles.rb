class AddSeoFieldsToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :meta_title, :string
    add_column :articles, :meta_description, :text
    add_column :articles, :featured_image_url, :string
  end
end
