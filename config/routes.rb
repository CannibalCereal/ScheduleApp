Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  if Rails.env.development? and defined?(Localtower)
    mount Localtower::Engine, at: "localtower"
  end

  root 'pages#home'
  get '/eventpage' => 'pages#eventpage'
  get '/grouppage' => 'pages#grouppage'
  get '/createevent' => 'events#new'
  get '/events/:id' => 'events#show', as: :individualEvent
  get '/events/final/:id' => 'events#showFinal', as: :finalEvent
  get '/home' => 'pages#home'
  get '/landing' => 'pages#landing'
  resources 'signups'
  post 'login' => 'sessions#create'
  get '/login' => 'sessions#new'
  delete 'logout' => 'sessions#destroy'
  post '/eventcal' => 'events#cal'
  post '/userAvail' => 'events#userAvail'
  post '/hostFinal' => 'events#finalize'
  get '/getAvails' => 'events#getAvails'
  get '/getHomepage' => 'pages#eventsByGroup'
  delete '/deleteAvails' => 'events#deleteAvails', as: :deleteAvails
  delete '/deleteEvent' => 'events#deleteEvent'
  post '/group/new_member' => 'pages#addmember'
  resources 'groups'
  resources 'events'
  resources 'invite'

end
