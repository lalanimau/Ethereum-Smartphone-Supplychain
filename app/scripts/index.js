// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css';
// const HDWalletProvider = require("truffle-hdwallet-provider");
// const mnemonic = "write define struggle ball leg blur enemy distance truly double embrace promote";


// Import libraries we need.
import { default as Web3 } from 'web3'
// const provider = new HDWalletProvider(
//   mnemonic,
//   'https://ropsten.infura.io/v3/8ea6f9a7f9ba4612afe9410f22222d7b'
// );
// var web3 = new Web3(provider);
// var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/8ea6f9a7f9ba4612afe9410f22222d7b'));
var web3 = new Web3(new Web3.providers.HttpProvider('http://3.19.62.104:8545'));
console.log("web3 => ",web3)
import { default as contract } from 'truffle-contract'
console.log("jhkjkl => ",web3.eth.accounts[0])
// // Import our contract artifacts and turn them into usable abstractions.
import Core from '../../build/contracts/Core.json'

// // StarNotary is our usable abstraction, which we'll use through the code below.
const SupplyChainContract = contract(Core);


// // The following code is simple to show off interacting with your contracts.
// // As your needs grow you will likely need to change its form and structure.
// // For application bootstrapping, check out window.addEventListener below.
let accounts;
let account;

// const createStar = async () => {
//   const instance = await StarNotary.deployed();
//   const name = document.getElementById("starName").value;
//   const id = document.getElementById("starId").value;
//   await instance.createStar(name, id, {from: account});
//   App.setStatus("New Star Owner is " + account + ".");
// }

// // Add a function lookUp to Lookup a star by ID using tokenIdToStarInfo()
// const lookupStar = async () => {
//   const instance = await StarNotary.deployed();
//   const id = document.getElementById("starId2").value;
//   const starName = await instance.lookUptokenIdToStarInfo( id);
//   App.starName("Star Name: " + starName + ".");
// }
// //


// const abc = new Web3()
// console.log("web 3 -> ", abc)
const App = {
  start: function () {
    const self = this
    // var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    // Bootstrap the MetaCoin abstraction for Use.
    console.log("jhkjkl => ",web3.eth.accounts[0])
    SupplyChainContract.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs;
      alert("Hello => " + accounts[0])
      account = accounts[0];
    })
  },

}

window.App = App

