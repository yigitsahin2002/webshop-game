import {axios} from '.';

export const getAllGames = async () => {
    const { data } = await axios.get(
        "games", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const saveGame = async ({      
    id,
    naam_game,
    prijs_game,
    descriptie_game,
    id_platform,
    imageUri_game,
    id_publisher,
    categorieen,
    talen
}) => {
    if (!imageUri_game && !descriptie_game) {
        const { data } = await axios({
            method : id? "put" : "post",
            url : `games/${id ?? ""}`,
            data : {
                naam_game,
                prijs_game,
                id_platform,
                id_publisher,
                categorieen,
                talen
            },
          });
          return data;
    }

    if (!imageUri_game) {
        const { data } = await axios({
            method : id? "put" : "post",
            url : `games/${id ?? ""}`,
            data : {
                naam_game,
                prijs_game,
                descriptie_game,
                id_platform,
                id_publisher,
                categorieen,
                talen
            },
          });
          return data;
    }

    if (!descriptie_game) {
        const { data } = await axios({
            method : id? "put" : "post",
            url : `games/${id ?? ""}`,
            data : {
                naam_game,
                prijs_game,
                id_platform,
                imageUri_game,
                id_publisher,
                categorieen,
                talen
            },
          });
          return data;
    }

    const { data } = await axios({
        method : id? "put" : "post",
        url : `games/${id ?? ""}`,
        data : {
            naam_game,
            prijs_game,
            descriptie_game,
            id_platform,
            imageUri_game,
            id_publisher,
            categorieen,
            talen
        },
      });
      return data;
};

export const deleteGame = async (id) => {
    await axios.delete(`games/${id}`);
};