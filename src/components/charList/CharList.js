import React, { Component } from 'react/cjs/react.production.min';
import MarvelServise from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    myRef = React.createRef();
    state = {
        data: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 300,
        charEnded: false,
    }

    marvelService = new MarvelServise();

    componentDidMount() {
        this.onLoaderCharList();
    }

    onCharLoaded = (newData) => {
        let ended = false;
        if (newData.length < 9) {
            ended = true;
        }
        this.setState(({offset, data}) => ({
            data: [...data, ...newData], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({ 
            loading: false,
            error: true
        })
    }

    onLoaderCharList = () => {
        this.onRequest();
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    characters(arr) {
        const characters = arr.map((char, i) => {
        return (
            <li className="char__item"
                key = {char.id}
                ref={this.setRef}
                onClick={() => {
                    this.props.onCharSelected(char.id);
                    this.focusOnItem(i);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(char.id);
                        this.focusOnItem(i);
                    }
                }}>
                <img src={char.thumbnail} alt="abyss"/>
                <div className="char__name">{char.name}</div>
            </li>
                )
            })
        return (
            <ul className="char__grid">
                {characters}
            </ul>
        )
    }

    render() {
        const {data, loading, error, offset, newItemLoading, charEnded} = this.state;
        const list = this.characters(data);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? list : null;
    
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? "none" : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;