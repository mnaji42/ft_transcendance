class UpdateUsers < ActiveRecord::Migration[5.2]
  def change
    drop_table :users
    create_table :users do |t|
      t.string :avatar_url
      t.string :displayname
      t.boolean :default_settings

      t.string :access_token
      t.string :token_type
      t.datetime :token_expire
      t.string :refresh_token
      t.string :token_scope

      t.integer :intra_id
      t.string :email
      t.string :login
      t.string :first_name
      t.string :last_name
      t.string :intra_url
      t.string :intra_displayname
      t.string :intra_image_url
      t.boolean :is_intra_staff

      t.timestamps
    end

    add_index :users, :login, unique: true
  end
end
