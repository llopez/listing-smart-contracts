import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const PROXY = process.env.PROXY!;

async function main() {
  const ListingV3 = await ethers.getContractFactory("ListingV3");

  const listingV3 = await upgrades.upgradeProxy(PROXY, ListingV3);
  await listingV3.deployed();

  console.log(`Listing upgraded, impl: ${listingV3.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
