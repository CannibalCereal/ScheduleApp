class CreateFinalEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :final_events do |t|
      t.integer :event_id
      t.string :start
    end
  end
end
