require("dotenv").config();

const env = require("hardhat");
const {
  getRole,
  verify,
  ex,
  printAddress,
  deploySC,
  deploySCNoUp,
} = require("../utils");

var MINTER_ROLE = getRole("MINTER_ROLE");
var BURNER_ROLE = getRole("BURNER_ROLE");

async function deployMumbai() {
  var relayerAddress = "0xB1F6d2B76AF9A8392205f1d1cE1E418ac3843533";
  var name = "Mi Primer NFT";
  var symbol = "MPRNFT";
  var nftContract = await deploySC("MiPrimerNft", [name, symbol]);
  var implementation = await printAddress("NFT", nftContract.address);

  // set up
  console.log("Setup: grantROLE:");
  await ex(nftContract, "grantRole", [MINTER_ROLE,relayerAddress], "GR");
console.log("Verificacion: ");
  await verify(implementation, "MiPrimerNft", []);
}

async function deployGoerli() {
  // gnosis safe
  // Crear un gnosis safe en https://gnosis-safe.io/app/
  // Extraer el address del gnosis safe y pasarlo al contrato con un setter
  var gnosis = { address: "" };
}

deployMumbai()
//deployGoerli()
  //
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// npx hardhat --network mumbai run scripts/deployMiPrimerNFT.js
