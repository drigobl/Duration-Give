import { ethers } from "hardhat";
import { Logger } from "../src/utils/logger";

async function main() {
  try {
    Logger.info('Starting deployment to Moonbase Alpha...');

    // Deploy DurationDonation contract
    Logger.info('Deploying DurationDonation...');
    const DurationDonation = await ethers.getContractFactory("DurationDonation");
    const donation = await DurationDonation.deploy();
    await donation.waitForDeployment();
    const donationAddress = await donation.getAddress();
    Logger.info('DurationDonation deployed', { address: donationAddress });

    // Log deployment info
    Logger.info('Deployment completed successfully', {
      network: 'Moonbase Alpha',
      donationAddress,
      timestamp: new Date().toISOString()
    });

    // Write deployment addresses to a file
    const fs = require('fs');
    const deploymentInfo = {
      network: 'moonbase',
      donationAddress,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      'deployments.json',
      JSON.stringify(deploymentInfo, null, 2)
    );

  } catch (error) {
    Logger.error('Deployment failed', { error });
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    Logger.error('Deployment script failed', { error });
    process.exit(1);
  });