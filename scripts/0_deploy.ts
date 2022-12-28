import { ethers, upgrades } from "hardhat";

async function main() {
  const Listing = await ethers.getContractFactory("Listing");

  const listing = await upgrades.deployProxy(Listing);

  await listing.deployed();

  console.log(`Listing deployed to ${listing.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
