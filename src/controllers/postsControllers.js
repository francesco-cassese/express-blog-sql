import { validateId, checkPosts, deletePost, validatePostData, createSlug, checkPostsBySlug } from '../utils/serverUtils.js'
import connection from '../data/dbBlog.js';

/*
   ============================================================
   INDEX (GET)
   ============================================================
 */

const index = async (request, response) => {

    const { name, prep_time } = request.query;
    const prepTimeLimit = parseInt(prep_time);

    if (name && name.trim() === "") {
        return response.status(400).json({ error: "Il nome non può essere vuoto", results: null });
    }

    if (prep_time && isNaN(prepTimeLimit)) {
        return response.status(400).json({ error: "Il tempo di preparazione deve essere un numero", results: null });
    }

    try {
        const [posts] = await connection.query(`SELECT * FROM posts`);
        if (posts.length === 0) {
            return response.status(404).json({
                error: "Nessun post trovato",
                results: null
            });
        }
        response.json({
            error: null,
            results: posts
        });
    } catch (error) {
        response.status(500).json({
            error: "Errore interno del server",
            results: null
        });
    }
};
/*
   ============================================================
   SHOW (GET/:id)
   ============================================================
 */

const show = async (request, response) => {
    const { id } = request.idValid;

    try {

        const query = "SELECT * FROM posts WHERE id = ?";
        const [posts] = await connection.execute(query, [id]);

        if (posts.length === 0) {
            return response.status(404).json({
                error: "Post non trovato",
                results: null
            });
        }

        response.status(200).json({
            error: null,
            results: posts[0]
        });

    } catch (error) {
        response.status(500).json({
            error: "Errore interno del server",
            results: null
        });
    }
};

/*
   ============================================================
   STORE (POST)
   ============================================================
 */

const store = (request, response) => {

    const validateData = request.body;
    const { title } = request.body;

    let newId = 1;

    if (posts.length > 0) {
        const listaId = posts.map(post => post.id);
        const maxId = Math.max(...listaId);
        newId = maxId + 1;
    }

    const slug = createSlug(title)

    const newPost = {
        id: newId,
        ...request.body,
        slug: slug,
        created_at: new Date().toISOString()
    }

    posts.push(newPost);

    response.status(201).json({
        error: null,
        message: "Post aggiunto con successo",
        results: newPost
    });
}

/*
   ============================================================
   UPDATE (PUT/:id)
   ============================================================
 */

const update = (request, response) => {

    const oldPost = request.post;
    const newBody = request.body;

    const updatedPost = {
        id: oldPost.id,
        ...newBody,
        slug: createSlug(newBody.title),
        updated_at: new Date().toISOString()
    };

    const index = posts.findIndex(post => post.id === oldPost.id);
    posts[index] = updatedPost;

    response.status(200).json({
        error: null,
        message: "Post sostituito con successo",
        results: updatedPost
    });
}
/*
   ============================================================
   MODIFY (PATCH:id)
   ============================================================
 */

const modify = (request, response) => {

    const oldPost = request.post;
    const body = request.body;

    const modificatedPost = {
        ...oldPost,
        title: body.title || oldPost.title,
        content: body.content || oldPost.content,
        tags: body.tags || oldPost.tags,
        prep_time: body.prep_time || oldPost.prep_time,
        slug: body.title ? createSlug(body.title) : oldPost.slug,
        updated_at: new Date().toISOString()
    };

    const index = posts.findIndex(post => post.id === oldPost.id);
    posts[index] = modificatedPost;

    response.status(200).json({
        error: null,
        message: "Post modificato con successo",
        results: modificatedPost,
    });
}

/*
   ============================================================
   DESTROY (DELETE/:id)
   ============================================================
 */

const destroy = (request, response) => {

    const { id } = request.post;

    const index = posts.findIndex(post => post.id === id);

    posts.splice(index, 1);

    response.sendStatus(204);
    console.log(posts);
}

export { index, show, store, update, modify, destroy }