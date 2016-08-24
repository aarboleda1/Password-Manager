console.log('starting password manager');
var crypto = require('crypto-js')
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
  .command('create', 'Create a new account', function (yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: 'n',
        description: 'Account name (eg: Twitter, Facebook)',
        type: 'string'
      },
      username: {
        demand: true,
        alias: 'u',
        description: 'Account username or email',
        type: 'string'
      },
      password: {
        demand: true,
        alias: 'p',
        description: 'Account password',
        type: 'string'
      },
      masterPassword: {
        demand: true,
        alias: 'm',
        description: 'Master password',
        type: 'string'
      }
    }).help('help');
  })
  .command('get', 'Get an existing account', function (yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: 'n',
        description: 'Account name (eg: Twitter, Facebook)',
        type: 'string'
      },
      masterPassword: {
        demand: true,
        alias: 'm',
        description: 'Master password',
        type: 'string'
      }
    }).help('help');
  })
  .help('help')
  .argv;
var command = argv._[0];

// create
//     --name
//     --username
//     --password

// get
//     --name

// account.name Facebook
// account.username User12!
// account.password Password123!

function getAccounts (masterPassword){
  //if(argv.masterPassword !== masterPassword){
    // return;
  //}
  var accounts = storage.getItemSync('accounts')
  // console.log(accounts)
  //use getItemSync to fetch account
  if (typeof accounts !== 'undefined') {
     //decrypt
    var decryptedAccounts = crypto.AES.decrypt(accounts,masterPassword)
    //decrypt
    accounts = JSON.parse(decryptedAccounts.toString(crypto.enc.Utf8))
  } else {
    accounts = [];
  }

  //return accounts array
  return accounts;

}

function saveAccounts(accounts, masterPassword){
  // console.log(accounts)
  // console.log('helloooo')
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
  //encrypt accounts
  //console.log(encryptedAccounts)
  storage.setItemSync("accounts",encryptedAccounts.toString())
  //setItemSync to save the encrypted accounts
  //when yhou encrypt you end up w a string
  //return teh accounts array
  //console.log(accounts)
  return accounts;
}


function createAccount (account, masterPassword) {
  // var accounts = storage.getItemSync('accounts');

  // if (typeof accounts === 'undefined') {
  //   accounts = [];
  // } //MOVE THIS IF STATEMENT TO getAccounts
  var accounts = getAccounts(masterPassword)
  //refactor code above to use getAccounts

  accounts.push(account);
  //storage.setItemSync('accounts', accounts);

  saveAccounts(accounts,masterPassword);

  // ********************** what to return
  return account;
}

function getAccount (accountName, masterPassword) {
  // var accounts = storage.getItemSync('accounts');
  var matchedAccount;
  accounts = getAccounts(masterPassword);
  accounts.forEach(function (account) {
    if (account.name === accountName) {
      matchedAccount = account;
    }
  });

  return matchedAccount;
}

if (command === 'create') {
  var createdAccount = createAccount({
    name: argv.name,
    username: argv.username,
    password: argv.password
  },argv.masterPassword);
  console.log('Account created!');
  console.log(createdAccount);
} else if (command === 'get') {
  var fetchedAccount = getAccount(argv.name, argv.masterPassword);

  if (typeof fetchedAccount === 'undefined') {
    console.log('Account not found');
  } else {
    console.log('Account found!');
    console.log(fetchedAccount);
  }
}

//alias not working still















