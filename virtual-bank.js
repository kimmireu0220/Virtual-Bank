// common variable & function
const myStorage = window.localStorage;

let ids = [];
const IDS_KEY = 'ids';
let savedIDs = JSON.parse(myStorage.getItem(IDS_KEY));
const [initialBalance, maxAccount] = [10000, '10000'];
const account = { pw: '', number: '', balance: initialBalance };
let currentAccount, parsedCurrentAccount;
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const modalText = document.querySelector('.modal-text');
const modalOk = document.querySelector('.okButton');
const signUpPage = document.querySelector('.signUp');
const signInPage = document.querySelector('.signIn');
const transferPage = document.querySelector('.trasnfer');
const revisePage = document.querySelector('.revise');

window.onload = function() {
  if (savedIDs) {
    ids = savedIDs;
  }
}

function showModal(text) {
  modal.id = modalOverlay.id = '';
  modalText.innerText = text;
}

function hideModal() {
  modal.id = modalOverlay.id = 'hidden';
}

function goToSignup() {
  signInPage.id = transferPage.id = revisePage.id = 'hidden';
  signUpPage.id = '';
}

function goToSignin() {
  signUpPage.id = transferPage.id = revisePage.id = 'hidden';
  signInPage.id = '';
}

function goToTransfer(event) {
  if (revisePage.id == '') {
    event.preventDefault();
  }
  signUpPage.id = signInPage.id = revisePage.id = 'hidden';
  transferPage.id = '';
}

function goToRevise() {
  signUpPage.id = signInPage.id = transferPage.id = 'hidden';
  revisePage.id = ''
}

modalOverlay.addEventListener('click', hideModal);
modalOk.addEventListener('click', hideModal);

// sign-up.js
const signUp_id = document.querySelector('#signUp-section__form__id');
const signUp_pw = document.querySelector('#signUp-section__form__password');
const signUp_confirmPw = document.querySelector('#signUp-section__form__confirm-password');
const signUp_signUpButton = document.querySelector('.signUp-section__form__signUp-button');

function signUp() {
  if (signUp_id.value.replace(/(\s*)/g, '') && !ids.includes(signUp_id.value)) {
    if (signUp_pw.value === signUp_confirmPw.value) {
      let randomValue = (Math.floor(Math.random() * maxAccount + 1).toString());
      let totalAccount = (ids.length + 1).toString().padStart(maxAccount.length, 0);
      let id = signUp_id.value;
      let pw = signUp_pw.value;
      let number = randomValue + totalAccount;
      signUp_id.value = signUp_pw.value = signUp_confirmPw.value = '';
      ids.push(id);
      account.pw = pw;
      account.number = number;
      myStorage.setItem(id, JSON.stringify(account));
      myStorage.setItem(IDS_KEY, JSON.stringify(ids));

      showModal(`발급된 계좌번호 : ${number}`);
      goToSignin();
    }
    else {
      showModal('비밀번호가 일치하지 않습니다.');
    }
  }
  else {
    showModal('올바르지 않은 아이디 혹은 중복된 아이디입니다.');
  }
}

signUp_signUpButton.addEventListener('click', signUp);

// sign-in.js
const signIn_form = document.querySelector('.signIn-section__form');
const signIn_id = document.querySelector('#signIn-section__form__id');
const signIn_pw = document.querySelector('#signIn-section__form__password');
const signIn_error = document.querySelector('.signIn-section__error');
const signIn_errorMessage = document.querySelector('.signIn-section__error-message');
const signIn_signUpButton = document.querySelector('.signIn-section__signUp-button');

function signIn(event) {
  event.preventDefault();
  currentAccount = signIn_id.value;
  parsedCurrentAccount = JSON.parse(myStorage.getItem(currentAccount));
  if (ids.includes(currentAccount)) {
    if (signIn_pw.value === parsedCurrentAccount.pw) {
      if (!signIn_error.id) {
        hideError();
      }
      signIn_id.value = signIn_pw.value = '';
      goToTransfer();
      transfer_userName.innerText = `${currentAccount} 님`;
      trasnfer_balance.innerText = `송금 가능 금액 : ${parsedCurrentAccount.balance}`;
    }
    else {
      showError('비밀번호가 일치하지 않습니다.');
    }
  }
  else {
    showError('존재하지 않는 아이디입니다.');
  }
}

