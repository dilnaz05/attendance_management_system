import http from "../http-common";
import { jwtDecode } from 'jwt-decode';
class AuthDataService {
    login(username, password) {
        return http.post("/auth/signin", { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('roles', JSON.stringify(response.data.roles));
                return response;
            })
            .catch(error => {
                throw error;
            });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        return http.post("/auth/logout")
            .then(response => response)
            .catch(error => {
                throw error;
            });
    }

    register(username, email, password) {
        return http.post("/auth/signup", { username, email, password })
            .then(response => {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('roles', JSON.stringify(response.data.roles)); // Store roles as JSON string
                return response;
            })
            .catch(error => {
                throw error;
            });
    }

    getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const user = jwtDecode(token);
            user.roles = JSON.parse(localStorage.getItem('roles') || '[]'); // Parse roles from local storage
            return user;
        } catch (error) {
            console.error("Error decoding token:", error); // Debugging line
            return null;
        }
    }
}

export default new AuthDataService();
