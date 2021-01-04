class AddPlayerBlocking < ActiveRecord::Migration[6.0]
  def change
    create_table :user_blocks do |t|
      t.belongs_to :user
      t.belongs_to :blocked
    end
  end
end
