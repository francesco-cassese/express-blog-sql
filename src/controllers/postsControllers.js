import { validateId, checkPosts, deletePostById, validatePostData, createSlug, checkPostsBySlug, getPostWithTags } from '../utils/serverUtils.js'
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
    const id = request.idValid;

    try {
        const postData = await getPostWithTags(id);

        if (postData.error) {
            response.status(404).json({
                error: postData.error,
                results: null
            })
            return;
        }

        response.status(200).json({
            error: null,
            results: postData.results
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

const store = async (request, response) => {

    console.log("BODY RICEVUTO:", request.body);
    const { title, content, image = "default.jpg", tags = [] } = request.body;

    if (!title || !content) {
        response.status(400).json({ error: "Titolo e contenuto sono obbligatori" });
        return;
    }

    try {
        const query = "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)";
        const [result] = await connection.execute(query, [title, content, image]);

        const postId = result.insertId;

        if (tags.length > 0) {

            const queries = tags.map(tagId => {
                const queryRelation = "INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)";

                return connection.execute(queryRelation, [postId, tagId]);
            })
            await Promise.all(queries);
        };

        response.status(201).json({
            message: "Post creato con successo",
            id: postId
        });
        return;

    } catch (error) {
        console.error("ERRORE NELLA STORE:", error);
        return response.status(500).json({ error: "Errore interno durante la creazione" });
    }
};

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

const destroy = async (request, response) => {
    const id = request.idValid;

    try {
        const result = await deletePostById(id);

        if (result.error) {
            return response.status(404).json({ error: result.error });
        }

        return response.sendStatus(204);
    } catch (error) {
        return response.status(500).json({ error: "Errore interno durante l'eliminazione" });
    }
};

export { index, show, store, update, modify, destroy }