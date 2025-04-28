import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthDataService from "../services/auth.service";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = () => {
        AuthDataService.login(username, password)
            .then((response) => {
                setMessage("Login successful!");
                onLogin(username, response.data.roles); // Pass roles to the parent component
                navigate("/tutorials");
            })
            .catch((error) => {
                console.log(error);
                setMessage("Login failed!");
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <h5 className="card-header">Login</h5>
                        <div className="card-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button onClick={handleLogin} className="btn btn-primary me-2">
                                Login
                            </button>
                            <div className="mt-3">{message}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
