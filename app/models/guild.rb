class Guild < ApplicationRecord

  validates :name, presence: true
  validates :name, uniqueness: true
  validates :anagram, length: { minimum: 3, maximum: 5 }
  validates :anagram, uniqueness: true

  def as_json(options={})
    super(:only => [
      :id,
      :name,
      :anagram,
      :points,
      :rank,
      :owner_id,
      :officers_id,
      :members_id,
      :wars_id,
      :actual_war_id,
      :history_wars_id,
    ])
  end
end
