import axios from "axios";
import { getInternalAuthHeaders } from "./internal-auth.helper";

export async function fetchService(url: string) {
    const res = await axios.get(url, 
        {
            headers: await getInternalAuthHeaders()
        }
    );

    return res.data.data;
}