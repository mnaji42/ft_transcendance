class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :login
      t.string :password_digest

      t.timestamps
    end
    add_index :users, :login, unique: true
  end
end
