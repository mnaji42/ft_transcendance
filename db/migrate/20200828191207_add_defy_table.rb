class AddDefyTable < ActiveRecord::Migration[6.0]
  def change
    create_table :defy_requests do |t|
      t.belongs_to :defier
      t.belongs_to :user
    end
  end
end
