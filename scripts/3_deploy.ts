import { ethers, upgrades } from "hardhat";

async function main() {
  const ListingV3 = await ethers.getContractFactory("ListingV3");

  const listing = await upgrades.deployProxy(ListingV3);

  await listing.deployed();

  console.log(`Listing deployed to ${listing.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
