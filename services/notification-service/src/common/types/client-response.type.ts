export interface ClientResponse {
    code: number;
    message: string;
    data: {
        email: string;
    };
}