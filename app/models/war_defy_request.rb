class WarDefyRequest < ApplicationRecord
  belongs_to :user
  belongs_to :defier, class_name: 'User'
  belongs_to :wars_waiting_match
end
