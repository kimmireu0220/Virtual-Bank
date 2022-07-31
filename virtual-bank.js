// common variable & function
const myStorage = window.localStorage;
// myStorage.clear();
let ids = [];
const IDS_KEY = 'ids';
const savedIDs = JSON.parse(myStorage.getItem(IDS_KEY));
let currentAccount, parsedCurrentAccount;
const [initialBalance, maxAccount] = [10000, '10000'];
const account = { pw: '', number: '', balance: initialBalance };
const [signUpPage, signInPage, transferPage] = [document.querySelector('.signUp'), document.querySelector('.signIn'), document.querySelector('.trasnfer')];

window.onload = function() {
  if (savedIDs) {
    ids = savedIDs;
  }
}

function goToSignup() {
  signInPage.id = transferPage.id = 'hidden';
  signUpPage.id = '';
}

function goToSignin() {
  signUpPage.id = transferPage.id = 'hidden';
  signInPage.id = '';
}

function goToTransfer() {
  signUpPage.id = signInPage.id = 'hidden';
  transferPage.id = '';
}

// sign-up.js
const signUp_id = document.querySelector('#signUp-main__form__id');
const signUp_pw = document.querySelector('#signUp-main__form__password');
const signUp_confirmPw = document.querySelector('#signUp-main__form__confirm-password');
const signUp_signUpButton = document.querySelector('.signUp-main__form__signUp-button');

function signUp() {
  if (signUp_id.value.replace(/(\s*)/g, '') && !ids.includes(signUp_id.value)) {
    if (signUp_pw.value === signUp_confirmPw.value) {
      account.pw = signUp_pw.value;
      let [randomValue, totalAccount] = [(Math.floor(Math.random() * maxAccount + 1).toString()), (ids.length + 1).toString().padStart(maxAccount.length, 0)];
      account.number = randomValue + totalAccount;
      ids.push(signUp_id.value);
      myStorage.setItem(signUp_id.value, JSON.stringify(account));
      myStorage.setItem(IDS_KEY, JSON.stringify(ids));
      alert(`발급된 계좌번호 : ${account.number}`);
      signUp_id.value = signUp_pw.value = signUp_confirmPw.value = '';
      goToSignin();
    }
    else {
      alert('비밀번호가 일치하지 않습니다');
    }
  }
  else {
    alert('올바르지 않은 아이디이거나 중복된 아이디입니다');
  }
}

// sign-in.js
const signIn_id = document.querySelector('#signIn-main__form__id');
const signIn_pw = document.querySelector('#signIn-main__form__password');
const signIn_signInButton = document.querySelector('.signIn-main__form__signIn-button');
const signIn_signUpButton = document.querySelector('.signIn-main__signUp-button');

function signIn() {
  currentAccount = signIn_id.value;
  parsedCurrentAccount = JSON.parse(myStorage.getItem(currentAccount));
  if (signIn_pw.value === parsedCurrentAccount.pw) {
    signIn_id.value = signIn_pw.value = '';
    transfer_userName.innerText = `${currentAccount} 님`;
    trasnfer_balance.innerText = `송금 가능 금액 : ${parsedCurrentAccount.balance}`;
    goToTransfer();
  }
}

// transfer.js
const transfer_userName = document.querySelector('.transfer-nav__user-name');
const transfer_menuButton = document.querySelector('.transfer-nav__user-menuButton');
const trasnfer_menus = document.querySelector('.transfer-aside__menus');
const transfer_revise = document.querySelector('.transfer-aside__menus__revise');
const transfer_delete = document.querySelector('.transfer-aside__menus__delete');
const transfer_logoutButton = document.querySelector('.transfer-nav__user-logout');
const trasnfer_balance = document.querySelector('#transfer-main__form__balance');
const transfer_account = document.querySelector('#transfer-main__form__account');
const transfer_amount = document.querySelector('#transfer-main__form__amount');
const transfer_transferButton = document.querySelector('.transfer-main__form__button');

function logout() {
  currentAccount = transfer_userName.innerText = '';
  goToSignin();
}   

function showMenu() {
  if (trasnfer_menus.id == 'hidden') {
    trasnfer_menus.id = '';
    transfer_menuButton.innerText = '🔼';
  }
  else {
    trasnfer_menus.id = 'hidden';
    transfer_menuButton.innerText = '🔽';
  }
}

function reviseInfomatino() {
  alert('정보 수정');
}

function deleteAccount() {
  alert('회원 탈퇴');
}

function transfer() {
  let isAccount;
  if (parsedCurrentAccount.balance >= transfer_amount.value && parsedCurrentAccount.number != transfer_account.value) {
    for (i = 0; i < ids.length; i++) {
      if (JSON.parse(myStorage.getItem(ids[i])).number == Number(transfer_account.value)) {
        isAccount = true;
        [parsedCurrentAccount.balance, parsedReceiverAccount.balance] = [senderBalance, receiverBalance];
        let [receiverAccount, parsedReceiverAccount] = [ids[i], JSON.parse(myStorage.getItem(receiverAccount))];
        let [senderBalance, receiverBalance] = [parsedCurrentAccount.balance - Number(transfer_amount.value), parsedReceiverAccount.balance + Number(transfer_amount.value)];
        myStorage.setItem(currentAccount, JSON.stringify(parsedCurrentAccount));
        myStorage.setItem(receiverAccount, JSON.stringify(parsedReceiverAccount));
        trasnfer_balance.innerText = `송금 가능 금액 : ${parsedCurrentAccount.balance}`;
        transfer_account.value = transfer_amount.value = '';
        alert('송금이 완료되었습니다');
      } 
    }
    if (!isAccount) {
      alert('존재하지 않는 계좌입니다');
      transfer_account.value = transfer_amount.value = '';
    }
  }
  if (parsedCurrentAccount.balance < transfer_amount.value) {
    transfer_account.value = transfer_amount.value = '';
    alert('송금 가능 금액보다 더 많은 금액을 송금할 수 없습니다');
  }
  if (parsedCurrentAccount.number == transfer_account.value) {
    transfer_account.value = transfer_amount.value = '';
    alert('본인에게 송금할 수 없습니다');
  }
}

// event-listener
signUp_signUpButton.addEventListener('click', signUp);
signIn_signInButton.addEventListener('click', signIn);
signIn_signUpButton.addEventListener('click', goToSignup);
transfer_menuButton.addEventListener('click', showMenu);
transfer_revise.addEventListener('click', reviseInfomatino);
transfer_delete.addEventListener('click', deleteAccount);
transfer_logoutButton.addEventListener('click', logout);
transfer_transferButton.addEventListener('click', transfer);
