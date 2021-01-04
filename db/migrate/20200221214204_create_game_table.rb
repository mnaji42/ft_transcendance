class CreateGameTable < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.integer :player1_id
      t.integer :player2_id
      t.integer :ball_x
      t.integer :ball_y
      t.integer :pad1_y
      t.integer :pad2_y

      t.timestamps
    end
  end
end
