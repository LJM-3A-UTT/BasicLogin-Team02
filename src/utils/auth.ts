import authApi from "../api/authApi";

export async function singIn( email:string, password:string) {
    const res = await authApi.post("/api/auth/login", {
        email,
        password,
    });
    return res.data;
}