-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2026 at 09:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hero-logistic`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_activity_log`
--

CREATE TABLE `ai_activity_log` (
  `id` varchar(191) NOT NULL,
  `moduleId` varchar(191) NOT NULL,
  `companyId` varchar(191) DEFAULT NULL,
  `eventDescription` text NOT NULL,
  `isAnomaly` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_module`
--

CREATE TABLE `ai_module` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `isActiveGlobally` tinyint(1) NOT NULL DEFAULT 1,
  `confidenceThreshold` double DEFAULT NULL,
  `dailyApiLimit` int(11) DEFAULT NULL,
  `totalRequests` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_integration`
--

CREATE TABLE `api_integration` (
  `id` varchar(191) NOT NULL,
  `serviceName` varchar(191) NOT NULL,
  `status` enum('CONNECTED','VERIFIED','OPERATIONAL','ACTIVE','NOT_CONNECTED') NOT NULL DEFAULT 'NOT_CONNECTED',
  `health` enum('HEALTHY','WARNING','ERROR','UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
  `configId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_usage_log`
--

CREATE TABLE `api_usage_log` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `endpoint` varchar(191) NOT NULL,
  `method` varchar(191) NOT NULL,
  `statusCode` int(11) NOT NULL,
  `responseTimeMs` int(11) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` varchar(191) NOT NULL,
  `assetId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `make` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `serialNumber` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','MAINTENANCE','OUT_OF_SERVICE') NOT NULL DEFAULT 'ACTIVE',
  `condition` enum('NEW','GOOD','FAIR','POOR') NOT NULL DEFAULT 'GOOD',
  `operatingHours` double DEFAULT 0,
  `nextServiceDue` datetime(3) DEFAULT NULL,
  `purchaseDate` datetime(3) DEFAULT NULL,
  `purchasePrice` double DEFAULT NULL,
  `bookValue` double DEFAULT NULL,
  `supplier` varchar(191) DEFAULT NULL,
  `warrantyExpiry` datetime(3) DEFAULT NULL,
  `branchId` varchar(191) NOT NULL,
  `warehouseId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_assignment`
--

CREATE TABLE `asset_assignment` (
  `id` varchar(191) NOT NULL,
  `assetId` varchar(191) NOT NULL,
  `assignedTo` varchar(191) NOT NULL,
  `purpose` varchar(191) DEFAULT NULL,
  `expectedReturn` datetime(3) DEFAULT NULL,
  `assignedById` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Current',
  `startDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_maintenance`
--

CREATE TABLE `asset_maintenance` (
  `id` varchar(191) NOT NULL,
  `assetId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `priority` varchar(191) NOT NULL DEFAULT 'Medium',
  `description` varchar(191) NOT NULL,
  `intervalHours` int(11) DEFAULT NULL,
  `intervalDays` int(11) DEFAULT NULL,
  `lastPerformed` datetime(3) DEFAULT NULL,
  `nextDue` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Scheduled',
  `cost` double DEFAULT NULL,
  `downtimeHours` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_transfer`
--

CREATE TABLE `asset_transfer` (
  `id` varchar(191) NOT NULL,
  `transferNumber` varchar(191) NOT NULL,
  `status` enum('COMPLETED','IN_TRANSIT','PENDING_APPROVAL','REJECTED') NOT NULL DEFAULT 'PENDING_APPROVAL',
  `payloadName` varchar(191) NOT NULL,
  `senderCompanyId` varchar(191) NOT NULL,
  `receiverCompanyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` varchar(191) NOT NULL,
  `action` text NOT NULL,
  `operator` varchar(191) DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `billing_record`
--

CREATE TABLE `billing_record` (
  `id` varchar(191) NOT NULL,
  `invoiceNumber` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `status` enum('DRAFT','SENT','PAID','OVERDUE','UNPAID') NOT NULL DEFAULT 'DRAFT',
  `paymentMethod` varchar(191) DEFAULT NULL,
  `periodStart` datetime(3) DEFAULT NULL,
  `periodEnd` datetime(3) DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `planTierSnapshot` varchar(191) DEFAULT NULL,
  `dueDate` datetime(3) DEFAULT NULL,
  `taxAmount` double NOT NULL DEFAULT 0,
  `pdfUrl` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `location` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checklist_item_response`
--

CREATE TABLE `checklist_item_response` (
  `id` varchar(191) NOT NULL,
  `checklistId` varchar(191) NOT NULL,
  `itemNumber` int(11) NOT NULL,
  `itemLabel` varchar(191) NOT NULL,
  `status` enum('YES','NO','NA','NOT_CHECKED') NOT NULL DEFAULT 'NOT_CHECKED',
  `notes` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communication_template`
--

CREATE TABLE `communication_template` (
  `id` varchar(191) NOT NULL,
  `type` enum('WELCOME_EMAIL','RESET_PASSWORD','DRIVER_INVITE','COMPANY_INVITE') NOT NULL,
  `subject` varchar(191) NOT NULL,
  `greeting` varchar(191) NOT NULL,
  `bodyHtml` text NOT NULL,
  `configId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` varchar(191) NOT NULL,
  `tenantId` varchar(191) DEFAULT NULL,
  `isSandbox` tinyint(1) NOT NULL DEFAULT 0,
  `leadId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `status` enum('ACTIVE','HOLD','SUSPENDED','TRIAL') NOT NULL DEFAULT 'ACTIVE',
  `trialExpiry` datetime(3) DEFAULT NULL,
  `lastLogin` datetime(3) DEFAULT NULL,
  `accountManager` varchar(191) DEFAULT NULL,
  `storageUsedGB` double NOT NULL DEFAULT 0,
  `registrationNumber` varchar(191) DEFAULT NULL,
  `adminEmail` varchar(191) DEFAULT NULL,
  `cardBrand` varchar(191) DEFAULT NULL,
  `cardLast4` varchar(191) DEFAULT NULL,
  `cardExpiry` varchar(191) DEFAULT NULL,
  `defaultBusinessHours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`defaultBusinessHours`)),
  `nicheCarCarrying` tinyint(1) NOT NULL DEFAULT 0,
  `nicheGeneralFreight` tinyint(1) NOT NULL DEFAULT 1,
  `nicheHazmat` tinyint(1) NOT NULL DEFAULT 0,
  `defaultNiche` varchar(191) NOT NULL DEFAULT 'General Freight',
  `canSendTransfers` tinyint(1) NOT NULL DEFAULT 1,
  `canReceiveTransfers` tinyint(1) NOT NULL DEFAULT 1,
  `autoApproveTransfers` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_feature_override`
--

CREATE TABLE `company_feature_override` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `featureId` varchar(191) NOT NULL,
  `status` enum('FORCE_ENABLED','FORCE_DISABLED') NOT NULL,
  `reason` text NOT NULL,
  `operator` varchar(191) NOT NULL DEFAULT 'System Root',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_integration`
--

CREATE TABLE `company_integration` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `providerName` varchar(191) NOT NULL,
  `integrationType` enum('ELD','ACCOUNTING','CUSTOM') NOT NULL DEFAULT 'ELD',
  `status` enum('CONNECTED','VERIFIED','OPERATIONAL','ACTIVE','NOT_CONNECTED') NOT NULL DEFAULT 'NOT_CONNECTED',
  `apiKey` varchar(191) DEFAULT NULL,
  `lastSync` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `type` enum('DIRECT','GROUP','SYSTEM_ALERT') NOT NULL DEFAULT 'DIRECT',
  `title` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participant`
--

CREATE TABLE `conversation_participant` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `lastReadAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `abn` varchar(191) DEFAULT NULL,
  `type` enum('BUSINESS','CORPORATE','INDIVIDUAL') NOT NULL DEFAULT 'BUSINESS',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `contactName` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `billingTerms` varchar(191) DEFAULT NULL,
  `transportModules` varchar(191) DEFAULT NULL,
  `accountManagerId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_invoice`
--

CREATE TABLE `customer_invoice` (
  `id` varchar(191) NOT NULL,
  `invoiceNumber` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `loadId` varchar(191) DEFAULT NULL,
  `status` enum('DRAFT','SENT','PAID','OVERDUE') NOT NULL DEFAULT 'DRAFT',
  `dueDate` datetime(3) DEFAULT NULL,
  `pdfUrl` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_domain`
--

CREATE TABLE `custom_domain` (
  `id` varchar(191) NOT NULL,
  `domain` varchar(191) NOT NULL,
  `fallbackSubdomain` varchar(191) DEFAULT NULL,
  `routingRule` varchar(191) NOT NULL DEFAULT 'Force HTTPS',
  `sslStatus` enum('ACTIVE','PENDING','FAILED') NOT NULL DEFAULT 'PENDING',
  `sslExpiry` datetime(3) DEFAULT NULL,
  `dnsCheckPassed` tinyint(1) NOT NULL DEFAULT 0,
  `healthStatus` varchar(191) NOT NULL DEFAULT 'Unknown',
  `configId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_permission`
--

CREATE TABLE `custom_permission` (
  `id` varchar(191) NOT NULL,
  `roleId` varchar(191) NOT NULL,
  `module` varchar(191) NOT NULL,
  `actionString` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_role`
--

CREATE TABLE `custom_role` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_p_o_d`
--

CREATE TABLE `delivery_p_o_d` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `loadItemId` varchar(191) DEFAULT NULL,
  `stopIndex` int(11) DEFAULT NULL,
  `isAfterHours` tinyint(1) NOT NULL DEFAULT 0,
  `signatureUrl` varchar(191) DEFAULT NULL,
  `signeeName` varchar(191) DEFAULT NULL,
  `deliveryNotes` text DEFAULT NULL,
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `deliveredAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `demo_booking`
--

CREATE TABLE `demo_booking` (
  `id` varchar(191) NOT NULL,
  `leadId` varchar(191) NOT NULL,
  `presenterId` varchar(191) NOT NULL,
  `scheduledAt` datetime(3) NOT NULL,
  `status` enum('UPCOMING','COMPLETED','MISSED') NOT NULL DEFAULT 'UPCOMING',
  `meetingLink` varchar(191) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` varchar(191) NOT NULL,
  `fileUrl` varchar(191) NOT NULL,
  `expiryDate` datetime(3) DEFAULT NULL,
  `driverId` varchar(191) DEFAULT NULL,
  `vehicleId` varchar(191) DEFAULT NULL,
  `assetId` varchar(191) DEFAULT NULL,
  `loadId` varchar(191) DEFAULT NULL,
  `warehouseId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `type` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `id` varchar(191) NOT NULL,
  `driverCode` varchar(191) DEFAULT NULL,
  `firstName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `avatarUrl` varchar(191) DEFAULT NULL,
  `dob` datetime(3) DEFAULT NULL,
  `gender` varchar(191) DEFAULT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `emergencyContact` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `postalCode` varchar(191) DEFAULT NULL,
  `status` enum('ON_DUTY','OFF_DUTY','ON_LEAVE','UNAVAILABLE','AVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
  `employmentType` enum('FULL_TIME','PART_TIME','CASUAL','CONTRACTOR') NOT NULL DEFAULT 'FULL_TIME',
  `role` varchar(191) DEFAULT NULL,
  `category` varchar(191) DEFAULT NULL,
  `joiningDate` datetime(3) DEFAULT NULL,
  `shift` varchar(191) DEFAULT NULL,
  `branchId` varchar(191) DEFAULT NULL,
  `managerId` varchar(191) DEFAULT NULL,
  `licenseType` varchar(191) DEFAULT NULL,
  `licenseNumber` varchar(191) DEFAULT NULL,
  `licenseState` varchar(191) DEFAULT NULL,
  `licenseIssueDate` datetime(3) DEFAULT NULL,
  `licenseExpiry` datetime(3) DEFAULT NULL,
  `licenseClass` varchar(191) DEFAULT NULL,
  `licenseDocUrl` varchar(191) DEFAULT NULL,
  `complianceScore` double DEFAULT 100,
  `fatigueBreach` tinyint(1) NOT NULL DEFAULT 0,
  `riskLevel` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  `dgCertified` tinyint(1) NOT NULL DEFAULT 0,
  `hvCertified` tinyint(1) NOT NULL DEFAULT 0,
  `payType` varchar(191) DEFAULT NULL,
  `payRate` double DEFAULT NULL,
  `bankName` varchar(191) DEFAULT NULL,
  `accountNumber` varchar(191) DEFAULT NULL,
  `routingNumber` varchar(191) DEFAULT NULL,
  `taxNumber` varchar(191) DEFAULT NULL,
  `superFund` varchar(191) DEFAULT NULL,
  `availableFrom` datetime(3) DEFAULT NULL,
  `preferredVehicle` varchar(191) DEFAULT NULL,
  `preferredRoutes` varchar(191) DEFAULT NULL,
  `preferredRegions` varchar(191) DEFAULT NULL,
  `maxDistPerTripKm` int(11) DEFAULT NULL,
  `weeklyHoursLimit` int(11) DEFAULT NULL,
  `maxHoursPerDay` int(11) DEFAULT NULL,
  `restDaysPerWeek` int(11) DEFAULT NULL,
  `workingDays` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `internalComments` text DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_template`
--

CREATE TABLE `email_template` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `variables` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `equipment_swap`
--

CREATE TABLE `equipment_swap` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `prevTrailerId` varchar(191) DEFAULT NULL,
  `newTrailerId` varchar(191) DEFAULT NULL,
  `swapType` varchar(191) NOT NULL DEFAULT 'Trailer Swap',
  `reason` varchar(191) DEFAULT NULL,
  `approvalPolicy` varchar(191) NOT NULL DEFAULT 'DIRECT',
  `approvalStatus` varchar(191) NOT NULL DEFAULT 'Approved',
  `equipmentCheck` tinyint(1) NOT NULL DEFAULT 0,
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `locationName` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `swappedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature`
--

CREATE TABLE `feature` (
  `id` varchar(191) NOT NULL,
  `uniqueId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `version` varchar(191) NOT NULL DEFAULT '1.0.0',
  `category` varchar(191) NOT NULL,
  `licensingType` enum('CORE','PREMIUM','ENTERPRISE_ONLY','ADD_ON') NOT NULL DEFAULT 'CORE',
  `status` enum('ENABLED','DISABLED','DEPRECATED') NOT NULL DEFAULT 'ENABLED',
  `apiLoadEst` int(11) DEFAULT NULL,
  `storageEstGB` double DEFAULT NULL,
  `performanceFootprint` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_dependency`
--

CREATE TABLE `feature_dependency` (
  `id` varchar(191) NOT NULL,
  `featureId` varchar(191) NOT NULL,
  `dependencyId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_version_log`
--

CREATE TABLE `feature_version_log` (
  `id` varchar(191) NOT NULL,
  `featureId` varchar(191) NOT NULL,
  `version` varchar(191) NOT NULL,
  `changelog` text NOT NULL,
  `operator` varchar(191) NOT NULL DEFAULT 'System Root',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_task`
--

CREATE TABLE `follow_up_task` (
  `id` varchar(191) NOT NULL,
  `leadId` varchar(191) NOT NULL,
  `repId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` enum('PENDING','COMPLETED','MISSED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inbound_receipt`
--

CREATE TABLE `inbound_receipt` (
  `id` varchar(191) NOT NULL,
  `receiptNo` varchar(191) NOT NULL,
  `supplier` varchar(191) NOT NULL,
  `referenceNote` varchar(191) DEFAULT NULL,
  `transportType` varchar(191) DEFAULT NULL,
  `driverName` varchar(191) DEFAULT NULL,
  `vehicleRef` varchar(191) DEFAULT NULL,
  `inboundType` varchar(191) NOT NULL DEFAULT 'Purchase / Supplier Delivery',
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `stagingAreaId` varchar(191) DEFAULT NULL,
  `receivingDate` datetime(3) NOT NULL,
  `warehouseId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_movement`
--

CREATE TABLE `item_movement` (
  `id` varchar(191) NOT NULL,
  `itemId` varchar(191) NOT NULL,
  `type` enum('RECEIVE','MOVE','TRANSFER','STAGE','DISPATCH','RETURN') NOT NULL,
  `fromLocation` varchar(191) DEFAULT NULL,
  `toLocation` varchar(191) NOT NULL,
  `movementRef` varchar(191) DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `result` enum('COMPLETED','FAILED','IN_PROGRESS','CANCELLED') NOT NULL DEFAULT 'COMPLETED',
  `loadLaneId` varchar(191) DEFAULT NULL,
  `stagingAreaId` varchar(191) DEFAULT NULL,
  `loadId` varchar(191) DEFAULT NULL,
  `performedById` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Completed',
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead`
--

CREATE TABLE `lead` (
  `id` varchar(191) NOT NULL,
  `companyName` varchar(191) NOT NULL,
  `contactName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `fleetSize` varchar(191) DEFAULT NULL,
  `transportNiche` varchar(191) DEFAULT NULL,
  `currentSoftware` varchar(191) DEFAULT NULL,
  `estimatedValue` double DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `stage` enum('NEW_LEAD','CONTACTED','DEMO_BOOKED','DEMO_COMPLETED','TRIAL_STARTED','PROPOSAL_SENT','NEGOTIATING','WON','LOST') NOT NULL DEFAULT 'NEW_LEAD',
  `source` varchar(191) DEFAULT NULL,
  `painPoints` text DEFAULT NULL,
  `repId` varchar(191) DEFAULT NULL,
  `handoverTarget` datetime(3) DEFAULT NULL,
  `handoverPercent` int(11) DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `load`
--

CREATE TABLE `load` (
  `id` varchar(191) NOT NULL,
  `draftId` varchar(191) DEFAULT NULL,
  `loadRef` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `status` enum('DRAFT','PLANNED','ASSIGNED','IN_TRANSIT','DELIVERED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `priority` enum('LOW','NORMAL','HIGH','URGENT') NOT NULL DEFAULT 'NORMAL',
  `loadDate` datetime(3) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `dispatchNotes` text DEFAULT NULL,
  `deliveryEta` datetime(3) DEFAULT NULL,
  `pickupStopId` varchar(191) DEFAULT NULL,
  `sourceType` varchar(191) NOT NULL DEFAULT 'MANUAL',
  `aiExtracted` tinyint(1) NOT NULL DEFAULT 0,
  `aiConfidence` double DEFAULT NULL,
  `customerId` varchar(191) DEFAULT NULL,
  `driverId` varchar(191) DEFAULT NULL,
  `truckId` varchar(191) DEFAULT NULL,
  `trailerId` varchar(191) DEFAULT NULL,
  `loadLaneId` varchar(191) DEFAULT NULL,
  `stagingAreaId` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `load_activity`
--

CREATE TABLE `load_activity` (
  `id` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `load_expense`
--

CREATE TABLE `load_expense` (
  `id` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `type` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `vendorName` varchar(191) DEFAULT NULL,
  `litres` double DEFAULT NULL,
  `pricePerLitre` double DEFAULT NULL,
  `odometer` int(11) DEFAULT NULL,
  `receiptUrl` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `load_item`
--

CREATE TABLE `load_item` (
  `id` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `customerId` varchar(191) DEFAULT NULL,
  `pickupStopId` varchar(191) NOT NULL,
  `dropoffStopId` varchar(191) NOT NULL,
  `rego` varchar(191) DEFAULT NULL,
  `vin` varchar(191) DEFAULT NULL,
  `stockRef` varchar(191) DEFAULT NULL,
  `make` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `lengthMm` int(11) DEFAULT NULL,
  `widthMm` int(11) DEFAULT NULL,
  `heightMm` int(11) DEFAULT NULL,
  `weightKg` int(11) DEFAULT NULL,
  `vehicleType` varchar(191) DEFAULT NULL,
  `keys` tinyint(1) NOT NULL DEFAULT 1,
  `damageReportReq` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `aiConfidence` double DEFAULT NULL,
  `warehouseId` varchar(191) DEFAULT NULL,
  `zone` varchar(191) DEFAULT NULL,
  `row` varchar(191) DEFAULT NULL,
  `bay` varchar(191) DEFAULT NULL,
  `position` varchar(191) DEFAULT NULL,
  `stockStatus` enum('IN_STORAGE','STAGED','TO_MOVE','DISPATCHED') NOT NULL DEFAULT 'IN_STORAGE',
  `receivedDate` datetime(3) DEFAULT NULL,
  `inboundReceiptId` varchar(191) DEFAULT NULL,
  `loadLaneId` varchar(191) DEFAULT NULL,
  `stagingAreaId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `load_lane`
--

CREATE TABLE `load_lane` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `warehouseId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `loadId` varchar(191) DEFAULT NULL,
  `attachmentUrl` varchar(191) DEFAULT NULL,
  `isSystem` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `module_usage_log`
--

CREATE TABLE `module_usage_log` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `featureId` varchar(191) NOT NULL,
  `accessCount` int(11) NOT NULL DEFAULT 0,
  `lastAccessed` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `networked_printer`
--

CREATE TABLE `networked_printer` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `ipAddress` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ONLINE',
  `warehouseId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offline_sync_item`
--

CREATE TABLE `offline_sync_item` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `type` enum('PRE_START','PHOTO','POD_SIGNATURE','FUEL','TRAILER_SWAP','DAMAGE_REPORT','CHECKLIST') NOT NULL,
  `status` enum('PENDING','UPLOADING','SYNCED','FAILED','QUEUED') NOT NULL DEFAULT 'PENDING',
  `referenceId` varchar(191) DEFAULT NULL,
  `refCode` varchar(191) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `fileSizeKb` int(11) DEFAULT NULL,
  `uploadProgress` int(11) NOT NULL DEFAULT 0,
  `errorMessage` text DEFAULT NULL,
  `retryCount` int(11) NOT NULL DEFAULT 0,
  `capturedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `syncedAt` datetime(3) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_attempt`
--

CREATE TABLE `payment_attempt` (
  `id` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `status` enum('PAID','PENDING','FAILED') NOT NULL DEFAULT 'PENDING',
  `gatewayResponse` text DEFAULT NULL,
  `transactionId` varchar(191) DEFAULT NULL,
  `billingRecordId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay_period`
--

CREATE TABLE `pay_period` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `periodStart` date NOT NULL,
  `periodEnd` date NOT NULL,
  `payDate` date DEFAULT NULL,
  `status` enum('DRAFT','PROCESSING','PAID','PENDING','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `basePay` double NOT NULL DEFAULT 0,
  `loadAllowance` double NOT NULL DEFAULT 0,
  `distanceAllow` double NOT NULL DEFAULT 0,
  `otherAllowance` double NOT NULL DEFAULT 0,
  `bonuses` double NOT NULL DEFAULT 0,
  `grossEarnings` double NOT NULL DEFAULT 0,
  `paygTax` double NOT NULL DEFAULT 0,
  `superAmount` double NOT NULL DEFAULT 0,
  `unionFees` double NOT NULL DEFAULT 0,
  `otherDeductions` double NOT NULL DEFAULT 0,
  `totalDeductions` double NOT NULL DEFAULT 0,
  `netPay` double NOT NULL DEFAULT 0,
  `pdfUrl` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `frequency` enum('WEEKLY','FORTNIGHTLY','MONTHLY') NOT NULL DEFAULT 'FORTNIGHTLY'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_feature`
--

CREATE TABLE `plan_feature` (
  `id` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `featureId` varchar(191) NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_version_log`
--

CREATE TABLE `plan_version_log` (
  `id` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `version` varchar(191) NOT NULL,
  `changelog` text NOT NULL,
  `operator` varchar(191) NOT NULL DEFAULT 'System Root',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pre_start_checklist`
--

CREATE TABLE `pre_start_checklist` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `loadId` varchar(191) DEFAULT NULL,
  `vehicleRef` varchar(191) DEFAULT NULL,
  `trailerRef` varchar(191) DEFAULT NULL,
  `date` date NOT NULL,
  `submittedAt` datetime(3) DEFAULT NULL,
  `totalItems` int(11) NOT NULL DEFAULT 20,
  `passedCount` int(11) NOT NULL DEFAULT 0,
  `failedCount` int(11) NOT NULL DEFAULT 0,
  `naCount` int(11) NOT NULL DEFAULT 0,
  `isDraft` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `print_spooler_job`
--

CREATE TABLE `print_spooler_job` (
  `id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `warehouseId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promo_code`
--

CREATE TABLE `promo_code` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `campaignName` varchar(191) NOT NULL,
  `type` enum('PERCENTAGE','FIXED','TRIAL_EXTENSION') NOT NULL,
  `discountValue` double DEFAULT NULL,
  `extensionDays` int(11) DEFAULT NULL,
  `maxRedemptions` int(11) DEFAULT NULL,
  `redemptionCount` int(11) NOT NULL DEFAULT 0,
  `expiryDate` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proof_photo`
--

CREATE TABLE `proof_photo` (
  `id` varchar(191) NOT NULL,
  `itemId` varchar(191) NOT NULL,
  `stage` enum('PICKUP_CONDITION','LOADING_COR','DELIVERY_CONDITION') NOT NULL,
  `fileUrl` varchar(191) NOT NULL,
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposal`
--

CREATE TABLE `proposal` (
  `id` varchar(191) NOT NULL,
  `proposalRef` varchar(191) NOT NULL,
  `version` varchar(191) NOT NULL DEFAULT 'V1',
  `leadId` varchar(191) NOT NULL,
  `baseValue` double NOT NULL,
  `discountAmount` double NOT NULL DEFAULT 0,
  `finalValue` double NOT NULL,
  `validityDays` int(11) NOT NULL DEFAULT 30,
  `status` enum('DRAFT','SENT','ACCEPTED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  `includedModules` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` enum('OPERATIONS','FINANCIAL','COMPLIANCE','ANALYTICS') NOT NULL DEFAULT 'OPERATIONS',
  `description` text DEFAULT NULL,
  `metrics` varchar(191) NOT NULL,
  `createdBy` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_schedule`
--

CREATE TABLE `report_schedule` (
  `id` varchar(191) NOT NULL,
  `reportId` varchar(191) NOT NULL,
  `frequency` enum('DAILY','WEEKLY','MONTHLY') NOT NULL DEFAULT 'WEEKLY',
  `nextRunAt` datetime(3) NOT NULL,
  `recipients` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `route_stop`
--

CREATE TABLE `route_stop` (
  `id` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `type` enum('PICKUP','DROPOFF') NOT NULL,
  `sequenceIndex` int(11) NOT NULL,
  `address` varchar(191) NOT NULL,
  `contactName` varchar(191) DEFAULT NULL,
  `contactPhone` varchar(191) DEFAULT NULL,
  `scheduledDate` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_activity`
--

CREATE TABLE `sales_activity` (
  `id` varchar(191) NOT NULL,
  `leadId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `performedById` varchar(191) DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

CREATE TABLE `shift` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `driverId` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `status` enum('SCHEDULED','ON_SHIFT','COMPLETED','ABSENT','ON_LEAVE') NOT NULL DEFAULT 'SCHEDULED',
  `notes` text DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staging_area`
--

CREATE TABLE `staging_area` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `warehouseId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan`
--

CREATE TABLE `subscription_plan` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `monthlyPrice` double NOT NULL,
  `version` varchar(191) NOT NULL DEFAULT '1.0.0',
  `status` enum('DRAFT','PUBLISHED','DEPRECATED') NOT NULL DEFAULT 'PUBLISHED',
  `description` text DEFAULT NULL,
  `trialDays` int(11) NOT NULL DEFAULT 14,
  `usersLimit` int(11) NOT NULL DEFAULT 0,
  `driversLimit` int(11) NOT NULL DEFAULT 0,
  `vehiclesLimit` int(11) NOT NULL DEFAULT 0,
  `branchesLimit` int(11) NOT NULL DEFAULT 0,
  `storageLimitGB` int(11) NOT NULL DEFAULT 10,
  `apiCallsLimit` int(11) NOT NULL DEFAULT 10000,
  `createdBy` varchar(191) NOT NULL DEFAULT 'System Root',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket`
--

CREATE TABLE `support_ticket` (
  `id` varchar(191) NOT NULL,
  `ticketNumber` int(11) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'MEDIUM',
  `status` enum('OPEN','RESOLVED','WAITING_CUSTOMER','WAITING_INTERNAL') NOT NULL DEFAULT 'OPEN',
  `assigneeTier` varchar(191) DEFAULT NULL,
  `resolutionNote` text DEFAULT NULL,
  `assignedAgentId` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telemetry_log`
--

CREATE TABLE `telemetry_log` (
  `id` varchar(191) NOT NULL,
  `vehicleId` varchar(191) NOT NULL,
  `driverId` varchar(191) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `speedKmh` double DEFAULT NULL,
  `heading` varchar(191) DEFAULT NULL,
  `event` varchar(191) DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_subscription`
--

CREATE TABLE `tenant_subscription` (
  `id` varchar(191) NOT NULL,
  `subId` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `status` enum('ACTIVE','HOLD','EXPIRED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  `billingPeriod` enum('MONTHLY','ANNUALLY') NOT NULL DEFAULT 'MONTHLY',
  `startDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `nextRenewal` datetime(3) NOT NULL,
  `amount` double NOT NULL,
  `autoRenewal` tinyint(1) NOT NULL DEFAULT 1,
  `paymentGateway` varchar(191) DEFAULT NULL,
  `usersQuota` int(11) DEFAULT NULL,
  `storageQuotaGb` double DEFAULT NULL,
  `mostUsedModule` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE `theme` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` enum('PUBLISHED','DRAFT','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `accentColor` varchar(191) NOT NULL,
  `sidebarColor` varchar(191) NOT NULL,
  `headerColor` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_reply`
--

CREATE TABLE `ticket_reply` (
  `id` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `ticketId` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesheet`
--

CREATE TABLE `timesheet` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  `clockInAt` datetime(3) DEFAULT NULL,
  `clockOutAt` datetime(3) DEFAULT NULL,
  `workMinutes` int(11) NOT NULL DEFAULT 0,
  `breakMinutes` int(11) NOT NULL DEFAULT 0,
  `totalMinutes` int(11) NOT NULL DEFAULT 0,
  `overtimeMin` int(11) NOT NULL DEFAULT 0,
  `submittedAt` datetime(3) DEFAULT NULL,
  `approvedAt` datetime(3) DEFAULT NULL,
  `approvedBy` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesheet_event`
--

CREATE TABLE `timesheet_event` (
  `id` varchar(191) NOT NULL,
  `timesheetId` varchar(191) NOT NULL,
  `type` enum('CLOCK_IN','CLOCK_OUT','BREAK_START','BREAK_END','NOTE') NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `locationName` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `isAutoDetected` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transfer_event_log`
--

CREATE TABLE `transfer_event_log` (
  `id` varchar(191) NOT NULL,
  `transferId` varchar(191) NOT NULL,
  `eventDescription` text NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','PLATFORM_OWNER','COMPANY_ADMIN','SALES','DISPATCHER','DRIVER','WAREHOUSE','YARD','ACCOUNTS','CUSTOMER','USER') NOT NULL DEFAULT 'USER',
  `userCode` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'PENDING',
  `customRoleId` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `userCode`, `phone`, `status`, `customRoleId`, `companyId`, `createdAt`, `updatedAt`) VALUES
('011c265f-967b-4b7c-980c-e48ce5ea632a', 'warehouse@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'WAREHOUSE Demo', 'WAREHOUSE', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.708', '2026-08-06 07:17:26.708'),
('02e7e216-0f7a-48b6-b6d2-1b07fb570ba6', 'driver@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'DRIVER Demo', 'DRIVER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.698', '2026-08-06 07:17:26.698'),
('0cf996cc-1329-46d3-bec1-b89e19e66d8e', 'customer@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'CUSTOMER Demo', 'CUSTOMER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.740', '2026-08-06 07:17:26.740'),
('42841293-bbc8-4d4b-8555-b9064a618c20', 'admin@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'SUPER_ADMIN Demo', 'SUPER_ADMIN', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:15:41.227', '2026-08-06 07:17:26.599'),
('4652abea-931b-4d3c-b965-fdadacde1f2a', 'yard@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'YARD Demo', 'YARD', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.719', '2026-08-06 07:17:26.719'),
('b2e6003b-4f08-4380-8232-46a2d1dc252b', 'sales@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'SALES Demo', 'SALES', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.675', '2026-08-06 07:17:26.675'),
('bc293d64-3cad-4322-b8e1-d053d3ae085d', 'dispatcher@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'DISPATCHER Demo', 'DISPATCHER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.688', '2026-08-06 07:17:26.688'),
('db2c33fe-e753-4959-8f17-fe8aa0fe2875', 'accounts@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'ACCOUNTS Demo', 'ACCOUNTS', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.729', '2026-08-06 07:17:26.729'),
('f4a2f0a4-46ee-428c-bddb-429bf29f305c', 'company-admin@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'COMPANY_ADMIN Demo', 'COMPANY_ADMIN', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:15:41.521', '2026-08-06 07:17:26.666');

-- --------------------------------------------------------

--
-- Table structure for table `user_session`
--

CREATE TABLE `user_session` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `loginTime` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `logoutTime` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `expiresAt` datetime(3) DEFAULT NULL,
  `tokenHash` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_session`
--

INSERT INTO `user_session` (`id`, `userId`, `ipAddress`, `userAgent`, `loginTime`, `logoutTime`, `isActive`, `expiresAt`, `tokenHash`) VALUES
('7cb8c7c4-5f59-4dae-8f7e-54af915e3609', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-06 07:33:47.724', NULL, 1, '2026-08-13 07:33:47.720', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMDE2MjcsImV4cCI6MTc4NjYwNjQyN30.BUfAAvhcYrUVGkpP3Y-EHrV7D3s_D6ysOwr6vVQW0nU'),
('ab221c12-657f-4251-9586-3fbda6794503', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-06 07:23:48.402', NULL, 1, '2026-08-13 07:23:48.399', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMDEwMjgsImV4cCI6MTc4NjYwNTgyOH0.oH0-ZjGltxx7EhefoGdi_LV5WziEDFP8CMVMxHntCtw');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `id` varchar(191) NOT NULL,
  `category` enum('TRUCK','TRAILER') NOT NULL DEFAULT 'TRUCK',
  `make` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `plate` varchar(191) DEFAULT NULL,
  `rego` varchar(191) DEFAULT NULL,
  `vin` varchar(191) DEFAULT NULL,
  `odometerKm` int(11) NOT NULL DEFAULT 0,
  `maintenanceDueKm` int(11) DEFAULT NULL,
  `regType` varchar(191) DEFAULT NULL,
  `regState` varchar(191) DEFAULT NULL,
  `regIssueDate` datetime(3) DEFAULT NULL,
  `regExpiryDate` datetime(3) DEFAULT NULL,
  `fuelType` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `engineNumber` varchar(191) DEFAULT NULL,
  `primaryMechanic` varchar(191) DEFAULT NULL,
  `preferredRoutes` varchar(191) DEFAULT NULL,
  `preferredRegions` varchar(191) DEFAULT NULL,
  `maxDistPerTripKm` int(11) DEFAULT NULL,
  `dgCertified` tinyint(1) NOT NULL DEFAULT 0,
  `hvCertified` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('IN_TRANSIT','IDLE','MAINTENANCE','ALERT') NOT NULL DEFAULT 'IDLE',
  `currentLocation` varchar(191) DEFAULT NULL,
  `currentSpeed` double DEFAULT NULL,
  `fuelLevel` double DEFAULT NULL,
  `engineTemp` double DEFAULT NULL,
  `lastPing` datetime(3) DEFAULT NULL,
  `currentDriverId` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vin_scan_event`
--

CREATE TABLE `vin_scan_event` (
  `id` varchar(191) NOT NULL,
  `driverId` varchar(191) NOT NULL,
  `loadId` varchar(191) NOT NULL,
  `loadItemId` varchar(191) DEFAULT NULL,
  `scannedVin` varchar(191) NOT NULL,
  `result` enum('PICKED_UP','DELIVERED','WRONG_VEHICLE') NOT NULL,
  `stopType` varchar(191) NOT NULL,
  `stopIndex` int(11) DEFAULT NULL,
  `gpsLat` double DEFAULT NULL,
  `gpsLng` double DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'General',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `totalAreaSqm` int(11) DEFAULT NULL,
  `palletCapacity` int(11) DEFAULT NULL,
  `loadingDocks` int(11) DEFAULT NULL,
  `features` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `postalCode` varchar(191) DEFAULT NULL,
  `managerId` varchar(191) DEFAULT NULL,
  `branchId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_label_print`
--

CREATE TABLE `warehouse_label_print` (
  `id` varchar(191) NOT NULL,
  `warehouseId` varchar(191) NOT NULL,
  `barcode` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `white_label_config`
--

CREATE TABLE `white_label_config` (
  `id` varchar(191) NOT NULL,
  `companyId` varchar(191) NOT NULL,
  `platformName` varchar(191) NOT NULL DEFAULT 'Logistics OS',
  `portalName` varchar(191) NOT NULL DEFAULT 'Enterprise Tenant Portal',
  `shortName` varchar(191) NOT NULL DEFAULT 'HeroLog',
  `loaderGifUrl` varchar(191) DEFAULT NULL,
  `logoLightUrl` varchar(191) DEFAULT NULL,
  `logoDarkUrl` varchar(191) DEFAULT NULL,
  `faviconUrl` varchar(191) DEFAULT NULL,
  `loginBgUrl` varchar(191) DEFAULT NULL,
  `dashboardBgUrl` varchar(191) DEFAULT NULL,
  `emailLogoUrl` varchar(191) DEFAULT NULL,
  `invoiceLogoUrl` varchar(191) DEFAULT NULL,
  `manifestLogoUrl` varchar(191) DEFAULT NULL,
  `fontFamily` varchar(191) NOT NULL DEFAULT 'Inter',
  `typographyStyle` varchar(191) NOT NULL DEFAULT 'Modern Sans',
  `hideBrandingLabels` tinyint(1) NOT NULL DEFAULT 0,
  `hideSystemLinks` tinyint(1) NOT NULL DEFAULT 0,
  `buttonRadius` varchar(191) NOT NULL DEFAULT '16px',
  `activeThemeId` varchar(191) DEFAULT NULL,
  `pdfHeaderText` varchar(191) DEFAULT NULL,
  `pdfFooterText` varchar(191) DEFAULT NULL,
  `pdfWatermark` tinyint(1) NOT NULL DEFAULT 0,
  `pdfQrCode` tinyint(1) NOT NULL DEFAULT 0,
  `loginGreeting` varchar(191) DEFAULT NULL,
  `loginIllustration` varchar(191) DEFAULT NULL,
  `supportUrl` varchar(191) DEFAULT NULL,
  `mfaEnforced` tinyint(1) NOT NULL DEFAULT 0,
  `sessionTimeoutMins` int(11) NOT NULL DEFAULT 30,
  `allowedIps` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `white_label_release_log`
--

CREATE TABLE `white_label_release_log` (
  `id` varchar(191) NOT NULL,
  `version` varchar(191) NOT NULL,
  `buildNumber` int(11) NOT NULL,
  `status` enum('PUBLISHED','ARCHIVED') NOT NULL,
  `changelog` text NOT NULL,
  `operator` varchar(191) NOT NULL,
  `durationSeconds` int(11) NOT NULL,
  `configId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_activity_log`
--
ALTER TABLE `ai_activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_activity_log_moduleId_fkey` (`moduleId`),
  ADD KEY `ai_activity_log_companyId_fkey` (`companyId`);

--
-- Indexes for table `ai_module`
--
ALTER TABLE `ai_module`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ai_module_name_key` (`name`);

--
-- Indexes for table `api_integration`
--
ALTER TABLE `api_integration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_integration_configId_serviceName_key` (`configId`,`serviceName`);

--
-- Indexes for table `api_usage_log`
--
ALTER TABLE `api_usage_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_usage_log_companyId_fkey` (`companyId`);

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_assetId_key` (`assetId`),
  ADD KEY `asset_branchId_fkey` (`branchId`),
  ADD KEY `asset_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `asset_assignment`
--
ALTER TABLE `asset_assignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_assignment_assetId_fkey` (`assetId`),
  ADD KEY `asset_assignment_assignedById_fkey` (`assignedById`);

--
-- Indexes for table `asset_maintenance`
--
ALTER TABLE `asset_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_maintenance_assetId_fkey` (`assetId`);

--
-- Indexes for table `asset_transfer`
--
ALTER TABLE `asset_transfer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_transfer_transferNumber_key` (`transferNumber`),
  ADD KEY `asset_transfer_senderCompanyId_fkey` (`senderCompanyId`),
  ADD KEY `asset_transfer_receiverCompanyId_fkey` (`receiverCompanyId`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_log_companyId_fkey` (`companyId`);

--
-- Indexes for table `billing_record`
--
ALTER TABLE `billing_record`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `billing_record_invoiceNumber_key` (`invoiceNumber`),
  ADD KEY `billing_record_companyId_fkey` (`companyId`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_companyId_fkey` (`companyId`);

--
-- Indexes for table `checklist_item_response`
--
ALTER TABLE `checklist_item_response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checklist_item_response_checklistId_fkey` (`checklistId`);

--
-- Indexes for table `communication_template`
--
ALTER TABLE `communication_template`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `communication_template_configId_type_key` (`configId`,`type`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_tenantId_key` (`tenantId`),
  ADD UNIQUE KEY `company_leadId_key` (`leadId`);

--
-- Indexes for table `company_feature_override`
--
ALTER TABLE `company_feature_override`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_feature_override_companyId_featureId_key` (`companyId`,`featureId`),
  ADD KEY `company_feature_override_featureId_fkey` (`featureId`);

--
-- Indexes for table `company_integration`
--
ALTER TABLE `company_integration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_integration_companyId_providerName_key` (`companyId`,`providerName`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_companyId_fkey` (`companyId`);

--
-- Indexes for table `conversation_participant`
--
ALTER TABLE `conversation_participant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_participant_conversationId_fkey` (`conversationId`),
  ADD KEY `conversation_participant_userId_fkey` (`userId`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_companyId_fkey` (`companyId`),
  ADD KEY `customer_accountManagerId_fkey` (`accountManagerId`);

--
-- Indexes for table `customer_invoice`
--
ALTER TABLE `customer_invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_invoice_invoiceNumber_key` (`invoiceNumber`),
  ADD KEY `customer_invoice_customerId_fkey` (`customerId`),
  ADD KEY `customer_invoice_loadId_fkey` (`loadId`);

--
-- Indexes for table `custom_domain`
--
ALTER TABLE `custom_domain`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `custom_domain_domain_key` (`domain`),
  ADD KEY `custom_domain_configId_fkey` (`configId`);

--
-- Indexes for table `custom_permission`
--
ALTER TABLE `custom_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `custom_permission_roleId_fkey` (`roleId`);

--
-- Indexes for table `custom_role`
--
ALTER TABLE `custom_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `custom_role_companyId_fkey` (`companyId`);

--
-- Indexes for table `delivery_p_o_d`
--
ALTER TABLE `delivery_p_o_d`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delivery_p_o_d_driverId_fkey` (`driverId`),
  ADD KEY `delivery_p_o_d_loadId_fkey` (`loadId`),
  ADD KEY `delivery_p_o_d_loadItemId_fkey` (`loadItemId`);

--
-- Indexes for table `demo_booking`
--
ALTER TABLE `demo_booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demo_booking_leadId_fkey` (`leadId`),
  ADD KEY `demo_booking_presenterId_fkey` (`presenterId`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document_driverId_fkey` (`driverId`),
  ADD KEY `document_vehicleId_fkey` (`vehicleId`),
  ADD KEY `document_assetId_fkey` (`assetId`),
  ADD KEY `document_loadId_fkey` (`loadId`),
  ADD KEY `document_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `driver_driverCode_key` (`driverCode`),
  ADD UNIQUE KEY `driver_email_key` (`email`),
  ADD UNIQUE KEY `driver_userId_key` (`userId`),
  ADD KEY `driver_branchId_fkey` (`branchId`),
  ADD KEY `driver_managerId_fkey` (`managerId`),
  ADD KEY `driver_companyId_fkey` (`companyId`);

--
-- Indexes for table `email_template`
--
ALTER TABLE `email_template`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_template_name_key` (`name`);

--
-- Indexes for table `equipment_swap`
--
ALTER TABLE `equipment_swap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_swap_driverId_fkey` (`driverId`),
  ADD KEY `equipment_swap_prevTrailerId_fkey` (`prevTrailerId`),
  ADD KEY `equipment_swap_newTrailerId_fkey` (`newTrailerId`),
  ADD KEY `equipment_swap_companyId_fkey` (`companyId`);

--
-- Indexes for table `feature`
--
ALTER TABLE `feature`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `feature_uniqueId_key` (`uniqueId`);

--
-- Indexes for table `feature_dependency`
--
ALTER TABLE `feature_dependency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `feature_dependency_featureId_dependencyId_key` (`featureId`,`dependencyId`),
  ADD KEY `feature_dependency_dependencyId_fkey` (`dependencyId`);

--
-- Indexes for table `feature_version_log`
--
ALTER TABLE `feature_version_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feature_version_log_featureId_fkey` (`featureId`);

--
-- Indexes for table `follow_up_task`
--
ALTER TABLE `follow_up_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `follow_up_task_leadId_fkey` (`leadId`),
  ADD KEY `follow_up_task_repId_fkey` (`repId`);

--
-- Indexes for table `inbound_receipt`
--
ALTER TABLE `inbound_receipt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inbound_receipt_receiptNo_key` (`receiptNo`),
  ADD KEY `inbound_receipt_stagingAreaId_fkey` (`stagingAreaId`),
  ADD KEY `inbound_receipt_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `item_movement`
--
ALTER TABLE `item_movement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_movement_itemId_fkey` (`itemId`),
  ADD KEY `item_movement_loadLaneId_fkey` (`loadLaneId`),
  ADD KEY `item_movement_stagingAreaId_fkey` (`stagingAreaId`),
  ADD KEY `item_movement_loadId_fkey` (`loadId`),
  ADD KEY `item_movement_performedById_fkey` (`performedById`);

--
-- Indexes for table `lead`
--
ALTER TABLE `lead`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lead_repId_fkey` (`repId`);

--
-- Indexes for table `load`
--
ALTER TABLE `load`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `load_loadRef_key` (`loadRef`),
  ADD UNIQUE KEY `load_draftId_key` (`draftId`),
  ADD KEY `load_customerId_fkey` (`customerId`),
  ADD KEY `load_driverId_fkey` (`driverId`),
  ADD KEY `load_truckId_fkey` (`truckId`),
  ADD KEY `load_trailerId_fkey` (`trailerId`),
  ADD KEY `load_loadLaneId_fkey` (`loadLaneId`),
  ADD KEY `load_stagingAreaId_fkey` (`stagingAreaId`),
  ADD KEY `load_companyId_fkey` (`companyId`);

--
-- Indexes for table `load_activity`
--
ALTER TABLE `load_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `load_activity_loadId_fkey` (`loadId`);

--
-- Indexes for table `load_expense`
--
ALTER TABLE `load_expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `load_expense_loadId_fkey` (`loadId`);

--
-- Indexes for table `load_item`
--
ALTER TABLE `load_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `load_item_loadId_fkey` (`loadId`),
  ADD KEY `load_item_customerId_fkey` (`customerId`),
  ADD KEY `load_item_pickupStopId_fkey` (`pickupStopId`),
  ADD KEY `load_item_dropoffStopId_fkey` (`dropoffStopId`),
  ADD KEY `load_item_warehouseId_fkey` (`warehouseId`),
  ADD KEY `load_item_inboundReceiptId_fkey` (`inboundReceiptId`),
  ADD KEY `load_item_loadLaneId_fkey` (`loadLaneId`),
  ADD KEY `load_item_stagingAreaId_fkey` (`stagingAreaId`);

--
-- Indexes for table `load_lane`
--
ALTER TABLE `load_lane`
  ADD PRIMARY KEY (`id`),
  ADD KEY `load_lane_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_conversationId_fkey` (`conversationId`),
  ADD KEY `message_senderId_fkey` (`senderId`),
  ADD KEY `message_loadId_fkey` (`loadId`);

--
-- Indexes for table `module_usage_log`
--
ALTER TABLE `module_usage_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `module_usage_log_companyId_featureId_key` (`companyId`,`featureId`),
  ADD KEY `module_usage_log_featureId_fkey` (`featureId`);

--
-- Indexes for table `networked_printer`
--
ALTER TABLE `networked_printer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `networked_printer_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `offline_sync_item`
--
ALTER TABLE `offline_sync_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `offline_sync_item_driverId_fkey` (`driverId`),
  ADD KEY `offline_sync_item_companyId_fkey` (`companyId`);

--
-- Indexes for table `payment_attempt`
--
ALTER TABLE `payment_attempt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_attempt_transactionId_key` (`transactionId`),
  ADD KEY `payment_attempt_billingRecordId_fkey` (`billingRecordId`);

--
-- Indexes for table `pay_period`
--
ALTER TABLE `pay_period`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pay_period_companyId_fkey` (`companyId`),
  ADD KEY `pay_period_driverId_fkey` (`driverId`);

--
-- Indexes for table `plan_feature`
--
ALTER TABLE `plan_feature`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plan_feature_planId_featureId_key` (`planId`,`featureId`),
  ADD KEY `plan_feature_featureId_fkey` (`featureId`);

--
-- Indexes for table `plan_version_log`
--
ALTER TABLE `plan_version_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_version_log_planId_fkey` (`planId`);

--
-- Indexes for table `pre_start_checklist`
--
ALTER TABLE `pre_start_checklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre_start_checklist_driverId_fkey` (`driverId`),
  ADD KEY `pre_start_checklist_loadId_fkey` (`loadId`),
  ADD KEY `pre_start_checklist_companyId_fkey` (`companyId`);

--
-- Indexes for table `print_spooler_job`
--
ALTER TABLE `print_spooler_job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `print_spooler_job_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `promo_code`
--
ALTER TABLE `promo_code`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promo_code_code_key` (`code`);

--
-- Indexes for table `proof_photo`
--
ALTER TABLE `proof_photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proof_photo_itemId_fkey` (`itemId`);

--
-- Indexes for table `proposal`
--
ALTER TABLE `proposal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `proposal_proposalRef_key` (`proposalRef`),
  ADD KEY `proposal_leadId_fkey` (`leadId`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_createdBy_fkey` (`createdBy`),
  ADD KEY `report_companyId_fkey` (`companyId`);

--
-- Indexes for table `report_schedule`
--
ALTER TABLE `report_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_schedule_reportId_fkey` (`reportId`);

--
-- Indexes for table `route_stop`
--
ALTER TABLE `route_stop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_stop_loadId_fkey` (`loadId`);

--
-- Indexes for table `sales_activity`
--
ALTER TABLE `sales_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_activity_leadId_fkey` (`leadId`),
  ADD KEY `sales_activity_performedById_fkey` (`performedById`);

--
-- Indexes for table `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shift_userId_fkey` (`userId`),
  ADD KEY `shift_driverId_fkey` (`driverId`),
  ADD KEY `shift_companyId_fkey` (`companyId`);

--
-- Indexes for table `staging_area`
--
ALTER TABLE `staging_area`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staging_area_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_ticket`
--
ALTER TABLE `support_ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_ticket_ticketNumber_key` (`ticketNumber`),
  ADD KEY `support_ticket_assignedAgentId_fkey` (`assignedAgentId`),
  ADD KEY `support_ticket_companyId_fkey` (`companyId`);

--
-- Indexes for table `telemetry_log`
--
ALTER TABLE `telemetry_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `telemetry_log_vehicleId_fkey` (`vehicleId`),
  ADD KEY `telemetry_log_driverId_fkey` (`driverId`);

--
-- Indexes for table `tenant_subscription`
--
ALTER TABLE `tenant_subscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_subscription_subId_key` (`subId`),
  ADD UNIQUE KEY `tenant_subscription_companyId_key` (`companyId`),
  ADD KEY `tenant_subscription_planId_fkey` (`planId`);

--
-- Indexes for table `theme`
--
ALTER TABLE `theme`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ticket_reply`
--
ALTER TABLE `ticket_reply`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_reply_ticketId_fkey` (`ticketId`),
  ADD KEY `ticket_reply_authorId_fkey` (`authorId`);

--
-- Indexes for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timesheet_companyId_fkey` (`companyId`),
  ADD KEY `timesheet_driverId_fkey` (`driverId`);

--
-- Indexes for table `timesheet_event`
--
ALTER TABLE `timesheet_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timesheet_event_timesheetId_fkey` (`timesheetId`);

--
-- Indexes for table `transfer_event_log`
--
ALTER TABLE `transfer_event_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transfer_event_log_transferId_fkey` (`transferId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_key` (`email`),
  ADD UNIQUE KEY `user_userCode_key` (`userCode`),
  ADD KEY `user_customRoleId_fkey` (`customRoleId`),
  ADD KEY `user_companyId_fkey` (`companyId`);

--
-- Indexes for table `user_session`
--
ALTER TABLE `user_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_session_userId_fkey` (`userId`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicle_rego_key` (`rego`),
  ADD UNIQUE KEY `vehicle_vin_key` (`vin`),
  ADD KEY `vehicle_currentDriverId_fkey` (`currentDriverId`),
  ADD KEY `vehicle_companyId_fkey` (`companyId`);

--
-- Indexes for table `vin_scan_event`
--
ALTER TABLE `vin_scan_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vin_scan_event_driverId_fkey` (`driverId`),
  ADD KEY `vin_scan_event_loadId_fkey` (`loadId`),
  ADD KEY `vin_scan_event_loadItemId_fkey` (`loadItemId`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `warehouse_code_key` (`code`),
  ADD KEY `warehouse_managerId_fkey` (`managerId`),
  ADD KEY `warehouse_branchId_fkey` (`branchId`);

--
-- Indexes for table `warehouse_label_print`
--
ALTER TABLE `warehouse_label_print`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `warehouse_label_print_barcode_key` (`barcode`),
  ADD KEY `warehouse_label_print_warehouseId_fkey` (`warehouseId`);

--
-- Indexes for table `white_label_config`
--
ALTER TABLE `white_label_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `white_label_config_companyId_key` (`companyId`),
  ADD KEY `white_label_config_activeThemeId_fkey` (`activeThemeId`);

--
-- Indexes for table `white_label_release_log`
--
ALTER TABLE `white_label_release_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `white_label_release_log_configId_fkey` (`configId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `support_ticket`
--
ALTER TABLE `support_ticket`
  MODIFY `ticketNumber` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_activity_log`
--
ALTER TABLE `ai_activity_log`
  ADD CONSTRAINT `ai_activity_log_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ai_activity_log_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `ai_module` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `api_integration`
--
ALTER TABLE `api_integration`
  ADD CONSTRAINT `api_integration_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `white_label_config` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `api_usage_log`
--
ALTER TABLE `api_usage_log`
  ADD CONSTRAINT `api_usage_log_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `asset_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `asset_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `asset_assignment`
--
ALTER TABLE `asset_assignment`
  ADD CONSTRAINT `asset_assignment_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `asset_assignment_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `asset_maintenance`
--
ALTER TABLE `asset_maintenance`
  ADD CONSTRAINT `asset_maintenance_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `asset_transfer`
--
ALTER TABLE `asset_transfer`
  ADD CONSTRAINT `asset_transfer_receiverCompanyId_fkey` FOREIGN KEY (`receiverCompanyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `asset_transfer_senderCompanyId_fkey` FOREIGN KEY (`senderCompanyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `billing_record`
--
ALTER TABLE `billing_record`
  ADD CONSTRAINT `billing_record_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `branch_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `checklist_item_response`
--
ALTER TABLE `checklist_item_response`
  ADD CONSTRAINT `checklist_item_response_checklistId_fkey` FOREIGN KEY (`checklistId`) REFERENCES `pre_start_checklist` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `communication_template`
--
ALTER TABLE `communication_template`
  ADD CONSTRAINT `communication_template_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `white_label_config` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `company_feature_override`
--
ALTER TABLE `company_feature_override`
  ADD CONSTRAINT `company_feature_override_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `company_feature_override_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `company_integration`
--
ALTER TABLE `company_integration`
  ADD CONSTRAINT `company_integration_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `conversation_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `conversation_participant`
--
ALTER TABLE `conversation_participant`
  ADD CONSTRAINT `conversation_participant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_accountManagerId_fkey` FOREIGN KEY (`accountManagerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `customer_invoice`
--
ALTER TABLE `customer_invoice`
  ADD CONSTRAINT `customer_invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_invoice_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `custom_domain`
--
ALTER TABLE `custom_domain`
  ADD CONSTRAINT `custom_domain_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `white_label_config` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `custom_permission`
--
ALTER TABLE `custom_permission`
  ADD CONSTRAINT `custom_permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `custom_role` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `custom_role`
--
ALTER TABLE `custom_role`
  ADD CONSTRAINT `custom_role_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `delivery_p_o_d`
--
ALTER TABLE `delivery_p_o_d`
  ADD CONSTRAINT `delivery_p_o_d_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_p_o_d_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_p_o_d_loadItemId_fkey` FOREIGN KEY (`loadItemId`) REFERENCES `load_item` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `demo_booking`
--
ALTER TABLE `demo_booking`
  ADD CONSTRAINT `demo_booking_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `lead` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `demo_booking_presenterId_fkey` FOREIGN KEY (`presenterId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `document_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `document_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `document_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `document_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `driver_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `driver_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `driver_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `equipment_swap`
--
ALTER TABLE `equipment_swap`
  ADD CONSTRAINT `equipment_swap_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `equipment_swap_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `equipment_swap_newTrailerId_fkey` FOREIGN KEY (`newTrailerId`) REFERENCES `vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `equipment_swap_prevTrailerId_fkey` FOREIGN KEY (`prevTrailerId`) REFERENCES `vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `feature_dependency`
--
ALTER TABLE `feature_dependency`
  ADD CONSTRAINT `feature_dependency_dependencyId_fkey` FOREIGN KEY (`dependencyId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `feature_dependency_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `feature_version_log`
--
ALTER TABLE `feature_version_log`
  ADD CONSTRAINT `feature_version_log_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `follow_up_task`
--
ALTER TABLE `follow_up_task`
  ADD CONSTRAINT `follow_up_task_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `lead` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `follow_up_task_repId_fkey` FOREIGN KEY (`repId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `inbound_receipt`
--
ALTER TABLE `inbound_receipt`
  ADD CONSTRAINT `inbound_receipt_stagingAreaId_fkey` FOREIGN KEY (`stagingAreaId`) REFERENCES `staging_area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `inbound_receipt_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `item_movement`
--
ALTER TABLE `item_movement`
  ADD CONSTRAINT `item_movement_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `load_item` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `item_movement_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `item_movement_loadLaneId_fkey` FOREIGN KEY (`loadLaneId`) REFERENCES `load_lane` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `item_movement_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `item_movement_stagingAreaId_fkey` FOREIGN KEY (`stagingAreaId`) REFERENCES `staging_area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `lead`
--
ALTER TABLE `lead`
  ADD CONSTRAINT `lead_repId_fkey` FOREIGN KEY (`repId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `load`
--
ALTER TABLE `load`
  ADD CONSTRAINT `load_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `load_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_loadLaneId_fkey` FOREIGN KEY (`loadLaneId`) REFERENCES `load_lane` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_stagingAreaId_fkey` FOREIGN KEY (`stagingAreaId`) REFERENCES `staging_area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_trailerId_fkey` FOREIGN KEY (`trailerId`) REFERENCES `vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_truckId_fkey` FOREIGN KEY (`truckId`) REFERENCES `vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `load_activity`
--
ALTER TABLE `load_activity`
  ADD CONSTRAINT `load_activity_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `load_expense`
--
ALTER TABLE `load_expense`
  ADD CONSTRAINT `load_expense_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `load_item`
--
ALTER TABLE `load_item`
  ADD CONSTRAINT `load_item_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_dropoffStopId_fkey` FOREIGN KEY (`dropoffStopId`) REFERENCES `route_stop` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_inboundReceiptId_fkey` FOREIGN KEY (`inboundReceiptId`) REFERENCES `inbound_receipt` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_loadLaneId_fkey` FOREIGN KEY (`loadLaneId`) REFERENCES `load_lane` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_pickupStopId_fkey` FOREIGN KEY (`pickupStopId`) REFERENCES `route_stop` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_stagingAreaId_fkey` FOREIGN KEY (`stagingAreaId`) REFERENCES `staging_area` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `load_lane`
--
ALTER TABLE `load_lane`
  ADD CONSTRAINT `load_lane_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `message_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `module_usage_log`
--
ALTER TABLE `module_usage_log`
  ADD CONSTRAINT `module_usage_log_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `module_usage_log_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `networked_printer`
--
ALTER TABLE `networked_printer`
  ADD CONSTRAINT `networked_printer_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `offline_sync_item`
--
ALTER TABLE `offline_sync_item`
  ADD CONSTRAINT `offline_sync_item_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `offline_sync_item_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment_attempt`
--
ALTER TABLE `payment_attempt`
  ADD CONSTRAINT `payment_attempt_billingRecordId_fkey` FOREIGN KEY (`billingRecordId`) REFERENCES `billing_record` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `pay_period`
--
ALTER TABLE `pay_period`
  ADD CONSTRAINT `pay_period_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pay_period_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `plan_feature`
--
ALTER TABLE `plan_feature`
  ADD CONSTRAINT `plan_feature_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `plan_feature_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscription_plan` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `plan_version_log`
--
ALTER TABLE `plan_version_log`
  ADD CONSTRAINT `plan_version_log_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscription_plan` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `pre_start_checklist`
--
ALTER TABLE `pre_start_checklist`
  ADD CONSTRAINT `pre_start_checklist_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pre_start_checklist_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pre_start_checklist_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `print_spooler_job`
--
ALTER TABLE `print_spooler_job`
  ADD CONSTRAINT `print_spooler_job_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proof_photo`
--
ALTER TABLE `proof_photo`
  ADD CONSTRAINT `proof_photo_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `load_item` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposal`
--
ALTER TABLE `proposal`
  ADD CONSTRAINT `proposal_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `lead` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `report_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report_schedule`
--
ALTER TABLE `report_schedule`
  ADD CONSTRAINT `report_schedule_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `route_stop`
--
ALTER TABLE `route_stop`
  ADD CONSTRAINT `route_stop_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `sales_activity`
--
ALTER TABLE `sales_activity`
  ADD CONSTRAINT `sales_activity_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `lead` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_activity_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `shift`
--
ALTER TABLE `shift`
  ADD CONSTRAINT `shift_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `shift_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `staging_area`
--
ALTER TABLE `staging_area`
  ADD CONSTRAINT `staging_area_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `support_ticket`
--
ALTER TABLE `support_ticket`
  ADD CONSTRAINT `support_ticket_assignedAgentId_fkey` FOREIGN KEY (`assignedAgentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `support_ticket_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `telemetry_log`
--
ALTER TABLE `telemetry_log`
  ADD CONSTRAINT `telemetry_log_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `telemetry_log_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tenant_subscription`
--
ALTER TABLE `tenant_subscription`
  ADD CONSTRAINT `tenant_subscription_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tenant_subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscription_plan` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `ticket_reply`
--
ALTER TABLE `ticket_reply`
  ADD CONSTRAINT `ticket_reply_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_reply_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `support_ticket` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD CONSTRAINT `timesheet_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `timesheet_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `timesheet_event`
--
ALTER TABLE `timesheet_event`
  ADD CONSTRAINT `timesheet_event_timesheetId_fkey` FOREIGN KEY (`timesheetId`) REFERENCES `timesheet` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transfer_event_log`
--
ALTER TABLE `transfer_event_log`
  ADD CONSTRAINT `transfer_event_log_transferId_fkey` FOREIGN KEY (`transferId`) REFERENCES `asset_transfer` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_customRoleId_fkey` FOREIGN KEY (`customRoleId`) REFERENCES `custom_role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_session`
--
ALTER TABLE `user_session`
  ADD CONSTRAINT `user_session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `vehicle_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicle_currentDriverId_fkey` FOREIGN KEY (`currentDriverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `vin_scan_event`
--
ALTER TABLE `vin_scan_event`
  ADD CONSTRAINT `vin_scan_event_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vin_scan_event_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vin_scan_event_loadItemId_fkey` FOREIGN KEY (`loadItemId`) REFERENCES `load_item` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD CONSTRAINT `warehouse_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `warehouse_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `warehouse_label_print`
--
ALTER TABLE `warehouse_label_print`
  ADD CONSTRAINT `warehouse_label_print_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `white_label_config`
--
ALTER TABLE `white_label_config`
  ADD CONSTRAINT `white_label_config_activeThemeId_fkey` FOREIGN KEY (`activeThemeId`) REFERENCES `theme` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `white_label_config_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `white_label_release_log`
--
ALTER TABLE `white_label_release_log`
  ADD CONSTRAINT `white_label_release_log_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `white_label_config` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
