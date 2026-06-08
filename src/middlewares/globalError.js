const globalError = (error, request, response, next) => {
    response.status(500).json({
        error: "Si è verificato un errore interno del server",
        results: null
    });
};

export default globalError