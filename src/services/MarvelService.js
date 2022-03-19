import question from '../resources/img/question.png'

class MarvelServise {

    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=eed59b29c3f2963eeeaa694b54bf377e";
    _baseOffset = 300;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
        const strPath = character.thumbnail.path;
        const nameImg = strPath.substr(strPath.lastIndexOf('/')+1);
        if (nameImg === 'image_not_available') {
            character.thumbnail.path = null ;
        }
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: character.thumbnail.path ?  `${character.thumbnail.path}.${character.thumbnail.extension}` : question,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }
}

export default MarvelServise;