import { Component } from '../component';

import style from './transaction-list.css';
import template from './transaction-list.html';

let dependencies = {};

export class TransactionList extends Component {

    static get userService() {
        return dependencies.userService;
    }

    static set userService(dependency) {
        dependencies.userService = dependency;
    }

    get transactions() {
        return Array.from(this.shadowRoot.querySelectorAll('ta-transaction'));
    }

    get pagination() {
        return this.shadowRoot.querySelector('ta-pagination');
    }

    get list() {
        return this.shadowRoot.getElementById('transactions-list');
    }

    get currentPage() {
        return +this.getAttribute('current-page');
    }

    set currentPage(value) {
        value ? this.setAttribute('current-page', value) : this.removeAttribute('current-page');
    }

    get offset() {
        return (this.currentPage - 1) * this.records;
    }

    static get observedAttributes() {
        return ['user-id'];
    }

    get userId(){
        return this.getAttribute('user-id');
    }

    set userId(value){
        if (value) {
            this.setAttribute('user-id', value);
        } else {
            this.removeAttribute('user-id');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'user-id'){
            this.renderList();
        }
    }

    constructor() {
        super();
        this.attachTemplate(template, style);
        this.records = 20;
        this.currentPage = 1;
        //this.addShadowEventListener('ta-user', 'change', this.select);
        this.addShadowEventListener('ta-pagination', 'change', this.changePage);
    }

    connectedCallback() {
        this.renderList();
    }



    changePage(event) {
        this.currentPage = event.detail.page;
        this.renderList();
    }

    select(event, transaction) {
        this.renderList();
    }

    emptyList() {
        while (this.list.hasChildNodes()) {
            this.list.removeChild(this.list.lastChild);
        }
    }

    renderList() {
        this.emptyList();

        if (this.userId === null) return;
        TransactionList.userService.getTransactions(this.userId,
            new Date(2000, 1, 1), new Date()).then(response => {

            this.pagination.totalRecords = response.length;
            this.pagination.recordsPerPage = this.records;
            this.pagination.currentPage = this.currentPage;

            response.map(transactionData => {
                const Transaction = customElements.get('ta-transaction');
                const transaction = new Transaction();

                transaction.amount = transactionData['amount'];
                transaction.comment = transactionData['comment'];
                transaction.operationId = transactionData['operation_id'];
                transaction.status = transactionData['status'];
                transaction.date = new Date(transactionData['date']);
                transaction.transactionType = transactionData['transaction_type'];
                transaction.userBalance = transactionData['user_balance'];
                transaction.enabled = transactionData['enabled'];

                this.list.appendChild(transaction);
            });
        });
    }
}