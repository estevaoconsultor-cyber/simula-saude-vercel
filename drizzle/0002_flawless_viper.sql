CREATE TABLE `access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brokerId` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broker_quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brokerId` int NOT NULL,
	`companyName` varchar(255),
	`expectedDate` varchar(20),
	`quoteData` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `broker_quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broker_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brokerId` int NOT NULL,
	`sessionToken` varchar(512) NOT NULL,
	`deviceFingerprint` varchar(255) NOT NULL,
	`deviceName` varchar(255),
	`lastIp` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `broker_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `broker_sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `brokers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`profile` enum('vendedor','dono_corretora','adm','supervisor') NOT NULL,
	`sellerCode` varchar(50),
	`brokerageCode` varchar(50),
	`brokerageName` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastLoginAt` timestamp,
	CONSTRAINT `brokers_id` PRIMARY KEY(`id`),
	CONSTRAINT `brokers_email_unique` UNIQUE(`email`)
);