window.addEventListener('load', async function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://3.19.62.104:8545'))
  }

  App.start();

  let coreInstance = await SupplyChainContract.deployed();
  window.coreInstance = coreInstance;

  const roles = [
    "manufacturer",
    "smartphone_company",
    "retailer",
    "consumer"
  ];

  const addRemoveFormNames = [
    "manufacturer",
    "smartphone_company",
    "retailer"
  ];

  const statusOutput = document.getElementById("status");

  const smartphonesOnSaleList = document.getElementById("smartphones-on-sale");
  const productDetailsOutput = document.getElementById("product-details");
  const productTracesOutput = document.getElementById("product-traces");

  let selectedRole = "manufacturer";


  window.rolesListElement = document.getElementById("roles");
  window.activeRolesList = document.getElementById("activeRole");
  window.addRemoveRolesFormSumbitBtn = document.querySelectorAll(".add-remove-button");

  addRemoveFormNames.forEach((form, i) => {
    addRemoveRolesFormSumbitBtn[i].onclick = onAddRemoveClicked.bind(null, form);
  });

  rolesListElement.addEventListener("click", (event) => {
    let newRole = event.target.getAttribute("name");
    if (newRole == selectedRole) return;
    selectRole(newRole);
  });

  function selectRole(newRole) {
    [rolesListElement, activeRolesList].forEach(item => {
      item.children[selectedRole].className = "";
      item.children[newRole].className = "active";
    });
    selectedRole = newRole;
  }

  async function onAddRemoveClicked(form) {
    let address = document.forms[`add-remove-${form}`].address.value;
    let addOrRemove = document.forms[`add-remove-${form}`].addOrRemove.value;
    if (!address) { alert("Please enter a valid address"); return; }
    let addRemove = () => { };
    if (form == addRemoveFormNames[0])
      addRemove = coreInstance[`${addOrRemove}Manufacturer`];
    else if (form == addRemoveFormNames[1])
      addRemove = coreInstance[`${addOrRemove}SmartphoneMaker`];
    else
      addRemove = coreInstance[`${addOrRemove}Retailer`];
    try {
      await addRemove(address, { from: web3.eth.accounts[0] });
      statusOutput.innerText = "Operation successfull";
    } catch (e) {
      statusOutput.innerText = "Something went wrong!" + e;
    }

  }

  async function manufactureComponents() {
    let currentAccount = web3.eth.accounts[0];
    let isAllowed = await coreInstance.isManufacturer(currentAccount);
    if (!isAllowed) {
      alert("This account is not authorized to perform this action");
      return;
    }
    else {
      try {
        let formInputs = document.forms.manufactureComponents.children;
        let upc = formInputs.upc.value;
        let notes = formInputs.notes.value;
        let price = web3.toWei(formInputs.price.value, "ether");
        if (!upc || !notes || !formInputs.price.value) { alert("Please fill all the details"); return; }
        if (+price <= 0) { alert("Price should be greater than 0"); return; }
        await coreInstance.manufactureComponents(upc, notes, price, { from: currentAccount, gas: 4000000 });
        let event = coreInstance.ComponentsManufactured();
        await event.watch((err, res) => {
          if (err) { throw new Error("No event thrown"); return; }
          statusOutput.innerText = "The smartphone components manufactured with UPC as " + upc;
        });

        document.forms.manufactureComponents.reset();
      } catch (e) {
        statusOutput.innerText = "Something went wrong! or Excpected event not thrown" + e;
      }

    }
  }

  async function assembleSmartphone() {
    let currentAccount = web3.eth.accounts[0];
    let isAllowed = await coreInstance.isSmartphoneMaker(currentAccount);
    if (!isAllowed) {
      alert("This account is not authorized to perform this action");
      statusOutput.innerText = "You are not authorized to perform this action";
      return;
    }
    else {
      try {
        let formInputs = document.forms.assembleSmartphone.children;
        let upc = formInputs.upc.value;
        let price = web3.toWei(formInputs.price.value, "ether");
        if (!upc || !formInputs.price.value) { alert("Please fill all the details"); return; }
        if (+price <= 0) { alert("Price should be greater than 0"); return; }
        await coreInstance.assembleSmartphone(upc, price, { from: currentAccount });
        let event = coreInstance.SmartphoneAssembled();
        await event.watch((err, res) => {
          if (err) { throw new Error("No event thrown"); return; }
          statusOutput.innerText = "The smartphone has been assembled. The UPC is " + upc;
        });

        document.forms.assembleSmartphone.reset();
      } catch (e) {
        statusOutput.innerText = "Something went wrong! or Excpected event not thrown" + e;
      }

    }
  }

  async function buySmartphoneFromCompany() {
    let currentAccount = web3.eth.accounts[0];
    let isAllowed = await coreInstance.isRetailer(currentAccount);
    if (!isAllowed) {
      alert("This account is not authorized to perform this action");
      statusOutput.innerText = "You are not authorized to perform this action";
      return;
    }
    else {
      try {
        let formInputs = document.forms.buySmartphoneFromCompany.children;
        let upc = formInputs.upc.value;
        if (!upc) { alert("Please fill all the details"); return; }
        let value = await coreInstance.getItemPrice(upc);
        await coreInstance.retailerBuy(upc, { from: currentAccount, value: +value });
        let event = coreInstance.ShippedToRetailer();
        await event.watch((err, res) => {
          if (err) { throw new Error("No event thrown"); return; }
          statusOutput.innerText = "The smartphone is shipped to retailer. The UPC is " + upc;
        });

        document.forms.buySmartphoneFromCompany.reset();
      } catch (e) {
        alert("Make sure that the smartphone has been assembled");
        statusOutput.innerText = "Something went wrong! Make sure smartphone has been assembled" + e;
      }

    }
  }

  async function markReceivedByRetailer() {
    let currentAccount = web3.eth.accounts[0];
    let isAllowed = await coreInstance.isRetailer(currentAccount);
    if (!isAllowed) {
      alert("This account is not authorized to perform this action");
      statusOutput.innerText = "You are not authorized to perform this action";
      return;
    }
    else {
      try {
        let formInputs = document.forms.markReceivedByRetailer.children;
        let upc = formInputs.upc.value;
        if (!upc) { alert("Please fill all the details"); return; }
        await coreInstance.markReceivedByRetailer(upc, { from: currentAccount });
        let event = coreInstance.ReceivedByRetailer();
        await event.watch((err, res) => {
          if (err) { throw new Error("No event thrown"); return; }
          statusOutput.innerText = "The smartphone is received by the retailer. The UPC is " + upc;
        });

        document.forms.markReceivedByRetailer.reset();
      } catch (e) {
        alert("Make sure that the smartphone has been assembled");
        statusOutput.innerText = "Something went wrong!" + e;
      }

    }
  }

  async function putForSale() {
    let currentAccount = web3.eth.accounts[0];
    let isAllowed = await coreInstance.isRetailer(currentAccount);
    if (!isAllowed) {
      alert("This account is not authorized to perform this action");
      statusOutput.innerText = "You are not authorized to perform this action";
      return;
    }
    else {
      try {
        let formInputs = document.forms.putForSale.children;
        let upc = formInputs.upc.value;
        let price = web3.toWei(formInputs.price.value, "ether");
        if (!upc || !formInputs.price.value) { alert("Please fill all the details"); return; }
        if (+price <= 0) { alert("Price should be greater than 0"); return; }
        await coreInstance.putForSale(upc, price, { from: currentAccount });
        let event = coreInstance.OnSale();
        await event.watch((err, res) => {
          if (err) { throw new Error("No event thrown"); return; }
          statusOutput.innerText = "The smartphone is now on sale for consumers. The UPC is " + upc;
        });

        document.forms.putForSale.reset();
      } catch (e) {
        statusOutput.innerText = "Make sure you mark the smartphone as received before putting it for sale.";
      }

    }
  }

  let event = coreInstance.OnSale({}, { formBlock: 0, toBlock: 'latest' });
  event.watch(async function (error, result) {
    if (result) {
      await setItemsOnSale();
    }
  });
  window.smartPhonesOnSale = [];

  async function getSmartphonesOnSale() {
    return new Promise(async (resolve, reject) => {
      event.get(async (err, result) => {
        if (err) reject(err);
        else {
          let filteredUPC = [];
          for (let i = 0; i < result.length; i++) {
            let upc = +result[i].args.upc;
            let isOnSale = await coreInstance.isItemOnSale(upc);
            console.log(isOnSale);
            if (isOnSale)
              filteredUPC.push(upc);
          }
          resolve(filteredUPC);
        }
      });
    });
  }

  async function buySmartphone(upc, ethers) {
    try {
      await coreInstance.consumerBuy(upc, { from: web3.eth.accounts[0], value: web3.toWei(ethers, "ether") });
      statusOutput.innerText = "Smartphone is now owned by " + web3.eth.accounts[0];
      await setItemsOnSale();
    } catch (e) {
      statusOutput.innerText = "Something went wrong";
    }
  }
  window.buySmartphone = buySmartphone;
  async function setItemsOnSale() {
    window.smartPhonesOnSale = await getSmartphonesOnSale();

    let listString = "";
    let finalOutput = "";
    if (window.smartPhonesOnSale.length < 1) {
      finalOutput = "No smartphones at this moment";
    } else {
      for (let i = 0; i < window.smartPhonesOnSale.length; i++) {
        let upc = window.smartPhonesOnSale[i];
        let itemInfo = await coreInstance.getItemInfo(upc);
        let price = web3.fromWei(+itemInfo[6]);
        listString +=
          `
            <tr><td>#${upc}</td> <td>${itemInfo[5]}</td> <td>${price} ether</td>
            <td><button type="button" onclick="buySmartphone(${upc}, ${price})">Buy</button>
            </tr>
      `
      };
      finalOutput = `
          <table>
          <thead>
            <tr>
              <th>UPC</th>
              <th>Description</th>
              <th>Price (ethers)</th>
              <th>Buy</th>
            </tr>
          </thead>
          <tbody class="smartphones-on-sale">
            ${listString}
          </tbody>
        </table>
    `
    }
    smartphonesOnSaleList.innerHTML = finalOutput;

  }
  setItemsOnSale();

  async function getProductDetails() {
    let upc = document.forms.viewProductDetails.children.upc.value;
    let itemInfo = await coreInstance.getItemInfo(upc);
    let outputString = `
      <p><span>SKU </span> <strong>${itemInfo[0]}</strong> </p>
      <p><span>UPC </span> <strong>${itemInfo[1]}</strong> </p>
      <p><span>Current Owner </span> <strong>${itemInfo[2]}</strong> </p>
      <p><span>Origin ID </span> <strong>${itemInfo[3]}</strong> </p>
      <p><span>Product ID </span> <strong>${itemInfo[4]}</strong> </p>
      <p><span>Description </span> <strong>${itemInfo[5]}</strong> </p>
      <p><span>Price </span> <strong>${web3.fromWei(itemInfo[6])} ethers</strong> </p>
      <p><span>Smartphone Maker ID </span> <strong>${itemInfo[8]}</strong> </p>
      <p><span>Retailer ID </span> <strong>${itemInfo[9]}</strong> </p>
      <p><span>Consumer ID </span> <strong>${itemInfo[10]}</strong> </p>
    `;
    productDetailsOutput.innerHTML = outputString;

  }

  async function traceProduct() {
    let upc = document.forms.traceProduct.children.upc.value;
    let itemInfo = await coreInstance.getItemInfo(upc);
    let outputString = "";
    if (itemInfo[1] == 0) {
      outputString = "The given product doesn't exists or not traceable.";
    } else {
      let manufacturerID = itemInfo[3];
      let smartphoneMakerID = itemInfo[8];
      let retailerID = itemInfo[9];

      let isManufacturer = await coreInstance.isRetailer(manufacturerID);
      let isSmartphoneMaker = await coreInstance.isSmartphoneMaker(smartphoneMakerID);
      let isRetailer = await coreInstance.isRetailer(retailerID);


      if (isManufacturer && isSmartphoneMaker && isRetailer) {
        outputString = "The is an authentic product and is traceable to its origin. All the actors invovled in this product supplychian are authorized members";
      }
    }
    productTracesOutput.innerText = outputString;
  }

  document.forms.manufactureComponents.children.submit.onclick = manufactureComponents;
  document.forms.assembleSmartphone.children.submit.onclick = assembleSmartphone;
  document.forms.buySmartphoneFromCompany.children.submit.onclick = buySmartphoneFromCompany;
  document.forms.markReceivedByRetailer.children.submit.onclick = markReceivedByRetailer;
  document.forms.putForSale.children.submit.onclick = putForSale;
  document.forms.viewProductDetails.children.submit.onclick = getProductDetails;
  document.forms.traceProduct.children.submit.onclick = traceProduct;

});