class RenameUserUsersId < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :users_id, :friends_id
  end
end
