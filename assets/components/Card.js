import Element from './Element.js'

function Card(){
    const card = new Element('div');
    card.setClass(["card-listbook", "margin-t-5", "padding-6", "padding-r-2", "rounded-lg", "font-normal"]);

    return card;
}

export default Card;