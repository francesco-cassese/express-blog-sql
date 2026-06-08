import { validatePostData } from "../utils/serverUtils.js";

const dataValidator = (request, response, next) => {

    const validation = validatePostData(request.body, posts);

    if (validation.error) {
        return res.status(400).json(validation);
    }

    request.body = validation.results;
    next();
};

export default dataValidator;