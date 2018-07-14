Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  if Rails.env.development? and defined?(Localtower)
    mount Localtower::Engine, at: "localtower"
  end

  root 'pages#home'
  get '/eventpage' => 'pages#eventpage'
  get '/createevent' => 'events#new'
  get '/home' => 'pages#home'
  get '/landing' => 'pages#landing'
  resources 'signups'
  post 'login' => 'sessions#create'
  get '/login' => 'sessions#new'
  delete 'logout' => 'sessions#destroy'
  resources 'groups'
  resources 'events'

end
