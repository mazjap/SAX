const HTTPMethod = Object.freeze({
    "get" : "GET",
    "put" : "PUT",
    "post" : "POST",
    "delete" : "DELETE"
});

class URLRequest {
    constructor(url, httpMethod = HTTPMethod.get, requestHeaders = null, body = null) {
        this.url = url;
        this.httpMethod = httpMethod;
        this.requestHeaders = requestHeaders;
        this.body = body;
    }
}

class Response {
    constructor(data, headers, status, statusText) {
        this.data = data;
        this.headers = headers;
        this.status = status;
        this.statusText = statusText;
    }
}

class SAX {
    static get(url) {
        return this.createRequest(new URLRequest(url));
    }

    static post(url, requestHeaders, body) {
        return this.createRequest(new URLRequest(url, HTTPMethod.post, requestHeaders, body));
    }

    static put(url, requestHeaders, body) {
        return this.createRequest(new URLRequest(url, HTTPMethod.put, requestHeaders, body));
    }

    static delete(url) {
        return this.createRequest(new URLRequest(url, HTTPMethod.delete));
    }

    static createRequest(urlRequest) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(new Response(xhr.response, xhr.getAllResponseHeaders(), xhr.status, xhr.statusText));
            };
    
            xhr.onerror = event => {
                reject("An error occurred. Bad URL? " + event.loaded + " bytes downloaded.")
            };
            xhr.onabort = event => {
                reject("Connection was aborted at " + event.loaded + " bytes.");
            };

            xhr.open(urlRequest.httpMethod, urlRequest.url);

            for (let key in urlRequest.requestHeaders ?? {}) {
                xhr.setRequestHeader(key, urlRequest.requestHeaders[key]);
            }

            xhr.send(urlRequest.body);
        });
    }
}

function setTitle(string) {
    document.getElementById("title").innerText = string;
}

SAX.get("https://swapi.dev/api/people/11/")
.then(response => {
    setTitle(response.data);
});

