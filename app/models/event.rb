class Event < ApplicationRecord
  has_many :availabilities
  has_many :users, through: :availabilities
end
