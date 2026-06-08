import { validateId, checkPosts, deletePost, validatePostData, createSlug, checkPostsBySlug } from '../utils/serverUtils.js'

/*
   ============================================================
   INDEX (GET)
   ============================================================
 */
const index = (request, response) => {
    const { name, prep_time: prepTime, slug } = request.query;

    const prepTimeLimit = parseInt(prepTime);

    if (name) {
        const cleanName = name.trim();

        if (cleanName === "") {
            response.status(400).json({
                error: "Il nome non può essere vuoto",
                results: null
            });
            return;
        }

        if (!isNaN(cleanName)) {
            response.status(400).json({
                error: "Il nome non può essere un numero",
                results: null
            });
            return;
        }
    }

    if (prepTime && isNaN(prepTimeLimit)) {
        return response.status(400).json({
            error: "Il tempo di preparazione deve essere un numero",
            results: null
        });
    }

    const postsFiltered = posts.filter(post => {
        if (name) {
            const cleanName = name.trim().toLowerCase();
            if (!post.title.toLowerCase().includes(cleanName)) return false;
        }

        if (!isNaN(prepTimeLimit)) {
            if (post.prep_time > prepTimeLimit) return false;
        }

        return true;
    });

    if (postsFiltered.length === 0) {
        response.status(404).json({
            error: "Nessun post trovato",
            results: null
        })
        return;
    }

    response.json(postsFiltered);
};

/*
   ============================================================
   SHOW (GET/:slug)
   ============================================================
 */

const show = (request, response) => {

    const { slug } = request.params;

    const postFound = checkPostsBySlug(posts, slug);

    if (postFound.error) {
        return response.status(404).json(postFound);
    }

    response.status(200).json({
        error: null,
        results: postFound.results
    });
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