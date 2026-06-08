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

const deletePost = (posts, id) => {
    const indexOfPosts = posts.findIndex(post => post.id === id);

    if (indexOfPosts === -1) {
        return {
            error: `Post con ID ${id} non trovato`,
            results: null
        };
    }

    const removedPost = posts.splice(indexOfPosts, 1);

    return {
        error: null,
        results: `rimozione di ${removedPost[0].title} avvenuta con successo`
    };
};

const validatePostData = (data, posts) => {
    const { title, content, prep_time, } = data;

    if (!title || title.trim() === "") {
        return {
            error: "Il titolo è obbligatorio",
            results: null
        };
    }

    const postEsistente = posts.find(post => post.title.toLowerCase() === title.toLowerCase());
    if (postEsistente) {
        return {
            error: "Esiste già un post con questo titolo",
            results: null
        };
    }

    if (!content || content.trim() === "") {
        return {
            error: "Il contenuto è obbligatorio",
            results: null
        };
    }

    const numPrepTime = Number(prep_time);
    if (isNaN(numPrepTime) || numPrepTime < 0) {
        return {
            error: "Il tempo di preparazione deve essere un numero positivo",
            results: null
        };
    }

    return {
        error: null,
        results: { ...data, prep_time: numPrepTime }
    };
}

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

export { validateId, checkPosts, deletePost, validatePostData, createSlug, checkPostsBySlug };