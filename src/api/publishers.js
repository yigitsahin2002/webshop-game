import {axios} from '.';

export const getAllPublishers = async () => {
    const { data } = await axios.get(
        "publishers", {
            params : {
                limit : 50,
                offset : 0,
            },
        },
    );
    return data;
};

export const savePublisher = async ({      
    id,
    naam_publisher
}) => {
    const { data } = await axios({
        method : id? "put" : "post",
        url : `publishers/${id ?? ""}`,
        data : {
            naam_publisher
        },
      });
      return data;
};

export const deletePublisher = async (id) => {
    await axios.delete(`publishers/${id}`);
};