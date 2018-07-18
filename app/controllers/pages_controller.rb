class PagesController < ApplicationController
  before_action :require_user, only: [:home, :eventpage, :grouppage]
  def landing
  end

  def home
  end

  def eventpage
  end

  def grouppage
  end
end
