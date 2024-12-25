Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 認証
      post 'auth/signup', to: 'authentication#signup'
      post 'auth/login', to: 'authentication#login'

      # ダッシュボード
      get 'dashboard', to: 'dashboard#index'

      # リソース
      resources :users
      resources :articles, param: :slug # paramをslugに設定
      resources :categories, param: :slug
      resources :tags
      resources :supervisors
      resources :media do
        collection do
          post 'upload'
        end
      end
    end
  end
end
