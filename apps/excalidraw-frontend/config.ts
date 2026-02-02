export const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
export const ws_backend_url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
export const JWT_SECRET=process.env.JWT_SECRET || "my_super_secret_jwt_secret"