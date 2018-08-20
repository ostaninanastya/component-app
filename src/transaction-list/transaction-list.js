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

    get users() {
        return Array.from(this.shadowRoot.querySelectorAll('ta-user'));
    }

    constructor() {
        super();
        this.attachTemplate(template, style);
        this.records = 20;
        this.currentPage = 1;
        this.addShadowEventListener('ta-transaction', 'click', this.select);
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
        this.transactions.map(transaction => transaction.classList.remove('selected'));
        transaction.classList.add('selected');
    }

    emptyList() {
        while (this.list.hasChildNodes()) {
            this.list.removeChild(this.list.lastChild);
        }
    }

    renderList() {
        this.emptyList();

        TransactionList.userService.getTransactions(this.users.find(user => user.classList.contains('selected')),
            new Date(2000, 1, 1), new Date()).then(response => {
            this.pagination.totalRecords = response['recordsTotal'];
            this.pagination.recordsPerPage = this.records;
            this.pagination.currentPage = this.currentPage;

            response.data.map(transactionData => {
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