import { ethers } from "hardhat";
import { Logger } from "../src/utils/logger";
import * as fs from "fs";

async function main() {
  try {
    Logger.info('Starting deployment of VolunteerVerification to Moonbase Alpha...');

    // Deploy VolunteerVerification contract
    Logger.info('Deploying VolunteerVerification...');
    const VolunteerVerification = await ethers.getContractFactory("VolunteerVerification");
    const verification = await VolunteerVerification.deploy();
    await verification.waitForDeployment();
    const verificationAddress = await verification.getAddress();
    Logger.info('VolunteerVerification deployed', { address: verificationAddress });

    // Log deployment info
    Logger.info('Deployment completed successfully', {
      network: 'Moonbase Alpha',
      verificationAddress,
      timestamp: new Date().toISOString()
    });

    // Write deployment addresses to a file
    const deploymentInfo = {
      network: 'moonbase',
      verificationAddress,
      timestamp: new Date().toISOString()
    };

    // Append to existing deployments.json if it exists, otherwise create new file
    let existingDeployments = {};
    try {
      existingDeployments = JSON.parse(fs.readFileSync('deployments.json', 'utf8'));
    } catch (err) {
      // File doesn't exist or is invalid JSON, start with empty object
    }

    fs.writeFileSync(
      'deployments.json',
      JSON.stringify({
        ...existingDeployments,
        volunteerVerification: deploymentInfo
      }, null, 2)
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