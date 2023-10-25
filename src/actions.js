import axios from "axios";
import { config } from "./config.js";

export const sendFile = async (formData) => {
    const response = await axios.post(config.url + '/files/add', formData,
        {
            headers: {
                'Content-Type': 'multipart/formdata'
            }
        })
    return response
}

export const getFile = async (id) => {
    const response = await axios.get(config.url + '/files/get' + `?id=${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const registration = async (email, name, password, isAdmin) => {
    const response = await axios.post(config.url + '/auth/register', {
        email: email,
        name: name,
        password: password,
        is_admin: isAdmin
    }, {
        headers: {
            'Content-Type': 'application/vnd.api+json'
        }
    })
    return response
}

export const sendEmail = async (email) => {
    const response = await axios.post(config.url + '/auth/register', {
        email: email
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const authorization = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email)
    formData.append('password', password)
    const response = await axios.post(
        config.url + '/auth/jwt/login',
        formData,
        {
            headers: {
                'Content-Type': 'application/x-www-form-unreloaded'
            },
        },
    )
    if(response.status === 200){
        localStorage.setItem('access', response.data.access_token)
    }
    return response
}

export const getUser = async () => {
    try {
        const response = await axios.get(
            config.url + '/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'Content-Type': 'application/json'
            },
        })
        return response
    }
    catch {
        localStorage.removeItem('access')
        return 'retry'
    }
}

export const getAllUsers = async () => {

    const response = await axios.get(
        config.url + '/user/all', {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return response

}

export const sendTask = async (task) => {
    const response = await axios.post(config.url + '/task/add', task, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}