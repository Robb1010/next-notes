import fetch from 'electron-fetch';
import Keytar from './keytaroperations';

const kt = new Keytar();

class ApiOps {
    constructor() {
        this.password = '';
    }

    async login(credentials) {
        const {instance, url, username, password, keep} = credentials;
        let response = {};

        await fetch(url, {
            headers: {
                Authorization:
                    "Basic " + this.toBase64(username + ":" + password),
            }
        })
            .then(res => res.json())
            .then(res => {
                if (keep) {
                    kt.setPassword(`${username}|${instance}`, password);
                }
                this.password = password;
                response = res;
            })
            .catch(err => response = err);

        return response;
    }

    async newNote(credentials, category) {
        const { url, username } = credentials;
        let response = {};
        await fetch(url,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + this.toBase64(username + ":" + this.password)
                },
                body: JSON.stringify({
                    title: "New note",
                    content: "",
                    favorite: false,
                    category: category,
                })
            })
            .then(res => res.json())
            .then(res => {
                if (!res.error && !res.message) {
                    response = res;
                } else {
                    response = {
                        error: true,
                        ...res
                    }
                }
            })
            .catch(err => response = {
                error: true,
                ...err
            });
        return response;
    }

    async updateNote(credentials, body) {
        const { url, username } = credentials;
        let response = {};

        await fetch(`${url}/${body.id}`,
            {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + this.toBase64(username + ":" + this.password)
                },
                body: JSON.stringify(body)
            }
        )
            .then(res => res.json())
            .then(res => {
                if (!res.error && !res.message) {
                    response = res;
                } else {
                    response = {
                        error: true,
                        ...res
                    }
                }
            })
            .catch(err => response = {
                error: true,
                ...err
            });
        return response;
    }

    async deleteNote(credentials, noteId) {
        const { url, username } = credentials;
        let response = {};

        await fetch(`${url}/${noteId}`,
            {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + this.toBase64(username + ":" + this.password)
                }
            }
        )
            .then(res => res.json())
            .then(res => {
                if (!res.error && !res.message) {
                    response = res;
                } else {
                    response = {
                        error: true,
                        ...res
                    }
                }
            })
            .catch(err => response = {
                error: true,
                ...err
            });
        return response;
    }

    toBase64(string) {
        const buff = Buffer.from(string, 'utf-8');
        return buff.toString('base64');
    }
}

export default ApiOps;