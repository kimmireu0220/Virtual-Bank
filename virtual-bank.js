// common variable & function
const myStorage = window.localStorage;
let ids = [];
const IDS_KEY = 'ids';
let savedIDs = JSON.parse(myStorage.getItem(IDS_KEY));
let currentAccount, parsedCurrentAccount;
const [initialBalance, maxAccount] = [10000, '10000'];
const account = { pw: '', number: '', balance: initialBalance };
const [signUpPage, signInPage, transferPage, revisePage] = [document.querySelector('.signUp'), document.querySelector('.signIn'), document.querySelector('.trasnfer'), document.querySelector('.revise')];

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

function goToRevise() {
  transferPage.id = 'hidden';
  revisePage.id = ''
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
const signIn_form = document.querySelector('.signIn-main__form');
const signIn_signUpButton = document.querySelector('.signIn-main__signUp-button');

function signIn(event) {
  event.preventDefault();
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
const transfer_logoutButton = document.querySelector('.transfer-nav__user-logout');
const trasnfer_menus = document.querySelector('.transfer-aside__menus');
const transfer_revise = document.querySelector('.transfer-aside__menus__revise');
const transfer_delete = document.querySelector('.transfer-aside__menus__delete');
const trasnfer_balance = document.querySelector('#transfer-main__form__balance');
const transfer_account = document.querySelector('#transfer-main__form__account');
const transfer_amount = document.querySelector('#transfer-main__form__amount');
const transfer_transferButton = document.querySelector('.transfer-main__form__button');
const transfer_modalOverlay = document.querySelector('.transfer__modal-overlay');     
const transfer_modal = document.querySelector('.transfer__modal');                      
const transfer_modalOk = document.querySelector('.transfer__modal__ok-button');           
const transfer_modalNo = document.querySelector('.transfer__modal__no-button');       

function logout() {
  currentAccount = transfer_userName.innerText = '';
  goToSignin();
}   

function showMenu() {
  if (trasnfer_menus.id == 'hidden') {
    trasnfer_menus.id = '';
  }
  else {
    trasnfer_menus.id = 'hidden';
  }
}

function reviseInfomation() {
  goToRevise();
}

function deleteAccount() {
  transfer_modal.id = transfer_modalOverlay.id = '';
}

function transfer() {
  let isAccount;
  if (parsedCurrentAccount.balance >= transfer_amount.value && parsedCurrentAccount.number != transfer_account.value) {
    for (i = 0; i < ids.length; i++) {
      if (JSON.parse(myStorage.getItem(ids[i])).number == Number(transfer_account.value)) {
        isAccount = true;
        let receiverAccount = ids[i];
        let parsedReceiverAccount = JSON.parse(myStorage.getItem(receiverAccount));
        let [senderBalance, receiverBalance] = [parsedCurrentAccount.balance - Number(transfer_amount.value), parsedReceiverAccount.balance + Number(transfer_amount.value)];
        [parsedCurrentAccount.balance, parsedReceiverAccount.balance] = [senderBalance, receiverBalance];
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

function hideConfirm() {
  transfer_modal.id =  transfer_modalOverlay.id = 'hidden';
}

function confirmDelete() {
  myStorage.removeItem(currentAccount);
  savedIDs = JSON.parse(myStorage.getItem(IDS_KEY));
  savedIDs = savedIDs.filter(element => element != currentAccount);
  ids = savedIDs;
  myStorage.setItem(IDS_KEY, JSON.stringify(ids));
  goToSignin();
  window.location.reload();
}

// revise.js
const revise_currentPassword = document.querySelector('#revise-main__form__current-password');
const revise_changePassword = document.querySelector('#revise-main__form__change-password');
const revise_confirmChangePassword = document.querySelector('#revise-main__form__confirm-change-password');
const revise_reviseButton = document.querySelector('.revise-main__form__revise-button');

function revise() {
  if (revise_currentPassword.value == parsedCurrentAccount.pw) {
    if (revise_changePassword.value == revise_confirmChangePassword.value) {
      parsedCurrentAccount.pw = revise_changePassword.value;
      myStorage.setItem(currentAccount, JSON.stringify(parsedCurrentAccount));
      alert('변경이 완료되었습니다');
      window.location.reload();
    }
    else {
      alert('비밀번호가 일치하지 않습니다');
    }
  }
  else {
    alert('올바르지 않은 비밀번호입니다');
  }
  revise_currentPassword.value = revise_changePassword.value = revise_confirmChangePassword.value = '';
}

// event-listener
signUp_signUpButton.addEventListener('click', signUp);
signIn_form.addEventListener('submit', signIn);
signIn_signUpButton.addEventListener('click', goToSignup);
transfer_logoutButton.addEventListener('click', logout);
transfer_menuButton.addEventListener('click', showMenu);
transfer_revise.addEventListener('click', reviseInfomation);
transfer_delete.addEventListener('click', deleteAccount);
transfer_transferButton.addEventListener('click', transfer);
transfer_modalOverlay.addEventListener('click', hideConfirm);
transfer_modalOk.addEventListener('click', confirmDelete);
transfer_modalNo.addEventListener("click", hideConfirm);
revise_reviseButton.addEventListener('click', revise);







