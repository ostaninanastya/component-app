import {Component} from '../component';

import style from './transaction.css';
import template from './transaction.html';

export class Transaction extends Component {
    get registerDate() {
        return this._registerDate;
    }

    set registerDate(date) {
        this._registerDate = date;
        this.shadowRoot.getElementById('register-date').innerText = this._registerDate.toLocaleString();
    }

    constructor() {
        super();
        this.attachTemplate(template, style);

        this.bindPropertiesToElements([
            'amount',
            'comment',
            'operationId',
            'status',
            'transactionType',
            'userBalance'
        ]);
        this.bindPropertiesToAttributes([
            'enabled'
        ]);

    }
}