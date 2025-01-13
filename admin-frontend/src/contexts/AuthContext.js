import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token")); // トークンを状態として管理
    const navigate = useNavigate();

    // ユーザー情報を取得する関数
    const fetchUser = async (token) => {
        try {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/users/me`,
            {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );
        if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
        } else {
            setCurrentUser(null);
            localStorage.removeItem("token");
            setToken(null);
        }
        } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        setCurrentUser(null);
        localStorage.removeItem("token");
        setToken(null);
        }
    };

    // ログイン関数
    const login = async (email, password) => {
        try {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "ログインに失敗しました");
        }
        const data = await response.json();
        setCurrentUser(data.user);
        localStorage.setItem("token", data.token); // トークンを保存
        setToken(data.token); // トークン状態を更新
        navigate("/dashboard");
        } catch (error) {
        throw error;
        }
    };

    // ログアウト関数
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
    };

    // APIリクエスト用のヘルパー関数
    const apiRequest = async (endpoint, options = {}) => {
        const storedToken = localStorage.getItem("token");
        const headers = options.headers || {};
        if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
        }
        const url = `${process.env.REACT_APP_API_BASE_URL}${endpoint}`;
        console.log(`API Request URL: ${url}`); // 追加
        console.log(`Authorization Header: ${headers["Authorization"]}`); // 追加
        return fetch(url, {
        ...options,
        headers,
        });
    };

    // コンポーネントのマウント時にユーザー情報を取得
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
        fetchUser(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider
        value={{ currentUser, token, login, logout, apiRequest }}
        >
        {children}
        </AuthContext.Provider>
    );
};
