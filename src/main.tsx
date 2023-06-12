import React from 'react';
import { render } from 'react-dom';

function Main() {
    return <section>Hello!</section>;
}

const container = document.getElementById('root');
if (container !== null) {
    render(<Main />, container);
} else {
    console.warn('Unable to find target container. Creating one instead.');
    const createdContainer = document.createElement('div');
    createdContainer.id = 'root';
    document.body.appendChild(createdContainer);
    render(<Main />, createdContainer);
}
