import { validateId } from "../utils/serverUtils.js";

const idValidator = (request, response, next) => {

    const validateIdresults = validateId(request.params.id);

    if (validateIdresults.error) {
        response.status(400).json(validateIdresults);
        return;
    }

    request.idValid = validateIdresults.results;
    next();
};

export default idValidator;