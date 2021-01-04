class AddBonusToDefy < ActiveRecord::Migration[6.0]
  def change
    add_column :defy_requests, :bonus, :integer
  end
end
