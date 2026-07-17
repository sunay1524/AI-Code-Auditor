import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getRepo(repo) {
    try {
        const response = await axios.post(`${API_URL}/api/audit/`, { repoUrl: repo }, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchAllRepo(ids = []) {
    try {
        let url = `${API_URL}/api/audit/all`;
        if (ids.length > 0) {
            url = `${API_URL}/api/audit/all?ids=${ids.join(",")}`;
        }
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchRepobyId(id) {
    try {
        const response = await axios.get(`${API_URL}/api/audit/${id}`, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export { getRepo, fetchAllRepo, fetchRepobyId }