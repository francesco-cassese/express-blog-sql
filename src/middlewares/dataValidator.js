import { validatePostData } from "../utils/serverUtils.js";

const dataValidator = (request, response, next) => {

    const validation = validatePostData(request.body);

    if (validation.error) {
        response.status(400).json(validation);
        return;
    }

    request.body = validation.results;
    next();
};

export default dataValidator;