function showError(text) {
  signIn_error.id = '';
  signIn_errorMessage.innerText = text;
}

function hideError() {
  signIn_error.id = 'hidden';
}

signIn_form.addEventListener('submit', signIn);
signIn_signUpButton.addEventListener('click', goToSignup);

// transfer.js
const transfer_userName = document.querySelector('.transfer-nav__user-name');
const transfer_logoutButton = document.querySelector('.transfer-nav__user-logout');
const transfer_menuButton = document.querySelector('.transfer-nav__user-menuButton');
const trasnfer_menus = document.querySelector('.transfer-aside__menus');
const transfer_revise = document.querySelector('.transfer-aside__menus__revise');
const transfer_delete = document.querySelector('.transfer-aside__menus__delete');
const trasnfer_balance = document.querySelector('.transfer-section__form__balance');
const transfer_account = document.querySelector('#transfer-section__form__account');
const transfer_amount = document.querySelector('#transfer-section__form__amount');
const transfer_transferButton = document.querySelector('.transfer-section__form__button');
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

function showDeleteAccountModal() {
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
        showModal('송금이 완료되었습니다.');
      }
    }
    if (!isAccount) {
      showModal('존재하지 않는 계좌입니다.');
      transfer_account.value = transfer_amount.value = '';
    }
  }
  if (parsedCurrentAccount.balance < transfer_amount.value) {
    transfer_account.value = transfer_amount.value = '';
    showModal('송금 가능 금액보다 더 많은 금액을 송금할 수 없습니다.');
  }
  if (parsedCurrentAccount.number == transfer_account.value) {
    transfer_account.value = transfer_amount.value = '';
    showModal('본인에게 송금할 수 없습니다.');
  }
}

function hideDeleteAccountModal() {
  transfer_modal.id = transfer_modalOverlay.id = 'hidden';
}

function confirmDelete() {
  myStorage.removeItem(currentAccount);
  let lastSavedIDs = JSON.parse(myStorage.getItem(IDS_KEY));
  let newSavedIDs = lastSavedIDs.filter(element => element != currentAccount);
  ids = newSavedIDs;
  myStorage.setItem(IDS_KEY, JSON.stringify(ids));
  goToSignin();
}

transfer_logoutButton.addEventListener('click', logout);
transfer_menuButton.addEventListener('click', showMenu);
transfer_revise.addEventListener('click', goToRevise);
transfer_delete.addEventListener('click', showDeleteAccountModal);
transfer_transferButton.addEventListener('click', transfer);
transfer_modalOverlay.addEventListener('click', hideDeleteAccountModal);
transfer_modalOk.addEventListener('click', confirmDelete);
transfer_modalNo.addEventListener("click", hideDeleteAccountModal);

// revise.js
const revise_title = document.querySelector('.revise-nav__title');
const revise_currentPassword = document.querySelector('#revise-section__form__current-password');
const revise_changePassword = document.querySelector('#revise-section__form__change-password');
const revise_confirmChangePassword = document.querySelector('#revise-section__form__confirm-change-password');
const revise_reviseButton = document.querySelector('.revise-section__form__revise-button');

function revise() {
  if (revise_currentPassword.value === parsedCurrentAccount.pw) {
    if (revise_changePassword.value === revise_confirmChangePassword.value) {
      let newPassword = revise_changePassword.value;
      parsedCurrentAccount.pw = newPassword;
      myStorage.setItem(currentAccount, JSON.stringify(parsedCurrentAccount));
      showModal('변경이 완료되었습니다.');
      goToSignin();
    }
    else {
      showModal('비밀번호가 일치하지 않습니다.');
    }
  }
  else {
    showModal('현재 비밀번호와 일치하지 않는 비밀번호입니다.');
  }
  revise_currentPassword.value = revise_changePassword.value = revise_confirmChangePassword.value = '';
}

revise_title.addEventListener('click', goToTransfer);
revise_reviseButton.addEventListener('click', revise);
