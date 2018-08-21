import { Layout } from './layout/layout';
import { Pagination } from './pagination/pagination';
import { User } from './user/user';
import { UserList } from './user-list/user-list';
import { UserService } from './user-service';

import {Transaction} from "./transaction/transaction";
import {TransactionList} from "./transaction-list/transaction-list"

import './index.css';


const userService = new UserService('https://livedemo.xsolla.com/fe/test-task/baev/users');

customElements.define('ta-layout', Layout);

customElements.define('ta-pagination', Pagination);

customElements.define('ta-user', User);

UserList.userService = userService;
customElements.define('ta-user-list', UserList);

customElements.define('ta-transaction', Transaction);
TransactionList.userService = userService;
customElements.define('ta-transaction-list', TransactionList);

const transactionList = document.querySelector('ta-transaction-list');
const userList = document.querySelector('ta-user-list');

userList.addEventListener('select', () => {
    console.log("selected user id");
    console.log(userList.selectedUserId);
    transactionList.userId = userList.selectedUserId;
});