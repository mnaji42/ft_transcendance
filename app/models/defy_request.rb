class DefyRequest < ApplicationRecord
  belongs_to :user
  belongs_to :defier, class_name: 'User'
  enum bonus: [ :BonusDefault, :BonusBarrier, :BonusDoubleBall ]
end
