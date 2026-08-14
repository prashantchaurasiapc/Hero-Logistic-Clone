-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2026 at 07:35 AM
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
-- Table structure for table `ai_model_registry`
--

CREATE TABLE `ai_model_registry` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL DEFAULT 'OpenAI',
  `version` varchar(191) NOT NULL DEFAULT 'v1.0',
  `latencySla` varchar(191) DEFAULT '120ms',
  `costRate` varchar(191) DEFAULT '$0.002 / 1k tokens',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `lastUpdated` varchar(191) DEFAULT 'Today',
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_model_registry`
--

INSERT INTO `ai_model_registry` (`id`, `name`, `provider`, `version`, `latencySla`, `costRate`, `status`, `lastUpdated`, `companyId`, `createdAt`, `updatedAt`) VALUES
('69286d5b-b965-45bf-80ef-c0700c90f5a4', 'Claude 3.5 Sonnet (Anthropic)', 'Anthropic', 'v1.0', '120ms', '$0.002 / 1k tokens', 'Active', '07 Aug 2026', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:30:44.153', '2026-08-07 11:30:44.153');

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
  `updatedAt` datetime(3) NOT NULL,
  `iotDeviceId` varchar(191) DEFAULT NULL
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

--
-- Dumping data for table `audit_log`
--

INSERT INTO `audit_log` (`id`, `action`, `operator`, `ipAddress`, `companyId`, `createdAt`) VALUES
('553f2fe7-a786-4785-a042-3758d624d9fd', 'Subscription updated → Plan: Hero Pro, Billing: ANNUALLY.', 'Company Admin', '::1', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 12:44:54.812');

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

--
-- Dumping data for table `billing_record`
--

INSERT INTO `billing_record` (`id`, `invoiceNumber`, `amount`, `status`, `paymentMethod`, `periodStart`, `periodEnd`, `date`, `planTierSnapshot`, `dueDate`, `taxAmount`, `pdfUrl`, `companyId`, `createdAt`, `updatedAt`) VALUES
('24a5a44d-cbc3-40f7-8daf-91b41a78c09c', 'INV-2026-1001', 499, 'PAID', 'Visa •••• 4242', '2026-08-07 12:44:54.750', '2026-09-06 12:44:54.750', '2026-08-07 12:44:54.750', 'Hero Pro', '2026-09-06 12:44:54.750', 49.9, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 12:46:44.355', '2026-08-07 12:46:44.355');

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

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`id`, `name`, `location`, `companyId`, `createdAt`, `updatedAt`) VALUES
('39101913-9233-4f72-b53e-de75b955ac7d', 'Sydney Main', NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:38:55.965', '2026-08-08 06:38:55.965'),
('b5709a3f-27e1-4088-9881-2a999c043cba', 'Sydney Main,', NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 07:12:06.143', '2026-08-08 07:12:06.143'),
('fce20507-9461-4961-9143-ac4b2a3a2403', 'Head Office', 'Sydney, NSW', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.703', '2026-08-07 06:18:43.703');

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
  `updatedAt` datetime(3) NOT NULL,
  `securityAuditAlerts` tinyint(1) DEFAULT 1,
  `securityIpWhitelisting` tinyint(1) DEFAULT 0,
  `securityRetentionDays` varchar(191) DEFAULT '90 Days',
  `securitySessionTimeout` varchar(191) DEFAULT '30 Minutes',
  `securityTwoFactorAuth` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `tenantId`, `isSandbox`, `leadId`, `name`, `status`, `trialExpiry`, `lastLogin`, `accountManager`, `storageUsedGB`, `registrationNumber`, `adminEmail`, `cardBrand`, `cardLast4`, `cardExpiry`, `defaultBusinessHours`, `nicheCarCarrying`, `nicheGeneralFreight`, `nicheHazmat`, `defaultNiche`, `canSendTransfers`, `canReceiveTransfers`, `autoApproveTransfers`, `createdAt`, `updatedAt`, `securityAuditAlerts`, `securityIpWhitelisting`, `securityRetentionDays`, `securitySessionTimeout`, `securityTwoFactorAuth`) VALUES
('1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, 0, NULL, 'as', 'ACTIVE', NULL, NULL, NULL, 0, NULL, 'test@example.com', 'Visa', '4242', '12/2029', NULL, 0, 1, 0, 'General Freight', 1, 1, 0, '2026-08-06 11:43:41.205', '2026-08-07 12:46:44.463', 1, 0, '90 Days', '30 Minutes', 1);

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

--
-- Dumping data for table `company_integration`
--

INSERT INTO `company_integration` (`id`, `companyId`, `providerName`, `integrationType`, `status`, `apiKey`, `lastSync`, `createdAt`, `updatedAt`) VALUES
('35d50827-a1eb-47a4-9e95-d728420b866a', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'Xero Accounting & Invoicing', 'ACCOUNTING', 'CONNECTED', 'xero_oauth_secret_token_12345', '2026-08-07 11:19:25.402', '2026-08-07 11:19:25.523', '2026-08-07 11:19:25.523'),
('600e9933-6522-4610-96f8-acd846e689ca', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'NHVR Electronic Work Diary', 'ELD', 'CONNECTED', '34556786543322334', '2026-08-07 11:25:20.043', '2026-08-07 11:25:20.067', '2026-08-07 11:25:20.067'),
('b443fc13-4abe-48e6-99fb-1ca164c4abf1', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'Stripe Payment Gateway', 'CUSTOM', 'CONNECTED', '3536556', '2026-08-07 11:21:03.367', '2026-08-07 11:21:03.543', '2026-08-07 11:21:03.543');

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

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`id`, `type`, `title`, `companyId`, `createdAt`, `updatedAt`) VALUES
('157a5bb5-fe9b-4b21-bea3-4c58158d416d', 'DIRECT', 'Nilesh Chand (Driver - ANSH 1)', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:30:52.703', '2026-08-07 13:30:52.703'),
('2b229b64-9bf0-4896-b844-e900d7e05032', 'DIRECT', 'Dispatch Team (Sydney Branch)', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:17:15.692', '2026-08-07 13:17:15.692'),
('4ce1d49c-ffa1-48bf-8098-58d4e6dd2102', 'DIRECT', 'Direct Message', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:31:47.539', '2026-08-07 13:31:47.539'),
('a1d04f9d-68aa-4eb5-addd-931792e9f16c', 'DIRECT', 'Dispatch Team (Sydney Branch)', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:23:56.877', '2026-08-07 13:23:56.877'),
('ad2fa85c-aa95-4fb5-9775-0ba5bda6ad59', 'DIRECT', 'Nilesh Chand (Driver - ANSH 1)', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:31:40.570', '2026-08-07 13:31:40.570');

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

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `companyId`, `name`, `abn`, `type`, `status`, `contactName`, `email`, `phone`, `billingTerms`, `transportModules`, `accountManagerId`, `createdAt`, `updatedAt`) VALUES
('014f67e5-8629-46d5-bb04-43920a61dc01', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'ase', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:17:30.031', '2026-08-07 09:17:30.031'),
('1dfdb6be-89e9-495e-a045-f888222012ca', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'asdf', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:12:30.329', '2026-08-07 09:12:30.329'),
('23639071-248a-46f6-9d79-89c645022521', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'awsed', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:28:06.688', '2026-08-07 09:28:06.688'),
('2d1c2a78-14de-400d-b579-469526494475', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'adad', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 08:52:41.486', '2026-08-07 08:52:41.486'),
('3aa30dba-04c3-4de7-9d42-d5080a967547', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'ssssddd', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 07:13:57.950', '2026-08-07 07:13:57.950'),
('47672557-75d3-4c04-a6c1-3255b6252afb', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'General Customer', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-08 11:06:15.125', '2026-08-08 11:06:15.125'),
('70c7dcfd-8ccc-40e4-bfb9-b71af8b1dc62', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'adds', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 08:59:32.851', '2026-08-07 08:59:32.851'),
('7bd99a22-c463-401b-a312-5bfe7a63e326', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'aws', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:13:01.456', '2026-08-07 09:13:01.456'),
('92488ff8-3376-4d7e-bec1-7433ac509cc2', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'as', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 08:52:56.954', '2026-08-07 08:52:56.954'),
('f403a2cb-e375-43a6-8786-19ebc749d97b', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'ass', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 09:24:10.681', '2026-08-07 09:24:10.681'),
('fddc4b7c-05bd-49ec-aa55-4781e85ddf26', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'aa', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 07:13:11.016', '2026-08-07 07:13:11.016'),
('fe251791-3e76-47ef-8a66-37fde8e3f2ec', '1c058eaa-4e42-4713-a26c-08d35ad626fb', 'adad', NULL, 'BUSINESS', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-07 08:52:41.486', '2026-08-07 08:52:41.486');

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

--
-- Dumping data for table `customer_invoice`
--

INSERT INTO `customer_invoice` (`id`, `invoiceNumber`, `customerId`, `loadId`, `status`, `dueDate`, `pdfUrl`, `createdAt`, `updatedAt`, `amount`) VALUES
('1dc19ad6-df3a-4dd4-b6b0-6d2806f7ec78', 'INV-2026-36236', '47672557-75d3-4c04-a6c1-3255b6252afb', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', 'SENT', '2026-08-22 11:06:15.132', NULL, '2026-08-08 11:06:15.135', '2026-08-08 11:06:15.135', 2200);

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

--
-- Dumping data for table `custom_permission`
--

INSERT INTO `custom_permission` (`id`, `roleId`, `module`, `actionString`, `createdAt`) VALUES
('0a3f7750-2a05-4b2c-ba0e-0453664ab722', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Drivers & Roster', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('1c1162f9-11fa-4aaa-b69c-99e8ca6295a3', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'AI Controls & Optimizer', '{\"Manage\":false,\"Edit\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('4275ce26-9a2a-4dd7-a429-7e32ee6ea3db', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'System Settings', '{\"Manage\":false,\"Edit\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('42a7ed07-7597-40a5-a47b-c49ade98c822', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'User Management', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('4c922894-be44-4c4d-9818-8da271e31526', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Inter-Company Transfers', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('5f4f3e37-8d4c-46c9-925a-a69c5e29428a', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Dashboard & Analytics', '{\"Show\":false,\"View\":false,\"Export\":false}', '2026-08-07 09:51:41.147'),
('66807070-a86b-4a42-a59c-8861a5a7c0b0', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Warehouse & Stock', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('6ee1d775-d481-4dbb-bddf-45cba63acb6c', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Support Tickets', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('84196cba-abb7-4d8d-bc07-579dd5969e18', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Companies & Tenants', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('99f5f003-c553-4c3d-8781-15211968f298', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Loads & Dispatch', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('c1b08e29-c36c-4445-9243-e7f515165713', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Billing & Invoices', '{\"Manage\":false,\"Create\":false,\"Edit\":true,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('c585a407-94ee-4e1f-8f64-b7ad4b31032a', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Roles & Permissions', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('ca2874e7-f431-48c3-82ee-1eadcb08e941', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Yard Management', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('cdc238fb-71e3-4151-8180-6be8af5356ef', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'White Label & Branding', '{\"Manage\":false,\"Edit\":false,\"View\":false}', '2026-08-07 09:51:41.147'),
('f39c6008-2787-4e45-b1aa-736f6e26198f', 'ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'Fleet & Vehicles', '{\"Manage\":false,\"Create\":false,\"Edit\":false,\"Delete\":false,\"View\":false}', '2026-08-07 09:51:41.147');

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

--
-- Dumping data for table `custom_role`
--

INSERT INTO `custom_role` (`id`, `name`, `companyId`, `createdAt`, `updatedAt`) VALUES
('ec0ea93e-167e-4156-a3c2-fd8009f04ffa', 'AD', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 09:51:41.147', '2026-08-07 09:51:41.147');

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

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `fileUrl`, `expiryDate`, `driverId`, `vehicleId`, `assetId`, `loadId`, `warehouseId`, `createdAt`, `updatedAt`, `type`) VALUES
('4522280b-9c86-4606-8fac-e032e2ab1e54', '/uploads/documents/HD-Wallpaper-of-Khatu-Shyam-baba-Download.jpg', NULL, NULL, NULL, NULL, '4f50217a-e856-4a7c-8c0f-7eb3f609648b', NULL, '2026-08-08 11:11:09.291', '2026-08-08 11:11:09.291', 'Weighbridge Ticket'),
('f8bfccd4-d73c-4e32-b489-9ae16191a357', '/uploads/documents/HD-Wallpaper-of-Khatu-Shyam-baba-Download.jpg', NULL, NULL, NULL, NULL, '4f50217a-e856-4a7c-8c0f-7eb3f609648b', NULL, '2026-08-08 11:11:09.294', '2026-08-08 11:11:09.294', 'Weighbridge Ticket');

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
  `updatedAt` datetime(3) NOT NULL,
  `warehouseId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `driver`
