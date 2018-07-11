Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/landing' => 'pages#landing'
  resources 'signups'
  post 'login' => 'sessions#create'
  get '/login' => 'sessions#new'
  delete 'logout' => 'sessions#destroy'

end
