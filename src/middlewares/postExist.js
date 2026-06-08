import { checkPosts } from "../../src/utils/serverUtils.js";
import posts from "../../data/posts.js";

const postExists = (request, response, next) => {

    const id = request.idValid;

    const check = checkPosts(posts, id);

    if (check.error) {
        return response.status(404).json(check);
    }

    request.post = check.results;

    next();
};

export default postExists;