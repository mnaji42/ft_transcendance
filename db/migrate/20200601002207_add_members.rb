class AddMembers < ActiveRecord::Migration[5.2]
  def change
    add_reference :guilds, :owner, index: true, default: 0
    add_reference :guilds, :officers, index: true, array: true, default: []
    add_reference :guilds, :members, index: true, array: true, default: []
  end
end
