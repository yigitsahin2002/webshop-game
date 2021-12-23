import {axios} from '.';

export const getAllPlatforms = async () => {
    const { data } = await axios.get(
        "platforms", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const savePlatform = async ({      
    id,
    naam_platform
}) => {
    const { data } = await axios({
        method : id? "put" : "post",
        url : `platforms/${id ?? ""}`,
        data : {
            naam_platform
        },
      });
      return data;
};

export const deletePlatform = async (id) => {
    await axios.delete(`platforms/${id}`);
};