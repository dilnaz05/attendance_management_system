import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure this import is present
import "./App.css";
import UniversitiesList from "./components/university/UniversitiesList";
import AddUniversity from "./components/university/AddUniversity";
import University from "./components/university/University";
import AddDiscipline from "./components/disciplines/AddDiscipline";
import DisciplinesList from "./components/disciplines/DisciplinesList";
import AddTutorial from "./components/tutorial/add-tutorial.component";
import Tutorial from "./components/tutorial/tutorial.component";
import TutorialsList from "./components/tutorial/tutorials-list.component";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthDataService from "./services/auth.service";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      roles: []
    };
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = AuthDataService.getCurrentUser();
      if (user) {
        this.setState({ loggedIn: true, username: user.sub, roles: user.roles });
      }
    }
  };

  handleLogin = (username, roles) => {
    this.setState({ loggedIn: true, username: username, roles: roles });
  };

  handleRegister = (username, roles) => {
    this.setState({ loggedIn: true, username: username, roles: roles });
  };

  handleLogout = () => {
    console.log("Logout button clicked");  // Debugging line
    AuthDataService.logout()
        .then(() => {
          localStorage.removeItem('token');  // Ensure token is removed
          this.setState({ loggedIn: false, username: null, roles: [] });
        })
        .catch(error => {
          console.error("Logout error:", error);
        });
  };

  render() {
    const { loggedIn, username, roles } = this.state;
    const isAdmin = roles.includes("ROLE_ADMIN");

    return (
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Attendance Management System
            </Link>
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/tutorials"} className="nav-link">
                  Students
                </Link>
              </li>
              {loggedIn && (
                  <li className="nav-item">
                    <Link to={"/universities"} className="nav-link">
                      Universities
                    </Link>
                  </li>
              )}
              {loggedIn && (
                  <li className="nav-item">
                    <Link to={"/disciplines"} className="nav-link">
                      Disciplines
                    </Link>
                  </li>
              )}
              {loggedIn && isAdmin && (
                  <li className="nav-item">
                    <Link to={"/disciplines/add"} className="nav-link">
                      Add Discipline
                    </Link>
                  </li>
              )}
              {loggedIn && isAdmin && (
                  <li className="nav-item">
                    <Link to={"/add"} className="nav-link">
                      Add Students
                    </Link>
                  </li>
              )}
              {loggedIn && isAdmin && (
                  <li className="nav-item">
                    <Link to={"/universities/add"} className="nav-link">
                      Add Universities
                    </Link>
                  </li>
              )}
              {loggedIn ? (
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false">
                      {username}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <button className="dropdown-item" onClick={this.handleLogout}>
                        Logout
                      </button>
                    </div>
                  </li>
              ) : (
                  <>
                    <li className="nav-item">
                      <Link to={"/login"} className="nav-link">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/register"} className="nav-link">
                        Register
                      </Link>
                    </li>
                  </>
              )}
            </div>
          </nav>
          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<TutorialsList loggedIn={loggedIn} />} />
              <Route path="/tutorials" element={<TutorialsList loggedIn={loggedIn} />} />
              {loggedIn && <Route path="/add" element={<AddTutorial />} />}
              {loggedIn && <Route path="/universities" element={<UniversitiesList />} />}
              {loggedIn && <Route path="/universities/add" element={<AddUniversity />} />}
              <Route path="/tutorials/:id" element={<Tutorial />} />
              <Route path="/disciplines" element={<DisciplinesList />} />
              <Route path="/disciplines/add" element={<AddDiscipline />} />
              <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
              <Route path="/register" element={<Register onRegister={this.handleRegister} />} />
              <Route path="/universities/:id" element={<University />} />
            </Routes>
          </div>
        </div>
    );
  }
}

export default App;
