class UpdateGame < ActiveRecord::Migration[5.2]
  def change
    drop_table :games
    create_table :games do |t|
      t.integer :player1_id
      t.integer :player2_id

      t.integer :arena_width
      t.integer :arena_height

      t.float :ball_x
      t.float :ball_y
      t.float :ball_vx
      t.float :ball_vy
      t.integer :ball_size

      t.float :pad1_x
      t.float :pad1_y
      t.float :pad1_v
      t.integer :pad1_size

      t.float :pad2_x
      t.float :pad2_y
      t.float :pad2_v
      t.integer :pad2_size

      t.timestamps
    end
  end
end
