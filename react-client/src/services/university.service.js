// import axios from 'axios';
//
// const API_URL = "http://localhost:8080/api/universities";
//
// const getAllUniversities = () => {
//     return axios.get(API_URL);
// };
//
// const getUniversityById = id => {
//     return axios.get(`${API_URL}/${id}`);
// };
//
// const createUniversity = data => {
//     return axios.post(API_URL, data);
// };
//
// const updateUniversity = (id, data) => {
//     return axios.put(`${API_URL}/${id}`, data);
// };
//
// const deleteUniversity = id => {
//     return axios.delete(`${API_URL}/${id}`);
// };
//
// export default {
//     getAllUniversities,
//     getUniversityById,
//     createUniversity,
//     updateUniversity,
//     deleteUniversity
// };

import http from "../http-common";

class UniversityService {
    getAllUniversities() {
        return http.get("/universities");
    }

    getUniversityById(id) {
        return http.get(`/universities/${id}`);
    }

    createUniversity(data) {
        return http.post("/universities", data);
    }

    updateUniversity(id, data) {
        return http.put(`/universities/${id}`, data);
    }

    deleteUniversity(id) {
        return http.delete(`/universities/${id}`);
    }
}

export default new UniversityService();
