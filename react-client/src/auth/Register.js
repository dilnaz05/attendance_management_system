import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthDataService from "../services/auth.service";

const Register = ({ onRegister }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = () => {
        AuthDataService.register(username, email, password)
            .then((response) => {
                console.log(response.data);
                setMessage("Registration successful!");
                onRegister(username);
                navigate("/tutorials");
            })
            .catch((error) => {
                console.log(error);
                setMessage("Registration failed!");
            });
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <h5 className="card-header">Register</h5>
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
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <button onClick={handleRegister} className="btn btn-primary me-2">
                                Register
                            </button>
                            <div className="mt-3">{message}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
