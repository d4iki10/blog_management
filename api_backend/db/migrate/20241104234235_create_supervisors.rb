class CreateSupervisors < ActiveRecord::Migration[7.1]
  def change
    create_table :supervisors do |t|
      t.string :name

      t.timestamps
    end
  end
end
