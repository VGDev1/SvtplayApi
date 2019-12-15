exports.hashModel = async (key, data) => {
    return {
        name: key,
        id: data.id,
        slug: data.slug,
        thumbnail: data.thumbnail,
        popularity: data.popularity,
        type: data.type,
    };
};
