class Group < ApplicationRecord
  has_many :memberships
  has_many :users, through: :memberships
  has_many :invites

  def self.colorGen(i)
    case (i%4)
    when 0
      return "#FF5E5B"
    when 1
      return "#23B5D3"
    when 2
      return "#FFFFEA"
    when 3
      return "#279AF1"
    end
  end
end
