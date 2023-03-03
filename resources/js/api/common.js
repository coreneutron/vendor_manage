import axios from "axios";

import { API_URL } from "../constants/";

const authHeader = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const commonApi = {
    uploadCsv: (data) =>
        axios.post(
            `${API_URL}/add_trader_from_csv`, data,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    checkTrader: (data) =>
        axios.post(
            `${API_URL}/check_trader`, data,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    getTrader: (id) =>
        axios.post(`${API_URL}/getTrader`, {id}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateTrader: (id, data) =>
        axios.put(`${API_URL}/trader/${id}`, data, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getTraders: (params) =>
        axios.post(`${API_URL}/all_traders`, params,  {
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
    selectedTraderDelete: (ids) =>
        axios.post(`${API_URL}/selected_trader_delete`, {ids: ids},  {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getClipboard: () =>
        axios.get(`${API_URL}/clipboard`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateClipboard: (id, data) =>
        axios.put(
            `${API_URL}/clipboard/${id}`, data,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
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
    updateUser: (id,data) =>
        axios.put(`${API_URL}/users/${id}`, data, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    deleteUser: (id) =>
        axios.delete(`${API_URL}/users/${id}`, {
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
    changePassword: (old_pwd, new_pwd) =>
        axios.post(
            `${API_URL}/changePwd`,
            {
                old_pwd,
                new_pwd,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
};

export default commonApi;
