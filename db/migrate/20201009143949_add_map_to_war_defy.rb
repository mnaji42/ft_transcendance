class AddMapToWarDefy < ActiveRecord::Migration[6.0]
  def change
    add_column :defy_requests, :map, :string
  end
end
