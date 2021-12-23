import { axios } from ".";

export const login = async (email, password) => {
    const {data} = await axios.post("users/login", {
        user_email : email,
        user_password : password
    });
    return data;
};

export const register = async ({
    naam,
    achternaam,
    email,
    password
}) => {
    const { data } = await axios.post("users/register", {
        user_naam : naam,
        user_achternaam : achternaam,
        user_email : email,
        user_password : password
    });
    return data;
};

export const getById = async (id) => {
    const { data } = await axios.get(`users/${id}`);
    return data;
}

export const getAllUsers = async (id) => {
    const { data } = await axios.get(
        "users", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
}

export const saveUser = async ({      
    id,
    user_naam,
    user_achternaam,
    user_email,
}) => {
    const { data } = await axios({
        method : "put",
        url : `users/${id}`,
        data : {
            user_naam,
            user_achternaam,
            user_email,
        },
      });
      return data;
};

export const deleteUser = async (id) => {
    await axios.delete(`users/${id}`);
};