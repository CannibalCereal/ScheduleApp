class PagesController < ApplicationController
  before_action :require_user, only: [:home]
  def landing
  end

  def home
  end
end
