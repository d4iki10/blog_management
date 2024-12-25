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

  return (
    <>
      {currentUser ? (
        // 認証済みユーザー向けのレイアウト
        <div className="flex">
          <MenuBar />
          <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/new" element={<ArticleForm />} />
              <Route path="/articles/edit/:slug" element={<ArticleForm />} />
              {/* 追加 */}
              <Route
                path="/articles/auto-generate"
                element={<AutoGenerateArticle />}
              />{" "}
              {/* 追加 */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/supervisors" element={<Supervisors />} />{" "}
              {/* 追加 */}
              <Route path="/tags" element={<Tags />} /> {/* 追加 */}
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
