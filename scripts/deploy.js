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

const MINTER_ROLE = getRole("MINTER_ROLE");
const BURNER_ROLE = getRole("BURNER_ROLE");

async function deployMumbai() {
  const relayerAddress = "0xB1F6d2B76AF9A8392205f1d1cE1E418ac3843533";
  const name = "Mi Primer NFT";
  const symbol = "MPRNFT";
  const nftContract = await deploySC("MiPrimerNft", [name, symbol]);
  const implementation = await printAddress("NFT", nftContract.address);

  // set up
  console.log("Setup: grantROLE:");
  await ex(nftContract, "grantRole", [MINTER_ROLE,relayerAddress], "GR");

  console.log("Verificacion: ");
  await verify(implementation, "MiPrimerNft", []);
}
async function deployMPTKN() {

  let tokenMPTK = await deploySC("MiPrimerToken", []);
  let implementation = await printAddress("Token ERC20 :", tokenMPTK.address);
  console.log("Verificacion: ");
  await verify(implementation, "MiPrimerToken", []);
}

async function deployPublicSale() {
  const MiPrimerToken = {address: "0x28d23B475250D07e1958E64d1faF02EdE0846F12 "};
  const gnosis = { address: "0xc03C3c0C622B7324D4a648F9eF02ceAf33862743" };
  let publicSaleContract = await deploySC("PublicSale", []);
  let implementation = await printAddress("Token PublicSale :", publicSaleContract.address);

  console.log("SET UP: ...");
  await ex(publicSaleContract,"setTokenAddress",[MiPrimerToken.address]);
  await ex(publicSaleContract,"setGnosisSafeWallet",[gnosis.address]);

  console.log("Verificacion: ...");
  await verify(implementation, "PublicSale");
}
async function deployGoerli() {
  // gnosis safe
  // Crear un gnosis safe en https://gnosis-safe.io/app/
  // Extraer el address del gnosis safe y pasarlo al contrato con un setter
  let gnosis = { address: "0xc03C3c0C622B7324D4a648F9eF02ceAf33862743" };
}

//deployMumbai()
//deployMPTKN()
deployPublicSale()
//deployGoerli()
  //
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// npx hardhat --network mumbai run scripts/deploy.js
