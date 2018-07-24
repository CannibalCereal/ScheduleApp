class CreateAvailabilities < ActiveRecord::Migration[5.2]
  def change
    create_table :availabilities do |t|
      t.belongs_to :user, index: true
      t.belongs_to :event, index: true
      t.string :start
      t.string :end
    end
  end
end
