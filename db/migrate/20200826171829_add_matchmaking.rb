class AddMatchmaking < ActiveRecord::Migration[6.0]
  def change
    create_table :waiting_matches do |t|
      t.belongs_to :user
      t.integer :level
      t.boolean :ranked
    end
  end
end
