import axios from "axios";

const nasaApi = axios.create({
    baseURL: "https://api.nasa.gov/planetary",
    params: {
        api_key: "zpBtiG3MebkwF5QhEC3eA5VcOZgLyaXk8LUU8Uti"
    }
})

export default nasaApi;