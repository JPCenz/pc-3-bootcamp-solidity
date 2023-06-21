import { BigNumber, Contract, providers, ethers, utils } from "ethers";
import tokens from "./tokens.json";
// import usdcTknAbi ...
// import miPrimerTknAbi ...
// import publicSaleAbi ...
// import nftTknAbi ...
const nftTknAbi = require("../artifacts/contracts/NFT.sol/MiPrimerNft.json").abi;
const publicSaleAbi = require("../artifacts/contracts/PublicSale.sol/PublicSale.json").abi;
const usdcTknAbi = require("../artifacts/contracts/USDCoin.sol/USDCoin.json").abi;
const miPrimerTknAbi = require("../artifacts/contracts/MiPrimerToken.sol/MiPrimerToken.json").abi;

window.ethers = ethers;


let provider, signer, account;
let usdcTkContract, miPrTokenContract, nftTknContract, pubSContract;

// REQUIRED
// Conectar con metamask
function initSCsGoerli() {
  provider = new providers.Web3Provider(window.ethereum);

  const usdcAddress = tokens.usdc;
  const miPrTknAdd = tokens.miPrTkn;
  const pubSContractAdd = tokens.publicSale;

  // Usando Ethers
  // Contract = address + abi + provider

  usdcTkContract = new Contract(usdcAddress, usdcTknAbi, provider);
  miPrTokenContract = new Contract(miPrTknAdd, miPrimerTknAbi, provider);
  pubSContract = new Contract(pubSContractAdd, publicSaleAbi, provider);
}

// OPTIONAL
// No require conexion con Metamask
// Usar JSON-RPC
// Se pueden escuchar eventos de los contratos usando el provider con RPC
function initSCsMumbai() {
  var nftAddress;
  nftTknContract; // = new Contract...
}

function setUpListeners() {
  // Connect to Metamask
  const usdcUpdatebtn = document.getElementById("usdcUpdate");
  const usdcBalance = document.getElementById("usdcBalance")

  const miPrimerTknUpdatebtn = document.getElementById("miPrimerTknUpdate");
  const miPrimerTknBalance = document.getElementById("miPrimerTknBalance");

  const approveButton = document.getElementById("approveButton");
  const approveInput = document.getElementById("approveInput");
  const approveError = document.getElementById("approveError");

  const purchaseButton = document.getElementById("purchaseButton");
  const purchaseError = document.getElementById("purchaseError");
  const purchaseInput = document.getElementById("purchaseInput");

  const purchaseEthButton = document.getElementById("purchaseEthButton");
  const purchaseEthError = document.getElementById("purchaseEthError");

  const sendEtherButton = document.getElementById("sendEtherButton");
  const sendEtherInput = document.getElementById("sendEtherInput");
  const sendEtherError = document.getElementById("sendEtherError");

  usdcUpdatebtn.addEventListener("click", async () => {
    try {

      const response = await usdcTkContract
        .balanceOf(account)
      console.log(response)
      usdcBalance.innerHTML = response ?? "No tiene Balancee"
    } catch (error) {
      console.log(error);
    }
  })

  miPrimerTknUpdatebtn.addEventListener("click", async () => {
    try {
      const res = await miPrTokenContract
        .balanceOf(account)

      miPrimerTknBalance.innerHTML = res ?? "No tiene Balance"

    } catch (error) {

      console.log(error);
    }
  })

  approveButton.addEventListener("click", async () => {
    try {
      console.log(approveInput.value)

      const amount = parseInt(approveInput.value, 10);
      console.log(amount)
      const tx = await miPrTokenContract
        .connect(signer)
        .approve(tokens.publicSale, BigNumber.from(amount).mul(BigNumber.from(10).pow(18)));

      const response = await tx.wait()
      console.log(response.transactionHash)
      alert("Successully Approval", response.transactionHash)

    } catch (error) {

      approveError.innerHTML = error.reason;
      console.log(error);
    }
  })


  purchaseButton.addEventListener("click", async () => {
    try {
      const id = purchaseInput.value;
      if (isNaN(id)) {
        purchaseError.innerHTML = 'Invalid input: not a number';
        console.error('Invalid input: not a number');
      } else {

        console.log(id)
        const tx = await pubSContract
          .connect(signer)
          .purchaseNftById(id);

        const response = await tx.wait()
        console.log(response.transactionHash)
        alert(`Successully Purchase NFT : ${id} txHASH: ${response.transactionHash}`);
      }

    } catch (error) {
      purchaseError.innerHTML = error.reason;
      console.log(error);
    }
  })

  purchaseEthButton.addEventListener("click", async () => {
    try {
      let op = {
        // Opciones de la transacción
        value: ethers.utils.parseEther('0.01'), // Enviar 1 ETH
      };
      const tx = await pubSContract
        .connect(signer)
        .depositEthForARandomNft(op);

      const response = await tx.wait()
      console.log(response.transactionHash)
      alert(`Successully Purchase Random NFT :  txHASH: ${response.transactionHash}`,)

    } catch (error) {
      purchaseEthError.innerHTML = error.reason;
      console.log(error);
    }
  })

  sendEtherButton.addEventListener("click", async () => {
    try {
      let op = {
        // Opciones de la transacción
        to:tokens.publicSale,
        value: ethers.utils.parseEther('0.01'), // Enviar 1 ETH
      };
      const tx = await signer.sendTransaction(op)

      const response = await tx.wait()
      console.log(response.transactionHash)
      alert(`Successully Purchase Random NFT :  txHASH: ${response.transactionHash}`,)

    } catch (error) {
      sendEtherError.innerHTML = error.reason;
      console.log(error);
    }

  })


}



function setUpEventsContracts() {

  // nftTknContract.on
}

async function setUp() {
  initSCsGoerli();
  initSCsMumbai();
  await setUpListeners();
  setUpEventsContracts();
  setUpMetamask();
}

function setUpMetamask() {
  let bttn = document.getElementById("connect");
  bttn.addEventListener("click", async function () {
    try {
      if (window.ethereum) {
        [account] = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Billetera metamask", account);

        provider = new providers.Web3Provider(window.ethereum);
        signer = provider.getSigner(account);
        window.signer = signer;
      }

    } catch (error) {
      console.error(error.message)
    }

  });
}

setUp()
  .then()
  .catch((e) => console.log(e));
