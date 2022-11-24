import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const PROXY = process.env.PROXY!;

async function main() {
  const Listing = await ethers.getContractFactory("Listing");

  const listing = await upgrades.upgradeProxy(PROXY, Listing);
  await listing.deployed();

  console.log(`Listing upgraded, impl: ${listing.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
