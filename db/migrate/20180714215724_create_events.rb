class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :title
      t.string :host
      t.string :group
      t.string :location
      t.string :description
      t.timestamps
    end
  end
end
