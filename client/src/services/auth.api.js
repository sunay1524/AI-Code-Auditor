import axios from "axios"


async function getRepo(repo) {
    try {
        const response = await axios.post("http://localhost:3001/api/audit/", { repoUrl: repo }, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

async function fetchAllRepo(ids = []) {
    try {
        let url = "http://localhost:3001/api/audit/all";
        if (ids.length > 0) {
            url = `http://localhost:3001/api/audit/all?ids=${ids.join(",")}`;
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
        const response = await axios.get(`http://localhost:3001/api/audit/${id}`, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export { getRepo, fetchAllRepo, fetchRepobyId }