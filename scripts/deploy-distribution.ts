import { ethers } from "hardhat";
import { Logger } from "../src/utils/logger";

async function main() {
  try {
    Logger.info('Starting deployment of CharityScheduledDistribution to Moonbase Alpha...');

    // Deploy CharityScheduledDistribution contract
    Logger.info('Deploying CharityScheduledDistribution...');
    const CharityScheduledDistribution = await ethers.getContractFactory("CharityScheduledDistribution");
    const distribution = await CharityScheduledDistribution.deploy();
    await distribution.waitForDeployment();
    const distributionAddress = await distribution.getAddress();
    Logger.info('CharityScheduledDistribution deployed', { address: distributionAddress });

    // Deploy DistributionExecutor contract
    Logger.info('Deploying DistributionExecutor...');
    const DistributionExecutor = await ethers.getContractFactory("DistributionExecutor");
    const executor = await DistributionExecutor.deploy(distributionAddress);
    await executor.waitForDeployment();
    const executorAddress = await executor.getAddress();
    Logger.info('DistributionExecutor deployed', { address: executorAddress });

    // Log deployment info
    Logger.info('Deployment completed successfully', {
      network: 'Moonbase Alpha',
      distributionAddress,
      executorAddress,
      timestamp: new Date().toISOString()
    });

    // Write deployment addresses to a file
    const fs = require('fs');
    const deploymentInfo = {
      network: 'moonbase',
      distributionAddress,
      executorAddress,
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
        scheduledDistribution: deploymentInfo
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