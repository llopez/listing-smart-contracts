import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const PROXY = process.env.PROXY!;

async function main() {
  const ListingV2 = await ethers.getContractFactory("ListingV2");

  const listingV2 = await upgrades.upgradeProxy(PROXY, ListingV2);
  await listingV2.deployed();

  console.log(`Listing upgraded, impl: ${listingV2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
