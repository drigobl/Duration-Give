// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VolunteerVerification
 * @dev A contract for verifying volunteer applications and hours on the blockchain
 */
contract VolunteerVerification is Ownable, ReentrancyGuard, Pausable {

    // Structs
    struct Charity {
        bool isRegistered;
        address payable walletAddress;
        bool isActive;
    }

    struct VolunteerApplication {
        bytes32 applicationHash;
        address applicant;
        address charity;
        uint256 timestamp;
        bool isVerified;
    }

    struct VolunteerHours {
        bytes32 timeWorkedHash;
        address volunteer;
        address charity;
        uint256 totalHours;
        uint256 timestamp;
        bool isVerified;
    }

    // Mappings
    mapping(address => Charity) public charities;
    mapping(bytes32 => VolunteerApplication) public applications;
    mapping(bytes32 => VolunteerHours) public volunteerHours;
    
    // Events
    event CharityRegistered(address indexed charity, uint256 timestamp);
    event CharityStatusUpdated(address indexed charity, bool isActive);
    event ApplicationVerified(
        bytes32 indexed applicationHash,
        address indexed applicant,
        address indexed charity,
        uint256 timestamp
    );
    event TimeWorkedVerified(
        bytes32 indexed timeWorkedHash,
        address indexed volunteer,
        address indexed charity,
        uint256 totalHours,
        uint256 timestamp
    );
    
    // Errors
    error CharityNotRegistered(address charity);
    error CharityNotActive(address charity);
    error HashAlreadyVerified(bytes32 hash);
    error InvalidHash();
    error Unauthorized(address sender);

    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new charity
     * @param _charityAddress The address of the charity to register
     */
    function registerCharity(address payable _charityAddress) external onlyOwner {
        require(_charityAddress != address(0), "Invalid charity address");
        require(!charities[_charityAddress].isRegistered, "Charity already registered");
        
        charities[_charityAddress] = Charity({
            isRegistered: true,
            walletAddress: _charityAddress,
            isActive: true
        });
        
        emit CharityRegistered(_charityAddress, block.timestamp);
    }

    /**
     * @dev Update charity active status
     * @param _charityAddress The address of the charity
     * @param _isActive New active status
     */
    function updateCharityStatus(address _charityAddress, bool _isActive) external onlyOwner {
        if (!charities[_charityAddress].isRegistered) {
            revert CharityNotRegistered(_charityAddress);
        }
        
        charities[_charityAddress].isActive = _isActive;
        emit CharityStatusUpdated(_charityAddress, _isActive);
    }
    
    /**
     * @dev Verify a volunteer application
     * @param _applicationHash The hash of the application to verify
     * @param _applicant The address of the applicant
     */
    function verifyApplication(bytes32 _applicationHash, address _applicant) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_applicant != address(0), "Invalid applicant address");
        
        if (!charities[msg.sender].isRegistered) {
            revert CharityNotRegistered(msg.sender);
        }
        
        if (!charities[msg.sender].isActive) {
            revert CharityNotActive(msg.sender);
        }
        
        if (_applicationHash == bytes32(0)) {
            revert InvalidHash();
        }
        
        if (applications[_applicationHash].isVerified) {
            revert HashAlreadyVerified(_applicationHash);
        }
        
        applications[_applicationHash] = VolunteerApplication({
            applicationHash: _applicationHash,
            applicant: _applicant,
            charity: msg.sender,
            timestamp: block.timestamp,
            isVerified: true
        });
        
        emit ApplicationVerified(_applicationHash, _applicant, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify volunteer timeWorked
     * @param _timeWorkedHash The hash of the timeWorked record
     * @param _volunteer The address of the volunteer
     * @param _timeWorked The amount of time worked
     */
    function verifyTimeWorked(bytes32 _timeWorkedHash, address _volunteer, uint256 _timeWorked) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_volunteer != address(0), "Invalid volunteer address");
        
        if (!charities[msg.sender].isRegistered) {
            revert CharityNotRegistered(msg.sender);
        }
        
        if (!charities[msg.sender].isActive) {
            revert CharityNotActive(msg.sender);
        }
        
        if (_timeWorkedHash == bytes32(0)) {
            revert InvalidHash();
        }
        
        if (volunteerHours[_timeWorkedHash].isVerified) {
            revert HashAlreadyVerified(_timeWorkedHash);
        }
        
        volunteerHours[_timeWorkedHash] = VolunteerHours({
            timeWorkedHash: _timeWorkedHash,
            volunteer: _volunteer,
            charity: msg.sender,
            totalHours: _timeWorked,
            timestamp: block.timestamp,
            isVerified: true
        });
        
        emit TimeWorkedVerified(_timeWorkedHash, _volunteer, msg.sender, _timeWorked, block.timestamp);
    }
    
    /**
     * @dev Check if an application hash is verified
     * @param _applicationHash The hash to check
     * @return isVerified Whether the application is verified
     * @return applicant The applicant address
     * @return charity The charity address
     * @return timestamp When it was verified
     */
    function checkApplicationVerification(bytes32 _applicationHash) 
        external 
        view 
        returns (bool isVerified, address applicant, address charity, uint256 timestamp) 
    {
        VolunteerApplication memory app = applications[_applicationHash];
        return (app.isVerified, app.applicant, app.charity, app.timestamp);
    }
    
    /**
     * @dev Check if timeWorked hash is verified
     * @param _timeWorkedHash The hash to check
     * @return isVerified Whether the hours are verified
     * @return volunteer The volunteer address
     * @return charity The charity address
     * @return totaltimeWorked The hours worked
     * @return timestamp When it was verified
     */
    function checkTimeWorkedVerification(bytes32 _timeWorkedHash) 
        external 
        view 
        returns (bool isVerified, address volunteer, address charity, uint256 totaltimeWorked, uint256 timestamp) 
    {
        VolunteerHours memory record = volunteerHours[_timeWorkedHash];
        return (record.isVerified, record.volunteer, record.charity, record.totalHours, record.timestamp);
    }

    /**
     * @dev Pause the contract
     * Only owner can call this function
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     * Only owner can call this function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}