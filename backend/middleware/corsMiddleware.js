
const allowedOrigin = "http://localhost:5173"; //alowed frontend origin

export default function corsMiddleware(req, res, next) {
    const origin = req.headers.origin; //retrieve the request origin

    res.vary("Origin"); //tells caching systems that the response may differ depending on the request's origin

    if (origin === allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", origin);

        res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");

        res.setHeader("Access-Control-Allow-Headers","Content-Type");

        if (req.method === "OPTIONS") { //a preflight request is sent from the browser to the server to check whether the browser is allowed to JSON reqesuts
            return res.status(204).end();
        }
    }

    next();
}
