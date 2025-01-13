import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import ArticleForm from "./pages/ArticleForm";
import AutoGenerateArticle from "./pages/AutoGenerateArticle";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Supervisors from "./pages/Supervisors";
import Tags from "./pages/Tags";
import MenuBar from "./components/MenuBar";
import Media from "./components/Media";
import { useState } from "react";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  // メニューの開閉状態を管理するステート
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <>
      {currentUser ? (
        // 認証済みユーザー向けのレイアウト
        <div className="flex">
          {/* isMenuOpen を渡す */}
          <MenuBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <div
            className={`flex-1 ${
              isMenuOpen
            } p-6 bg-gray-100 min-h-screen transition-all duration-300`}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<ArticleForm />} />
              <Route path="/articles/edit/:slug" element={<ArticleForm />} />
              <Route
                path="/articles/auto-generate"
                element={<AutoGenerateArticle />}
              />{" "}
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/supervisors" element={<Supervisors />} />{" "}
              <Route path="/tags" element={<Tags />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/media" element={<Media />} />
            </Routes>
          </div>
        </div>
      ) : (
        // 未認証ユーザー向けのレイアウト（Loginページのみ）
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;
