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
        try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error Response: ${errorText}`);
        }
        return response;
        } catch (error) {
        console.error(`Fetch Error: ${error}`);
        throw error;
        }
    };

    // ログイン時にユーザー情報を保存
    useEffect(() => {
        // トークンが既に保存されている場合、ユーザー情報をローカルストレージから取得
        const storedUser = localStorage.getItem("user");
        if (storedUser && token) {
        setCurrentUser(JSON.parse(storedUser));
        }
    }, [token]);

    return (
        <AuthContext.Provider
        value={{ currentUser, token, login, logout, apiRequest }}
        >
        {children}
        </AuthContext.Provider>
    );
};
