import axios from "axios";

import { API_URL } from "../constants/";

const authHeader = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const commonApi = {
    checkTrader: (data) =>
        axios.post(
            `${API_URL}/check_trader`, data,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    getTraders: () =>
        axios.get(`${API_URL}/trader`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    createTrader: (data) =>
        axios.post(
            `${API_URL}/trader`, {data},
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    deleteTrader: (id) =>
        axios.delete(`${API_URL}/trader/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getRouting: () =>
        axios.get(`${API_URL}/routing`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),

    addRouting: (data) =>
        axios.post(
            `${API_URL}/routing`,
            {
                data
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),

    editRouting: (id, data) =>
        axios.put(
            `${API_URL}/routing/${id}`,
            {
                data
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),

    deleteRouting: (id) =>
        axios.delete(`${API_URL}/routing/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getUsers: () =>
        axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),

    updateAccountStatus: (id, disabled) =>
        axios.put(
            `${API_URL}/users/${id}`,
            {
                disabled,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
};

export default commonApi;
