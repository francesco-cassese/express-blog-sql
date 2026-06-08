import connection from "../data/dbBlog.js";

const validateId = (id) => {
    if (id === undefined || id === null) {
        return { error: "ID mancante", results: null };
    }

    const numId = Number(String(id).trim());

    if (isNaN(numId)) {
        return { error: "Formato ID non valido (deve essere un numero)", results: null };
    }

    if (!Number.isInteger(numId)) {
        return { error: "L'ID deve essere un numero intero", results: null };
    }

    if (numId <= 0) {
        return { error: "L'ID deve essere un valore positivo e maggiore di 0", results: null };
    }

    return { error: null, results: numId };
};

const checkPosts = (posts, id) => {

    const postFound = posts.find(post => post.id === id);

    if (!postFound) {
        return {
            error: `Post con ID ${id} non trovato nel sistema`,
            results: null
        };
    }

    return {
        error: null,
        results: postFound
    };
};

const deletePostById = async (id) => {

    const [result] = await connection.execute("DELETE FROM posts WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return { error: "Post non trovato", results: null };
    }

    return { error: null, results: "Post eliminato con successo" };
};

const validatePostData = (data) => {
    const { title, content, image } = data;

    if (!title || title.trim() === "") {
        return { error: "Il titolo è obbligatorio", results: null };
    }

    if (!content || content.trim() === "") {
        return { error: "Il contenuto è obbligatorio", results: null };
    }

    if (!image || image.trim() === "") return { error: "Immagine obbligatoria", results: null };

    return {
        error: null,
        results: { title, content, image }
    };
};

const createSlug = (title) => {
    if (!title || typeof title !== 'string') {
        return "";
    }

    const cleanTitle = title.trim().toLowerCase()
    const slug = cleanTitle.replace(/\s+/g, "-") // \s+: Trova uno o più spazi bianchi consecutivi e g: sostituisce tutte le occorrenze non solo la prima.



    let contatore = 0
    let newSlug = slug;

    while (posts.find(post => { return post.slug === newSlug; })) {
        newSlug = `${newSlug}-${contatore}`
        contatore++;
    }
    return newSlug;
}

const checkPostsBySlug = (posts, slug) => {
    const postFound = posts.find(post => post.slug === slug.trim());

    if (!postFound) {
        return {
            error: `Post '${slug}' non trovato`,
            results: null
        };
    }

    return {
        error: null,
        results: postFound
    };
};

const getPostWithTags = async (id) => {

    const [posts] = await connection.execute("SELECT * FROM posts WHERE id = ?", [id]);

    if (posts.length === 0) {
        return { error: "Post non trovato", results: null };
    }

    const queryTags = `
        SELECT t.id, t.label 
        FROM tags t
        JOIN post_tag pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
    `;
    const [tags] = await connection.execute(queryTags, [id]);

    return {
        error: null,
        results: {
            ...posts[0],
            tags: tags
        }
    };
};

export { validateId, checkPosts, deletePostById, validatePostData, createSlug, checkPostsBySlug, getPostWithTags };