import {axios} from '.';

export const getAllBestellingen = async () => {
    const { data } = await axios.get(
        "bestellingen", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const saveBestelling = async ({      
    id,
    gameID,
    aantal,
    datum
}) => {
    const method = id? "put" : "post";
    let toBeReturnedData;

    if (method === 'put') {
        const { data } = await axios({
            method,
            url : `bestellingen/${id ?? ""}`,
            data : {
                total_ordered : aantal,
                datum
            },
        });
        toBeReturnedData = data;
    } else {
        const { data } = await axios({
            method,
            url : `bestellingen/${id ?? ""}`,
            data : {
                game_id : gameID,
                total_ordered : aantal,
                datum
            },
        });
        toBeReturnedData = data;
    }
    
    return toBeReturnedData;
};

export const deleteBestelling = async (id) => {
    await axios.delete(`bestellingen/${id}`);
};