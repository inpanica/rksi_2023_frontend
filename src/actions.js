import axios from "axios";
import { config } from "./config.js";

export const sendFile = async (id, formData) => {
    const response = await axios.post(config.url + `/files/add?task_id=${id}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/formdata',
                'Accept': 'application/json'
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
        is_admin: isAdmin,
        is_superuser: false
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
    if (response.status === 200) {
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

export const changeTask = async (changed) => {
    const response = await axios.patch(config.url + '/task/patch', changed, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const getTasks = async (email) => {
    const response = await axios.get(config.url + `/task/me?email=${email}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const getAllTasks = async () => {
    const response = await axios.get(config.url + `/task/all`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const deleteTask = async (id) => {
    const response = await axios.delete(config.url + `/task/delete?task_id=${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

