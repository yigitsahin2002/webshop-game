import {axios} from '.';

export const getAllCategorieen = async () => {
    const { data } = await axios.get(
        "categorieen", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const saveCategorie = async ({      
    id,
    naam_categorie
}) => {
    const { data } = await axios({
        method : id? "put" : "post",
        url : `categorieen/${id ?? ""}`,
        data : {
            naam_categorie
        },
      });
      return data;
};

export const deleteCategorie = async (id) => {
    await axios.delete(`categorieen/${id}`);
};