--

INSERT INTO `driver` (`id`, `driverCode`, `firstName`, `lastName`, `avatarUrl`, `dob`, `gender`, `nationality`, `phone`, `email`, `emergencyContact`, `address`, `city`, `state`, `postalCode`, `status`, `employmentType`, `role`, `category`, `joiningDate`, `shift`, `branchId`, `managerId`, `licenseType`, `licenseNumber`, `licenseState`, `licenseIssueDate`, `licenseExpiry`, `licenseClass`, `licenseDocUrl`, `complianceScore`, `fatigueBreach`, `riskLevel`, `dgCertified`, `hvCertified`, `payType`, `payRate`, `bankName`, `accountNumber`, `routingNumber`, `taxNumber`, `superFund`, `availableFrom`, `preferredVehicle`, `preferredRoutes`, `preferredRegions`, `maxDistPerTripKm`, `weeklyHoursLimit`, `maxHoursPerDay`, `restDaysPerWeek`, `workingDays`, `notes`, `internalComments`, `companyId`, `userId`, `createdAt`, `updatedAt`, `warehouseId`) VALUES
('30412572-2d70-422d-990b-10b2455e4608', 'DRV-006-1c05', 'Sophie', 'Mitchell', NULL, NULL, NULL, NULL, NULL, 'sophie.mitchell.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.803', '2026-08-07 06:18:43.803', NULL),
('4553f30f-07c3-4b35-8d37-f1fe18353ccc', 'STF-3552', 'aas', 'Member', NULL, NULL, NULL, NULL, '+61 400 000 000', NULL, NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Forklift Operator', NULL, NULL, 'Day (06:00 - 14:00)', 'b5709a3f-27e1-4088-9881-2a999c043cba', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100, 0, 'LOW', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-08 09:28:38.001', '2026-08-08 09:28:38.001', '6e076d2b-bc52-4e8a-827b-9d7076827b04'),
('5c07ce9f-e243-4f62-9413-26dd30df1118', 'DRV-004-1c05', 'Mason', 'Brown', NULL, NULL, NULL, NULL, NULL, 'mason.brown.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.783', '2026-08-07 06:18:43.783', NULL),
('6d89e6f1-86f3-41af-a725-57283625ce91', 'DRV-005-1c05', 'Oliver', 'Taylor', NULL, NULL, NULL, NULL, NULL, 'oliver.taylor.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 36, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.794', '2026-08-07 06:18:43.794', NULL),
('6dbe9389-9669-42f2-9e56-a9642c878dcf', 'DRV-003-1c05', 'Ethan', 'Jones', NULL, NULL, NULL, NULL, NULL, 'ethan.jones.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 38.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.767', '2026-08-07 06:18:43.767', NULL),
('7972eac7-f45b-4cbf-9599-6ab9eb132f64', 'DRV-002-1c05', 'Liam', 'Smith', NULL, NULL, NULL, NULL, NULL, 'liam.smith.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.747', '2026-08-07 06:18:43.747', NULL),
('f4f27981-cc10-4878-8e0b-5360a403d609', 'DRV-001-1c05', 'Noah', 'Williams', NULL, NULL, NULL, NULL, NULL, 'noah.williams.1c058e@demo.internal', NULL, NULL, NULL, NULL, NULL, 'AVAILABLE', 'FULL_TIME', 'Driver', NULL, NULL, NULL, 'fce20507-9461-4961-9143-ac4b2a3a2403', NULL, NULL, NULL, NULL, NULL, NULL, 'HC', NULL, 100, 0, 'LOW', 0, 0, 'Hourly', 35, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', NULL, '2026-08-07 06:18:43.733', '2026-08-07 06:18:43.733', NULL);

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
-- Table structure for table `fuel_surcharge_log`
--

CREATE TABLE `fuel_surcharge_log` (
  `id` varchar(191) NOT NULL,
  `rate` double NOT NULL,
  `effectiveDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `setBy` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 0,
  `companyId` varchar(191) NOT NULL,
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

--
-- Dumping data for table `inbound_receipt`
--

INSERT INTO `inbound_receipt` (`id`, `receiptNo`, `supplier`, `referenceNote`, `transportType`, `driverName`, `vehicleRef`, `inboundType`, `status`, `notes`, `stagingAreaId`, `receivingDate`, `warehouseId`, `createdAt`, `updatedAt`) VALUES
('d98a7eec-7222-45b3-88a7-6fd8987bcc70', 'AUTO-557939', 'System', NULL, NULL, NULL, NULL, 'Purchase / Supplier Delivery', 'Completed', NULL, NULL, '2026-08-08 08:09:17.939', '6e076d2b-bc52-4e8a-827b-9d7076827b04', '2026-08-08 08:09:17.986', '2026-08-08 08:09:17.986');

-- --------------------------------------------------------

--
-- Table structure for table `item_movement`
--

CREATE TABLE `item_movement` (
  `id` varchar(191) NOT NULL,
  `itemId` varchar(191) NOT NULL,
  `type` enum('RECEIVE','MOVE','TRANSFER','STAGE','DISPATCH','RETURN','INBOUND','OUTBOUND','ADJUSTMENT') NOT NULL,
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
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `performedAt` datetime(3) DEFAULT current_timestamp(3),
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lane_pricing_rule`
--

CREATE TABLE `lane_pricing_rule` (
  `id` varchar(191) NOT NULL,
  `origin` varchar(191) NOT NULL,
  `destination` varchar(191) NOT NULL,
  `minCharge` double NOT NULL DEFAULT 400,
  `baseLinehaulRate` double NOT NULL DEFAULT 1500,
  `perKmRate` double NOT NULL DEFAULT 2.5,
  `fuelSurcharge` double NOT NULL DEFAULT 14.5,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `effectiveDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
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
  `status` enum('DRAFT','PLANNED','ASSIGNED','IN_TRANSIT','ACTIVE','DELIVERED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
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

--
-- Dumping data for table `load`
--

INSERT INTO `load` (`id`, `draftId`, `loadRef`, `type`, `status`, `priority`, `loadDate`, `notes`, `dispatchNotes`, `deliveryEta`, `pickupStopId`, `sourceType`, `aiExtracted`, `aiConfidence`, `customerId`, `driverId`, `truckId`, `trailerId`, `loadLaneId`, `stagingAreaId`, `companyId`, `createdAt`, `updatedAt`) VALUES
('4f50217a-e856-4a7c-8c0f-7eb3f609648b', NULL, 'PO-12548', 'Dangerous Goods', 'DELIVERED', 'HIGH', NULL, 'No special instructions provided......', 'assdffg', NULL, NULL, 'MANUAL', 0, NULL, NULL, '5c07ce9f-e243-4f62-9413-26dd30df1118', NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 10:35:38.739', '2026-08-08 10:59:09.218'),
('fea8ca59-4dcc-44f2-ae6f-a5763db2c56c', NULL, 'PO-643280', 'Car Carrying', 'DRAFT', 'HIGH', NULL, 'Call 30 mins prior to arrival. Verify VIN number on offloading.', NULL, NULL, NULL, 'EMAIL', 1, 94, NULL, NULL, NULL, NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 11:14:27.583', '2026-08-08 11:14:27.583');

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
  `loadId` varchar(191) DEFAULT NULL,
  `customerId` varchar(191) DEFAULT NULL,
  `pickupStopId` varchar(191) DEFAULT NULL,
  `dropoffStopId` varchar(191) DEFAULT NULL,
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
  `stagingAreaId` varchar(191) DEFAULT NULL,
  `category` varchar(191) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `minQuantity` int(11) DEFAULT 0,
  `quantity` int(11) DEFAULT 0,
  `reservedQty` int(11) DEFAULT 0,
  `sku` varchar(191) DEFAULT NULL,
  `status` varchar(191) DEFAULT NULL,
  `unit` varchar(191) DEFAULT 'EA',
  `unitPrice` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `load_item`
--

INSERT INTO `load_item` (`id`, `loadId`, `customerId`, `pickupStopId`, `dropoffStopId`, `rego`, `vin`, `stockRef`, `make`, `model`, `year`, `color`, `lengthMm`, `widthMm`, `heightMm`, `weightKg`, `vehicleType`, `keys`, `damageReportReq`, `notes`, `aiConfidence`, `warehouseId`, `zone`, `row`, `bay`, `position`, `stockStatus`, `receivedDate`, `inboundReceiptId`, `loadLaneId`, `stagingAreaId`, `category`, `description`, `location`, `minQuantity`, `quantity`, `reservedQty`, `sku`, `status`, `unit`, `unitPrice`) VALUES
('2245c1c8-27aa-41b3-9cb7-eaefd487b3a6', 'fea8ca59-4dcc-44f2-ae6f-a5763db2c56c', NULL, NULL, NULL, 'XYZ789', '1HGBH41JXMN109186', 'XYZ789', 'Ford', 'Ranger', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '{\"stockRef\":\"XYZ789\",\"make\":\"Ford\",\"model\":\"Ranger\",\"rego\":\"XYZ789\",\"vin\":\"1HGBH41JXMN109186\",\"quantity\":1}', NULL, NULL, NULL, NULL, NULL, NULL, 'IN_STORAGE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'EA', 0),
('6d20b8ba-5e87-41a5-a6f8-71ff5c43f935', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', NULL, NULL, NULL, 'ABC234', 'JMM2EJH77A5B00125', 'STK-7900', 'Toyota', 'HiLux', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '{\"id\":1,\"customer\":\"ABC Motors Pty Ltd\",\"pickupStop\":\"Stop#1 - Pickup (123 Smit...)\",\"dropStop\":\"Stop#3 - Drop-off (456 Ja...)\",\"rcog\":\"ABC234\",\"vin\":\"JMM2EJH77A5B00125\",\"stockRec\":\"STK-7900\",\"make\":\"Toyota\",\"model\":\"HiLux\",\"year\":\"2024\",\"colour\":\"White\",\"length\":\"5,325\",\"width\":\"1,955\",\"height\":\"1,875\",\"weight\":\"2,050\",\"vehicleType\":\"Ute / Utility\",\"keys\":\"Yes\",\"damageReport\":\"Yes\",\"notes\":\"\"}', NULL, NULL, NULL, NULL, NULL, NULL, 'IN_STORAGE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'EA', 0),
('fd23f0ed-62fa-406e-9239-fa1027b4ad5b', 'fea8ca59-4dcc-44f2-ae6f-a5763db2c56c', NULL, NULL, NULL, 'ABC234', 'JMM2EJH77A5B00125', 'ABC234', 'Toyota', 'HiLux', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '{\"stockRef\":\"ABC234\",\"make\":\"Toyota\",\"model\":\"HiLux\",\"rego\":\"ABC234\",\"vin\":\"JMM2EJH77A5B00125\",\"quantity\":1}', NULL, NULL, NULL, NULL, NULL, NULL, 'IN_STORAGE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'EA', 0);

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

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `conversationId`, `senderId`, `content`, `loadId`, `attachmentUrl`, `isSystem`, `createdAt`) VALUES
('6321e8eb-8604-4e15-acff-2317b9228e02', '2b229b64-9bf0-4896-b844-e900d7e05032', '435782f3-c60a-4eb6-abc3-0588cf736b33', 'asadf', NULL, NULL, 0, '2026-08-07 13:17:15.708'),
('81bcc115-8a7b-4cd0-b396-ed100589bf1d', 'a1d04f9d-68aa-4eb5-addd-931792e9f16c', '435782f3-c60a-4eb6-abc3-0588cf736b33', 'aws', NULL, NULL, 0, '2026-08-07 13:23:56.886'),
('88508b6a-d305-4aa5-811b-d68e36e7fd08', '157a5bb5-fe9b-4b21-bea3-4c58158d416d', '435782f3-c60a-4eb6-abc3-0588cf736b33', 'aa', NULL, NULL, 0, '2026-08-07 13:30:52.709'),
('b1477898-f0be-4794-83ee-99ba82534ec2', '4ce1d49c-ffa1-48bf-8098-58d4e6dd2102', '435782f3-c60a-4eb6-abc3-0588cf736b33', 'hyy ', NULL, NULL, 0, '2026-08-07 13:31:47.544'),
('fa265d97-5449-4178-9505-af8e6948bbee', 'ad2fa85c-aa95-4fb5-9775-0ba5bda6ad59', '435782f3-c60a-4eb6-abc3-0588cf736b33', 'ss', NULL, NULL, 0, '2026-08-07 13:31:40.586');

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
-- Table structure for table `notification_rule`
--

CREATE TABLE `notification_rule` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `trigger` varchar(191) NOT NULL,
  `channels` varchar(191) NOT NULL DEFAULT 'SMS + Email',
  `recipient` varchar(191) DEFAULT 'Customer & Accounts',
  `priority` varchar(191) NOT NULL DEFAULT 'High',
  `status` varchar(191) NOT NULL DEFAULT 'Enabled',
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_rule`
--

INSERT INTO `notification_rule` (`id`, `name`, `trigger`, `channels`, `recipient`, `priority`, `status`, `companyId`, `createdAt`, `updatedAt`) VALUES
('0c4d478b-cdfc-4f8d-9d75-6ccfa9a4878c', 'aws', 'When Load status changes to DELIVERED', 'SMS + Email', 'Customer & Accounts', 'High', 'Enabled', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:55:30.475', '2026-08-07 11:55:30.475'),
('dab129a3-b7d8-4cd7-a0d7-b98770e8ddb7', 'Overdue POD Customer Alert', 'When Load status changes to DELIVERED', 'SMS + Email', 'Customer & Accounts', 'High', 'Enabled', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:53:52.696', '2026-08-07 11:53:52.696');

-- --------------------------------------------------------

--
-- Table structure for table `notification_template`
--

CREATE TABLE `notification_template` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `channel` varchar(191) NOT NULL DEFAULT 'Email',
  `body` text DEFAULT NULL,
  `category` varchar(191) DEFAULT 'General',
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_template`
--

INSERT INTO `notification_template` (`id`, `title`, `channel`, `body`, `category`, `status`, `companyId`, `createdAt`, `updatedAt`) VALUES
('7645ca76-3846-47b4-9bb9-1ea1bc5061a3', 'Delivery Confirmation SMS', 'SMS', 'Dear {customer_name}, your load #{load_id} is out for delivery...', 'General', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:42:19.486', '2026-08-07 11:42:19.486'),
('86b8b699-ce4b-4ec8-bb0b-d043ec104076', 'awww', 'SMS Gateway', 'cssc', 'Delivery Notifications', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:30:32.686', '2026-08-07 13:30:32.686'),
('8c754534-012a-4397-ac58-53f123bc04f9', 'aa', 'SMS Gateway', 'aaaa', 'Delivery Notifications', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 13:25:48.549', '2026-08-07 13:25:48.549'),
('fab13072-f36b-4754-81aa-c5d09dc442d5', 'awsed', 'SMS & Email', 'd erftg', 'General', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:49:51.297', '2026-08-07 11:49:51.297');

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
-- Table structure for table `payment_gateway_config`
--

CREATE TABLE `payment_gateway_config` (
  `id` varchar(191) NOT NULL,
  `stripeEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `stripePublishableKey` varchar(191) DEFAULT NULL,
  `stripeSecretKey` varchar(191) DEFAULT NULL,
  `paypalEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `achEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `achRoutingNumber` varchar(191) DEFAULT NULL,
  `achAccountNumber` varchar(191) DEFAULT NULL,
  `wireEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `wireBankName` varchar(191) DEFAULT NULL,
  `wireSwiftCode` varchar(191) DEFAULT NULL,
  `wireAccountNumber` varchar(191) DEFAULT NULL,
  `manualEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `manualInstructions` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
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

--
-- Dumping data for table `pay_period`
--

INSERT INTO `pay_period` (`id`, `driverId`, `periodStart`, `periodEnd`, `payDate`, `status`, `basePay`, `loadAllowance`, `distanceAllow`, `otherAllowance`, `bonuses`, `grossEarnings`, `paygTax`, `superAmount`, `unionFees`, `otherDeductions`, `totalDeductions`, `netPay`, `pdfUrl`, `companyId`, `createdAt`, `updatedAt`, `frequency`) VALUES
('0daeaaa1-6c88-4021-8b67-67a2f154e76e', '5c07ce9f-e243-4f62-9413-26dd30df1118', '2026-08-21', '2026-08-20', NULL, 'PAID', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:31.721', 'FORTNIGHTLY'),
('14fa7d85-9eb1-44ed-b95a-66df5fb4c157', '6d89e6f1-86f3-41af-a725-57283625ce91', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('1a868c4f-3eeb-4963-8db5-67272e38fe54', '7972eac7-f45b-4cbf-9599-6ab9eb132f64', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('4b3dbb55-f0b0-4e88-a922-948bb9642397', 'f4f27981-cc10-4878-8e0b-5360a403d609', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('5451452c-67d3-4592-b428-e6f0b21a93b6', '30412572-2d70-422d-990b-10b2455e4608', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('5db9676a-dbd0-41d5-9992-8a647cd965ee', '6dbe9389-9669-42f2-9e56-a9642c878dcf', '2026-08-21', '2026-08-20', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:19.693', 'FORTNIGHTLY'),
('734bc667-62fa-4e9d-ae3d-74a8552d27ac', '30412572-2d70-422d-990b-10b2455e4608', '2026-08-21', '2026-08-20', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:19.693', 'FORTNIGHTLY'),
('8fa3022c-754a-416c-9e5f-a10c99b2cc19', '6dbe9389-9669-42f2-9e56-a9642c878dcf', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('93161c24-b857-4e5f-af62-a51145909119', 'f4f27981-cc10-4878-8e0b-5360a403d609', '2026-08-21', '2026-08-20', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:19.693', 'FORTNIGHTLY'),
('aa9be0f0-c11a-40dc-8d82-9d54e3ee4fdf', '5c07ce9f-e243-4f62-9413-26dd30df1118', '2026-08-18', '2026-08-24', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:18:43.820', '2026-08-07 06:18:43.820', 'FORTNIGHTLY'),
('b7d9af1a-b83b-4694-a74a-502b5ef185eb', '6d89e6f1-86f3-41af-a725-57283625ce91', '2026-08-21', '2026-08-20', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:19.693', 'FORTNIGHTLY'),
('cc331b2f-61b9-4037-9e48-ede1a9d95ffe', '7972eac7-f45b-4cbf-9599-6ab9eb132f64', '2026-08-21', '2026-08-20', NULL, 'DRAFT', 1000, 0, 0, 0, 0, 1000, 200, 110, 0, 0, 310, 690, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 06:19:19.693', '2026-08-07 06:19:19.693', 'FORTNIGHTLY');

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
-- Table structure for table `recipient_group`
--

CREATE TABLE `recipient_group` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `count` varchar(191) DEFAULT '0 members',
  `description` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipient_group`
--

INSERT INTO `recipient_group` (`id`, `name`, `count`, `description`, `status`, `companyId`, `createdAt`, `updatedAt`) VALUES
('40c30ef9-cd6b-4605-bdf8-17ed97f90319', 'Brisbane Yard Supervisors', '0 members', 'Operational contacts for QLD depots.', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:53:58.165', '2026-08-07 11:53:58.165'),
('fb05705b-39c9-4fb7-9cd8-b1951fc23a68', 'aa', '1 member', 'aaaa', 'Active', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:55:41.833', '2026-08-07 11:55:41.833');

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
  `createdBy` varchar(191) DEFAULT NULL,
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `name`, `category`, `description`, `metrics`, `createdBy`, `companyId`, `createdAt`, `updatedAt`) VALUES
('14f7f070-455d-442b-9185-8ec4a348ebe5', 'aaqw2222', 'FINANCIAL', 'Custom report template for aaqw2222', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 05:46:23.982', '2026-08-08 05:46:23.982'),
('2006daf4-f9b1-4ad8-a519-32d5988b0a51', 'ASDFGG', 'OPERATIONS', 'Custom report template for ASDFGG', '[\"Stock Movements\",\"Last 7 Days\",\"Dashboard View\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:41:08.908', '2026-08-08 09:41:08.908'),
('27bef11f-3879-4805-8c2e-279202e53c6e', 'qasa', 'OPERATIONS', 'Custom report template for qasa', '[\"Stock Movements\",\"This Month\",\"PDF Report\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 10:00:10.485', '2026-08-08 10:00:10.485'),
('2d60a1ec-2788-4f72-949a-9f2c5b186b57', 'aws', 'OPERATIONS', 'Custom report template for aws', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 05:42:14.216', '2026-08-08 05:42:14.216'),
('3834b26f-89e1-4afc-af85-8d7cfc0059d4', 'Test KPI Report', 'OPERATIONS', NULL, '[]', '011c265f-967b-4b7c-980c-e48ce5ea632a', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:47:17.196', '2026-08-08 09:47:17.196'),
('4347d80f-490d-4d17-897c-058460d9ea52', 'Monthly Q3 Route Performance', 'OPERATIONS', 'Custom report template for Monthly Q3 Route Performance', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\",\"Driver Hours\"]', '011c265f-967b-4b7c-980c-e48ce5ea632a', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:05:37.860', '2026-08-08 06:05:37.860'),
('4df7eeaf-0db1-4688-bbbf-2d621bb91607', 'Monthly Warehouse KPI Summary', 'OPERATIONS', 'Custom report template for Monthly Warehouse KPI Summary', '[\"Inventory Value\",\"Movements\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:50:06.014', '2026-08-08 09:50:06.014'),
('523aa4f7-f649-4866-bafc-99a9c7395399', 'Admin', 'OPERATIONS', 'Custom report template for Admin', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\",\"Driver Hours\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:10:02.223', '2026-08-08 06:10:02.223'),
('7d98fa3f-56cb-48f3-b329-4e606b03b300', 'w', 'OPERATIONS', 'Custom report template for w', '[\"Gross Revenue\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:07:30.877', '2026-08-08 06:07:30.877'),
('84ef07a9-8100-4c39-b2b2-097178818016', 'ggg', 'OPERATIONS', 'Custom report template for ggg', '[\"Inventory & Stock\",\"Last 7 Days\",\"PDF Report\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:50:37.325', '2026-08-08 09:50:37.325'),
('8fb65a32-47b1-4d8e-88b1-50db3d156fb8', 'asd', 'OPERATIONS', 'Custom report template for asd', '[\"Inventory & Stock\",\"Last 7 Days\",\"PDF Report\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:41:27.661', '2026-08-08 09:41:27.661'),
('99e34e85-f74f-4cdd-bfc2-2f840502c53e', 'aws', 'OPERATIONS', 'Custom report template for aws', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\",\"Driver Hours\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:07:15.798', '2026-08-08 06:07:15.798'),
('9d78d362-60ac-448c-9772-3e64cf872361', 'Test Report', 'OPERATIONS', 'Custom report template for Test Report', '[\"Gross Revenue\",\"Trip Count\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 09:49:30.675', '2026-08-08 09:49:30.675'),
('c7a15690-e407-45c1-a82d-c3e2b00e78d8', 'ss', 'OPERATIONS', 'Custom report template for ss', '[\"Gross Revenue\",\"Trip Count\",\"Fuel Expenses\",\"Driver Hours\"]', '435782f3-c60a-4eb6-abc3-0588cf736b33', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-08 06:01:41.221', '2026-08-08 06:01:41.221');

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

--
-- Dumping data for table `route_stop`
--

INSERT INTO `route_stop` (`id`, `loadId`, `type`, `sequenceIndex`, `address`, `contactName`, `contactPhone`, `scheduledDate`) VALUES
('04bc8e87-541b-4907-bf54-5b4eb85bff79', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', 'PICKUP', 1, '45 Industrial Rd, Geel', 'Mark Davis', '+61 400 123 456', NULL),
('3aeef1fe-e4f7-45af-ab79-fd254d9b2b0f', 'fea8ca59-4dcc-44f2-ae6f-a5763db2c56c', 'PICKUP', 0, '123 Smith St, Melbourne VIC 3000', 'Dispatch Officer', NULL, NULL),
('3eb22045-d624-4b13-b9b8-1b63106f8839', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', 'PICKUP', 0, '123 Smith St, Melbou', 'John Smith', '+61 412 345 670', NULL),
('6a3b959e-1934-49da-9662-88713c77e03a', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', 'DROPOFF', 2, '456 Jones Rd, Sydne', 'Jane Doe', '+61 421 987 654', NULL),
('a6c00d86-a206-4f03-a0af-a53b11deb976', '4f50217a-e856-4a7c-8c0f-7eb3f609648b', 'DROPOFF', 3, '789 Depot Rd, Brisba', 'Peter Brown', '+61 433 221 122', NULL),
('e366d7df-55e3-4366-907c-64e9b92bb77e', 'fea8ca59-4dcc-44f2-ae6f-a5763db2c56c', 'DROPOFF', 1, '456 Jones Rd, Sydney NSW 2000', 'Receiving Manager', NULL, NULL);

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

--
-- Dumping data for table `staging_area`
--

INSERT INTO `staging_area` (`id`, `name`, `status`, `warehouseId`, `createdAt`, `updatedAt`) VALUES
('271f86cf-4074-446e-a6a9-27f46df8a205', '{\"code\":\"asd\",\"name\":\"asd\",\"area\":\"Main Storage\",\"type\":\"Floor\",\"bins\":\"1\",\"cap\":\"100\",\"used\":\"0\",\"util\":\"0%\"}', 'ACTIVE', '6e076d2b-bc52-4e8a-827b-9d7076827b04', '2026-08-08 07:19:22.027', '2026-08-08 07:19:22.027');

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

--
-- Dumping data for table `subscription_plan`
--

INSERT INTO `subscription_plan` (`id`, `name`, `monthlyPrice`, `version`, `status`, `description`, `trialDays`, `usersLimit`, `driversLimit`, `vehiclesLimit`, `branchesLimit`, `storageLimitGB`, `apiCallsLimit`, `createdBy`, `createdAt`, `updatedAt`) VALUES
('3ffb0a6d-74c4-48ad-aca3-acc3fe7cb31e', 'Hero Pro', 499, '1.0.0', 'PUBLISHED', 'Full logistics management & fleet dispatch', 14, 50, 0, 0, 0, 200, 100000, 'System Root', '2026-08-07 12:44:54.722', '2026-08-07 12:44:54.722');

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

--
-- Dumping data for table `support_ticket`
--

INSERT INTO `support_ticket` (`id`, `ticketNumber`, `subject`, `message`, `category`, `priority`, `status`, `assigneeTier`, `resolutionNote`, `assignedAgentId`, `companyId`, `createdAt`, `updatedAt`) VALUES
('a1d07e07-9150-4b3c-8b7e-1d63fe86700e', 1, 'asd', 'aa', 'General Support', 'MEDIUM', 'OPEN', NULL, NULL, NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 09:41:20.141', '2026-08-07 09:41:20.141');

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

--
-- Dumping data for table `tenant_subscription`
--

INSERT INTO `tenant_subscription` (`id`, `subId`, `companyId`, `planId`, `status`, `billingPeriod`, `startDate`, `nextRenewal`, `amount`, `autoRenewal`, `paymentGateway`, `usersQuota`, `storageQuotaGb`, `mostUsedModule`, `createdAt`, `updatedAt`) VALUES
('a4a696bd-03f8-4c7b-8b2e-f829bdb7d35a', 'SUB-1001', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '3ffb0a6d-74c4-48ad-aca3-acc3fe7cb31e', 'ACTIVE', 'ANNUALLY', '2026-08-07 12:44:54.750', '2026-09-06 12:44:54.750', 499, 1, NULL, NULL, NULL, NULL, '2026-08-07 12:44:54.790', '2026-08-07 12:44:54.790');

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

--
-- Dumping data for table `ticket_reply`
--

INSERT INTO `ticket_reply` (`id`, `message`, `ticketId`, `authorId`, `createdAt`, `updatedAt`) VALUES
('fe0abc9f-6afa-45dc-872f-0c2f55a6190f', 'hh', 'a1d07e07-9150-4b3c-8b7e-1d63fe86700e', '011c265f-967b-4b7c-980c-e48ce5ea632a', '2026-08-07 09:42:54.278', '2026-08-07 09:42:54.278');

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
  `updatedAt` datetime(3) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `dob` varchar(191) DEFAULT NULL,
  `emergencyContact` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `userCode`, `phone`, `status`, `customRoleId`, `companyId`, `createdAt`, `updatedAt`, `address`, `dob`, `emergencyContact`) VALUES
('011c265f-967b-4b7c-980c-e48ce5ea632a', 'warehouse@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'WAREHOUSE Demo', 'WAREHOUSE', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.708', '2026-08-06 07:17:26.708', NULL, NULL, NULL),
('02e7e216-0f7a-48b6-b6d2-1b07fb570ba6', 'driver@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'DRIVER Demo', 'DRIVER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.698', '2026-08-06 07:17:26.698', NULL, NULL, NULL),
('0cf996cc-1329-46d3-bec1-b89e19e66d8e', 'customer@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'CUSTOMER Demo', 'CUSTOMER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.740', '2026-08-06 07:17:26.740', NULL, NULL, NULL),
('42841293-bbc8-4d4b-8555-b9064a618c20', 'admin@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'SUPER_ADMIN Demo', 'SUPER_ADMIN', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:15:41.227', '2026-08-06 07:17:26.599', NULL, NULL, NULL),
('435782f3-c60a-4eb6-abc3-0588cf736b33', 'david.m@herologistics.com.au', '$2b$10$UDinoFJ2PmWYwNPln.Vwm.5ex9JWyxhiGjUkgJoyzwzCZ/ASk.vBa', 'David Miller', 'COMPANY_ADMIN', 'US-1010', '+61 400 123 456', 'ACTIVE', NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:10:09.007', '2026-08-07 11:10:09.007', NULL, NULL, NULL),
('4652abea-931b-4d3c-b965-fdadacde1f2a', 'yard@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'YARD Demo', 'YARD', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.719', '2026-08-06 07:17:26.719', NULL, NULL, NULL),
('6eee6e05-8e0b-4a0a-83eb-057bcb98aa5d', 'aa@gmail.com', '$2b$10$2jPMxoZRkaCpQSgv/un57.Lmv82mIYtrLoCvdwGmQCSEwsxfTsxsG', 'ass', 'COMPANY_ADMIN', 'US-1011', '96687999', 'ACTIVE', NULL, '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:10:38.169', '2026-08-07 11:10:38.169', NULL, NULL, NULL),
('b2e6003b-4f08-4380-8232-46a2d1dc252b', 'sales@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'SALES Demo', 'SALES', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.675', '2026-08-06 07:17:26.675', NULL, NULL, NULL),
('bc293d64-3cad-4322-b8e1-d053d3ae085d', 'dispatcher@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'DISPATCHER Demo', 'DISPATCHER', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.688', '2026-08-06 07:17:26.688', NULL, NULL, NULL),
('db2c33fe-e753-4959-8f17-fe8aa0fe2875', 'accounts@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'ACCOUNTS Demo', 'ACCOUNTS', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:17:26.729', '2026-08-06 07:17:26.729', NULL, NULL, NULL),
('f4a2f0a4-46ee-428c-bddb-429bf29f305c', 'company-admin@hero.com', '$2b$10$183C6A3TH5Q9qmz9fYZHauM4xu3rwWWFrMxW8bHy.GiDxQLbDwHp6', 'COMPANY_ADMIN Demo', 'COMPANY_ADMIN', NULL, NULL, 'PENDING', NULL, NULL, '2026-08-06 07:15:41.521', '2026-08-06 07:17:26.666', NULL, NULL, NULL);

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
('22c2b2d0-b7c5-411a-a68f-aba7cae1966d', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 12:05:42.718', NULL, 1, '2026-08-14 12:05:42.685', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDQzNDIsImV4cCI6MTc4NjcwOTE0Mn0.Sfa0553FZ1Yz0e2MjKQkpn066eD2hc8zKSVmMffebmU'),
('2d4d89f7-eead-4d80-af29-ac581b46b393', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 09:23:32.526', NULL, 1, '2026-08-14 09:23:32.525', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwOTQ2MTIsImV4cCI6MTc4NjY5OTQxMn0.A1JAcjVs2aJCt2qUwjaWUhQCzdSj8BkyYxG5Ef4TYNc'),
('3a14f61b-8f52-482a-9037-adc30be94164', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 12:29:47.271', NULL, 1, '2026-08-13 12:29:47.270', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTkzODcsImV4cCI6MTc4NjYyNDE4N30.xuXnVa-ObiJpugkgfLOiAALSqOl9H7MtWNBAUwkZAwk'),
('3b9efc1b-2b70-4f51-907e-ce15b8da7ba8', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 12:28:53.257', NULL, 1, '2026-08-13 12:28:53.241', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTkzMzMsImV4cCI6MTc4NjYyNDEzM30.vYTcwZ9_VC-7PuSKBIOpiaES-yYM7Qji3USyfiLuscE'),
('453a8171-401f-43cb-a4a9-be082a21cf92', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 11:42:40.108', NULL, 1, '2026-08-13 11:42:40.107', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTY1NjAsImV4cCI6MTc4NjYyMTM2MH0.KGfhtytVw1JMrMpeDsCZeRiedhRJJ8QDj-Vzv9XWmb8'),
('5b460913-e87a-44bb-81be-558e220c4b05', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 08:34:18.246', NULL, 1, '2026-08-14 08:34:18.241', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwOTE2NTgsImV4cCI6MTc4NjY5NjQ1OH0.gR7lHnxYTEgVtff7W-uoz3hSR31kvAwgrTTYpPlLti0'),
('60992750-85c4-42be-a623-a70ac0d1453e', '011c265f-967b-4b7c-980c-e48ce5ea632a', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 13:23:28.188', NULL, 1, '2026-08-14 13:23:28.187', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMTFjMjY1Zi05NjdiLTRiN2MtOTgwYy1lNDhjZTVlYTYzMmEiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDkwMDgsImV4cCI6MTc4NjcxMzgwOH0.K5Fyso3wgNy-6ysikBZu11WdSvC3pGhFWUA0CQX37bo'),
('62517394-2b56-48ee-8d4f-72644e2b271a', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 11:45:11.570', NULL, 1, '2026-08-14 11:45:11.537', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDMxMTEsImV4cCI6MTc4NjcwNzkxMX0.xW_MwNc5pNd3i9_bA-6GdJrt8TH7GgPX-KJRFPt15qs'),
('6e3e2aef-b361-4b2c-923b-697763fc066d', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-08 06:44:38.133', NULL, 1, '2026-08-15 06:44:38.098', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxNzE0NzgsImV4cCI6MTc4Njc3NjI3OH0.rVd57qFfU_NYc4oi4QbgoJPnUguZyWDto2vfQlJGxp0'),
('7cb8c7c4-5f59-4dae-8f7e-54af915e3609', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-06 07:33:47.724', NULL, 1, '2026-08-13 07:33:47.720', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMDE2MjcsImV4cCI6MTc4NjYwNjQyN30.BUfAAvhcYrUVGkpP3Y-EHrV7D3s_D6ysOwr6vVQW0nU'),
('7fb83ae3-33a7-4fe6-a8f8-3125732895e8', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 10:19:25.926', NULL, 1, '2026-08-14 10:19:25.907', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwOTc5NjUsImV4cCI6MTc4NjcwMjc2NX0.MZGoyGRNVZIZp9ospPJw45MW_xn8LGqTqrXMeRzqUlA'),
('911f0569-8466-4aa9-a466-15677aace36e', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 11:47:12.225', NULL, 1, '2026-08-13 11:47:12.224', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTY4MzIsImV4cCI6MTc4NjYyMTYzMn0.R7wr9BXj8XofRTCBRzAjL5i1OoKI4tXCwFodq76_6pM'),
('91c80a30-8008-4bea-99e1-534e0e5fedcd', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 12:40:01.714', NULL, 1, '2026-08-14 12:40:01.694', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDY0MDEsImV4cCI6MTc4NjcxMTIwMX0.enKsvzMAGoSuCjWadPIqRaa4cAfJ3acHjnw-mIlRosU'),
('999988e3-2e7c-4f24-bd21-2cc0b16527ea', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 07:31:41.949', NULL, 1, '2026-08-14 07:31:41.947', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwODc5MDEsImV4cCI6MTc4NjY5MjcwMX0.XVV1_bICCssxazycfBS9A2DA5IV8YxNUp7IFqqkcbps'),
('9e319070-21f5-4726-9624-06e022ee1b24', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 13:23:37.394', NULL, 1, '2026-08-14 13:23:37.393', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDkwMTcsImV4cCI6MTc4NjcxMzgxN30.W_6QQy1mxfMw4oRN_d9I32P298NxTQhLJayOlJSERjg'),
('ab221c12-657f-4251-9586-3fbda6794503', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-06 07:23:48.402', NULL, 1, '2026-08-13 07:23:48.399', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMDEwMjgsImV4cCI6MTc4NjYwNTgyOH0.oH0-ZjGltxx7EhefoGdi_LV5WziEDFP8CMVMxHntCtw'),
('acbb6137-4df8-4bb8-b1ae-eadeaea32ee9', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 05:39:19.327', NULL, 1, '2026-08-14 05:39:19.213', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwODExNTksImV4cCI6MTc4NjY4NTk1OX0.50wtkHQHlWoPxxeNhJZ1Gtv3KI6CqRaxGXDSs5jZCF8'),
('ad7caca4-8394-4cba-b7c4-acf833b125ce', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 12:48:09.973', NULL, 1, '2026-08-13 12:48:09.955', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMjA0ODksImV4cCI6MTc4NjYyNTI4OX0.MTA2i-dI_bAFPWdvYk9ir2bPT_VJxdzucXwAKCkizGc'),
('d0ca37bd-e6a9-48c1-98a4-6301dce82014', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 13:28:11.450', NULL, 1, '2026-08-13 13:28:11.429', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMjI4OTEsImV4cCI6MTc4NjYyNzY5MX0.29EYtQbb5ABJZ0HQh5rXtqZRbwLWsBptn_PrXJ6nKhE'),
('d24e3913-450b-41c0-8cdd-ee884621ff3c', 'bc293d64-3cad-4322-b8e1-d053d3ae085d', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 13:22:48.611', NULL, 1, '2026-08-14 13:22:48.608', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYzI5M2Q2NC0zY2FkLTQzMjItYjhlMS1kMDUzZDNhZTA4NWQiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDg5NjgsImV4cCI6MTc4NjcxMzc2OH0.TsTWxss9fej8Y_wPy56viR_mq_4cub_d7uXCHybmAjU'),
('d85c3c85-7bd0-439e-b9ce-e8228e0839e1', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 06:12:01.700', NULL, 1, '2026-08-14 06:12:01.686', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwODMxMjEsImV4cCI6MTc4NjY4NzkyMX0.vh0nhg-lfTlI-ZOuCuW-cqjNPhC9Qgrt1XpKg2Ch8Fo'),
('e1ac4afa-67db-4701-b866-02487eee848a', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 09:07:53.546', NULL, 1, '2026-08-14 09:07:53.543', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwOTM2NzMsImV4cCI6MTc4NjY5ODQ3M30.kfiFcqUEy7PfMIFI5WyPBH6qf0uFe2fFIE5i_Z033wA'),
('e3ba2911-ddca-42bd-8f39-0aafbbd09936', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-08 10:34:58.194', NULL, 1, '2026-08-15 10:34:58.177', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxODUyOTgsImV4cCI6MTc4Njc5MDA5OH0.UuKYcWNhFWKOkI1x0qB_NP6oVgujc3LuAgm3BL_YPRM'),
('e3d7e955-2de0-4b8d-930e-ddf85cfc14c5', '02e7e216-0f7a-48b6-b6d2-1b07fb570ba6', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 12:50:26.250', NULL, 1, '2026-08-14 12:50:26.188', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMmU3ZTIxNi0wZjdhLTQ4YjYtYjZkMi0xYjA3ZmI1NzBiYTYiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDcwMjYsImV4cCI6MTc4NjcxMTgyNn0.qVjhPKrqRJaDjAFDp15rGGZFmL6B9LXXkIVX1q0Ti3M'),
('ec5872fb-5921-4e5b-a831-ab17c56974b6', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 12:52:54.776', NULL, 1, '2026-08-14 12:52:54.743', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYxMDcxNzQsImV4cCI6MTc4NjcxMTk3NH0.CcxDU2_eKS8cIznM8nx6TgGujJH_cSXtPmNUtGINKdM'),
('f383a2ae-dcf3-4b8f-83de-0b12e7202b07', '42841293-bbc8-4d4b-8555-b9064a618c20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-06 11:42:23.833', NULL, 1, '2026-08-13 11:42:23.815', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTY1NDMsImV4cCI6MTc4NjYyMTM0M30.MVAPqsU9QCbrNj8-7s9KmTQkbPZ_guIK71Kw9Wqt0bU'),
('f43c3d17-183e-4206-9401-e813e181de8d', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 09:51:05.486', NULL, 1, '2026-08-14 09:51:05.451', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwOTYyNjUsImV4cCI6MTc4NjcwMTA2NX0.qgYkVd_B1kBj_-PJdEN5L0h42au15EJWV85CHDFcgm0'),
('fada657f-2515-402d-83f8-f8cc9f34c839', 'f4a2f0a4-46ee-428c-bddb-429bf29f305c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-07 07:47:33.233', NULL, 1, '2026-08-14 07:47:33.230', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNGEyZjBhNC00NmVlLTQyOGMtYmRkYi00MjliZjI5ZjMwNWMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwODg4NTMsImV4cCI6MTc4NjY5MzY1M30.vVPGwbSQSY2CL_O3DXq0ugvW_Adk5ScO9jZBHxCWX_M'),
('fb38806e-6291-4e77-8471-b830ef70a384', '42841293-bbc8-4d4b-8555-b9064a618c20', '127.0.0.1', 'test', '2026-08-06 11:41:50.663', NULL, 1, '2026-08-13 11:41:50.577', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Mjg0MTI5My1iYmM4LTRkNGItODU1NS1iOTA2NGE2MThjMjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3ODYwMTY1MTAsImV4cCI6MTc4NjYyMTMxMH0.38I9LDarL-KZnBY6QapQdz0EwobugOvtP_eIGbW3sm8');

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
-- Table structure for table `vehicle_type_rate`
--

CREATE TABLE `vehicle_type_rate` (
  `id` varchar(191) NOT NULL,
  `vehicleType` varchar(191) NOT NULL,
  `capacity` varchar(191) DEFAULT NULL,
  `hourlyRate` double NOT NULL DEFAULT 150,
  `perKmRate` double NOT NULL DEFAULT 2.5,
  `minHours` int(11) NOT NULL DEFAULT 4,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `companyId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
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

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`id`, `code`, `name`, `type`, `status`, `totalAreaSqm`, `palletCapacity`, `loadingDocks`, `features`, `address`, `city`, `state`, `postalCode`, `managerId`, `branchId`, `createdAt`, `updatedAt`) VALUES
('6e076d2b-bc52-4e8a-827b-9d7076827b04', 'asdfghj', 'ABC Pvt Ltd', 'General', 'Active', 66, 455, 455, '[\"Dangerous Goods\",\"Cross-Docking\"]', 'sd, xzcvz, vzcx, ff', 'xzcvz', 'vzcx', 'ff', NULL, 'b5709a3f-27e1-4088-9881-2a999c043cba', '2026-08-08 07:12:06.153', '2026-08-08 10:02:41.563');

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

-- --------------------------------------------------------

--
-- Table structure for table `workflow_rule`
--

CREATE TABLE `workflow_rule` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Invoice Automation',
  `trigger` varchar(191) DEFAULT NULL,
  `action` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Active',
  `lastExecuted` varchar(191) DEFAULT 'Never',
  `executions` int(11) NOT NULL DEFAULT 0,
  `createdBy` varchar(191) DEFAULT 'Sarah Mitchell',
  `companyId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workflow_rule`
--

INSERT INTO `workflow_rule` (`id`, `name`, `description`, `category`, `trigger`, `action`, `status`, `lastExecuted`, `executions`, `createdBy`, `companyId`, `createdAt`, `updatedAt`) VALUES
('0c8e0b61-3654-493e-97e4-a2d80b01b923', 'aaasdd', 'ggtr', 'Invoice Automation', 'Load Status: Delivered', 'Create Invoice & Notify Accounts', 'Active', 'Never', 0, 'Sarah Mitchell', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:16:53.008', '2026-08-07 11:16:53.008'),
('6795e0eb-1f41-48cb-99c1-eab2d2311d05', 'aaa', 'ddfhj', 'Invoice Automation', 'Load Status: Delivered', 'Create Invoice & Notify Accounts', 'Active', 'Never', 0, 'Sarah Mitchell', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:16:41.353', '2026-08-07 11:16:41.353'),
('d6836b06-c982-4123-a0ed-5277bccc886b', 'POD Upload Notification', 'Notify accounts team upon POD upload', 'Invoice Automation', 'Load Status: Delivered', 'Create Invoice & Notify Accounts', 'Active', 'Never', 0, 'Sarah Mitchell', '1c058eaa-4e42-4713-a26c-08d35ad626fb', '2026-08-07 11:14:44.906', '2026-08-07 11:14:44.906');

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
-- Indexes for table `ai_model_registry`
--
ALTER TABLE `ai_model_registry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_model_registry_companyId_fkey` (`companyId`);

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
  ADD KEY `driver_companyId_fkey` (`companyId`),
  ADD KEY `driver_warehouseId_fkey` (`warehouseId`);

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
-- Indexes for table `fuel_surcharge_log`
--
ALTER TABLE `fuel_surcharge_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fuel_surcharge_log_companyId_fkey` (`companyId`);

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
-- Indexes for table `lane_pricing_rule`
--
ALTER TABLE `lane_pricing_rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lane_pricing_rule_companyId_fkey` (`companyId`);

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
  ADD KEY `load_item_customerId_fkey` (`customerId`),
  ADD KEY `load_item_warehouseId_fkey` (`warehouseId`),
  ADD KEY `load_item_inboundReceiptId_fkey` (`inboundReceiptId`),
  ADD KEY `load_item_loadLaneId_fkey` (`loadLaneId`),
  ADD KEY `load_item_stagingAreaId_fkey` (`stagingAreaId`),
  ADD KEY `load_item_loadId_fkey` (`loadId`),
  ADD KEY `load_item_pickupStopId_fkey` (`pickupStopId`),
  ADD KEY `load_item_dropoffStopId_fkey` (`dropoffStopId`);

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
-- Indexes for table `notification_rule`
--
ALTER TABLE `notification_rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_rule_companyId_fkey` (`companyId`);

--
-- Indexes for table `notification_template`
--
ALTER TABLE `notification_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_template_companyId_fkey` (`companyId`);

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
-- Indexes for table `payment_gateway_config`
--
ALTER TABLE `payment_gateway_config`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `recipient_group`
--
ALTER TABLE `recipient_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipient_group_companyId_fkey` (`companyId`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_companyId_fkey` (`companyId`),
  ADD KEY `report_createdBy_fkey` (`createdBy`);

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
-- Indexes for table `vehicle_type_rate`
--
ALTER TABLE `vehicle_type_rate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_type_rate_companyId_fkey` (`companyId`);

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
-- Indexes for table `workflow_rule`
--
ALTER TABLE `workflow_rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow_rule_companyId_fkey` (`companyId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `support_ticket`
--
ALTER TABLE `support_ticket`
  MODIFY `ticketNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `ai_model_registry`
--
ALTER TABLE `ai_model_registry`
  ADD CONSTRAINT `ai_model_registry_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
  ADD CONSTRAINT `driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `driver_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `fuel_surcharge_log`
--
ALTER TABLE `fuel_surcharge_log`
  ADD CONSTRAINT `fuel_surcharge_log_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

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
-- Constraints for table `lane_pricing_rule`
--
ALTER TABLE `lane_pricing_rule`
  ADD CONSTRAINT `lane_pricing_rule_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

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
  ADD CONSTRAINT `load_item_dropoffStopId_fkey` FOREIGN KEY (`dropoffStopId`) REFERENCES `route_stop` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_inboundReceiptId_fkey` FOREIGN KEY (`inboundReceiptId`) REFERENCES `inbound_receipt` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `load` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_loadLaneId_fkey` FOREIGN KEY (`loadLaneId`) REFERENCES `load_lane` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `load_item_pickupStopId_fkey` FOREIGN KEY (`pickupStopId`) REFERENCES `route_stop` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
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
-- Constraints for table `notification_rule`
--
ALTER TABLE `notification_rule`
  ADD CONSTRAINT `notification_rule_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notification_template`
--
ALTER TABLE `notification_template`
  ADD CONSTRAINT `notification_template_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `recipient_group`
--
ALTER TABLE `recipient_group`
  ADD CONSTRAINT `recipient_group_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `report_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `vehicle_type_rate`
--
ALTER TABLE `vehicle_type_rate`
  ADD CONSTRAINT `vehicle_type_rate_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON UPDATE CASCADE;

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

--
-- Constraints for table `workflow_rule`
--
ALTER TABLE `workflow_rule`
  ADD CONSTRAINT `workflow_rule_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
