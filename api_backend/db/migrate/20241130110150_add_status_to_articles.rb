class AddStatusToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :status, :string, default: 'draft', null: false
    add_index :articles, :status
  end
end
