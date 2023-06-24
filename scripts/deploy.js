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

  const relayerAddress = "0x1B54CA30933Fab803541803842DC52Cf6A9Fc831"; //MODIFICAR POR EL ADDRES DEL RELAYER DEFENDER

  const name = "Mi Primer NFT";
  const symbol = "MPRNFT";
  const nftContract = await deploySC("MiPrimerNft", [name, symbol]);
  const implementation = await printAddress("NFT", nftContract.address);

  // set up
  console.log("Setup NFT Mumbai : grantROLE:");
  await ex(nftContract, "grantRole", [MINTER_ROLE, relayerAddress], "GR");

  console.log("Verificacion: ");
  await verify(implementation, "MiPrimerNft", []);
}

async function deployUSDC() {
  let usdcContract = await deploySCNoUp("USDCoin", []);
  console.log("Verificacion USDCoin: ");
  await verify(usdcContract.address, "USDCoin", []);
  return usdcContract.address;
}
async function deployMPTKN() {

  let tokenMPTK = await deploySC("MiPrimerToken", []);
  let implementation = await printAddress("MPTKN Token ERC20 :", tokenMPTK.address);
  console.log("Verificacion MPTKN: ");
  await verify(implementation, "MiPrimerToken", []);
  
  return tokenMPTK.address;
}

async function deployPublicSale(tokenAddress) {
  // Extraer el address del gnosis safe y pasarlo al contrato con un setter
  const gnosis = { address: "0xc03C3c0C622B7324D4a648F9eF02ceAf33862743" };
  let publicSaleContract = await deploySC("PublicSale", []);
  let implementation = await printAddress("Token PublicSale :", publicSaleContract.address);

  console.log("SET UP Public Sale: ...");
  await ex(publicSaleContract, "setTokenAddress", [tokenAddress]);
  await ex(publicSaleContract, "setGnosisSafeWallet", [gnosis.address]);

  console.log("Verificacion: ...");
  await verify(implementation, "PublicSale");
}
async function deployGoerli() {

  let tokenMPTKAddress = await deployMPTKN();
  await deployPublicSale(tokenMPTKAddress);
  await deployUSDC();

}

deployMumbai()
//deployGoerli()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// npx hardhat --network mumbai run scripts/deploy.js
// npx hardhat --network goerli run scripts/deploy.js
