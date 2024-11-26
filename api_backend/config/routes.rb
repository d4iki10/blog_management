Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 認証
      post 'auth/signup', to: 'authentication#signup'
      post 'auth/login', to: 'authentication#login'

      # リソース
      resources :articles, param: :slug
      resources :categories, param: :slug
      resources :tags
      resources :supervisors
    end
  end
end
