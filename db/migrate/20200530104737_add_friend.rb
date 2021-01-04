class AddFriend < ActiveRecord::Migration[5.2]
  def change
    add_reference :users, :users, index: true, array: true, default: []
  end
end
