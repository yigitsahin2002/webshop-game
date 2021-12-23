import {axios} from '.';

export const getAllTalen = async () => {
    const { data } = await axios.get(
        "talen", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const saveTaal = async ({      
    id,
    naam_taal
}) => {
    const { data } = await axios({
        method : id? "put" : "post",
        url : `talen/${id ?? ""}`,
        data : {
            naam_taal
        },
      });
      return data;
};

export const deleteTaal = async (id) => {
    await axios.delete(`talen/${id}`);
};