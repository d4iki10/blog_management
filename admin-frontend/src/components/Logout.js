import React from "react";

const Logout = ({ history }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push("/login");
    };

    return <button onClick={handleLogout}>ログアウト</button>;
};

export default Logout;
