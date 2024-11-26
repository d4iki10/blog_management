import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Users = () => {
    const { apiRequest, currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // デフォルトを 'user' に設定
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser) {
        setError("ユーザー情報の取得に失敗しました");
        return;
        }

        if (currentUser.role === "admin") {
        // 管理者は全ユーザーを取得
        const fetchUsers = async () => {
            try {
            const response = await apiRequest("/users", {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors || "ユーザーの取得に失敗しました");
            }
            const data = await response.json();
            setUsers(data);
            } catch (err) {
            setError(err.message);
            }
        };

        fetchUsers();
        } else {
        // 一般ユーザーは自分の情報のみ取得
        const fetchUser = async () => {
            try {
            const response = await apiRequest(`/users/${currentUser.id}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                errorData.errors || "ユーザー情報の取得に失敗しました"
                );
            }
            const data = await response.json();
            setUsers([data]); // 自分の情報のみ表示
            } catch (err) {
            setError(err.message);
            }
        };

        fetchUser();
        }
    }, [apiRequest, currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const method = editingUser ? "PUT" : "POST";
        const endpoint = editingUser ? `/users/${editingUser.id}` : "/users";
        const response = await apiRequest(endpoint, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            user: {
                email,
                password: password || undefined, // 編集時にパスワードを変更しない場合は undefined
                role: currentUser.role === "admin" ? role : undefined, // 一般ユーザーは役割を変更できない
            },
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "ユーザーの保存に失敗しました");
        }
        const data = await response.json();
        if (editingUser) {
            setUsers(
            users.map((user) => (user.id === editingUser.id ? data : user))
            );
        } else {
            setUsers([...users, data]);
        }
        setEmail("");
        setPassword("");
        if (currentUser.role === "admin") {
            setRole("user");
        }
        setEditingUser(null);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEmail(user.email);
        setPassword("");
        if (currentUser.role === "admin") {
        setRole(user.role);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        const response = await apiRequest(`/users/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "ユーザーの削除に失敗しました");
        }
        setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-6">ユーザー管理</h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                {error}
            </div>
            )}
            {/* 管理者のみ表示 */}
            {currentUser.role === "admin" && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                <label className="block text-gray-700">メールアドレス:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="例: user@example.com"
                />
                </div>
                <div>
                <label className="block text-gray-700">パスワード:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                    editingUser ? "変更する場合のみ入力" : "パスワードを入力"
                    }
                    required={!editingUser}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                </div>
                <div>
                <label className="block text-gray-700">役割:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="user">ユーザー</option>
                    <option value="admin">管理者</option>
                </select>
                </div>
                <div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    {editingUser ? "更新" : "追加"}
                </button>
                {editingUser && (
                    <button
                    type="button"
                    onClick={() => {
                        setEditingUser(null);
                        setEmail("");
                        setPassword("");
                        setRole("user");
                    }}
                    className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                    >
                    キャンセル
                    </button>
                )}
                </div>
            </form>
            )}
            {/* 一般ユーザーは自分の情報のみ表示 */}
            {currentUser.role !== "admin" && users.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-md shadow">
                <h3 className="text-xl font-medium mb-2">ユーザー情報</h3>
                <p>
                <strong>メールアドレス:</strong> {users[0].email}
                </p>
                <p>
                <strong>役割:</strong> {users[0].role}
                </p>
            </div>
            )}
            {/* 管理者のみ表示 */}
            {currentUser.role === "admin" && (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                <thead>
                    <tr>
                    <th className="py-2 px-4 border-b">メールアドレス</th>
                    <th className="py-2 px-4 border-b">役割</th>
                    <th className="py-2 px-4 border-b">アクション</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b flex item-center justify-center">
                        <button
                            onClick={() => handleEdit(user)}
                            className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                        >
                            編集
                        </button>
                        <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                        >
                            削除
                        </button>
                        </td>
                    </tr>
                    ))}
                    {users.length === 0 && (
                    <tr>
                        <td colSpan="3" className="text-center py-4">
                        ユーザーがありません。
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            )}
        </div>
    );
};

export default Users;
