CREATE TABLE `admin_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`note` text NOT NULL,
	`authorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flight_schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100),
	`city` varchar(100),
	`airport` varchar(100),
	`courses` text,
	`integratedAtpl` boolean DEFAULT false,
	`modularAtpl` boolean DEFAULT false,
	`ppl` boolean DEFAULT false,
	`priceRange` varchar(100),
	`financeAvailable` enum('yes','no','unknown') DEFAULT 'unknown',
	`accommodationAvailable` enum('yes','no','unknown') DEFAULT 'unknown',
	`airlinePartnerships` text,
	`website` varchar(500),
	`contactEmail` varchar(320),
	`phone` varchar(64),
	`description` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flight_schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`schoolId` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(100),
	`notes` text,
	`estimatedValue` int,
	CONSTRAINT `lead_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`country` varchar(100),
	`city` varchar(100),
	`age` int,
	`pilotGoal` varchar(100),
	`seriousness` varchar(100),
	`spokenToSchool` varchar(100),
	`preferredRoute` varchar(100),
	`openToAbroad` varchar(100),
	`fundingMethod` varchar(100),
	`budgetRange` varchar(100),
	`wantsFinanceInfo` varchar(20),
	`educationLevel` varchar(100),
	`class1Medical` varchar(100),
	`flyingExperience` varchar(100),
	`rightToWorkStudy` varchar(50),
	`biggestConcern` varchar(100),
	`startTimeframe` varchar(100),
	`wantsSchoolContact` varchar(10),
	`consentToContact` boolean NOT NULL DEFAULT false,
	`consentToShare` boolean NOT NULL DEFAULT false,
	`writtenAnswer` text,
	`aiSummary` text,
	`aiRoadmap` text,
	`leadScore` int NOT NULL DEFAULT 0,
	`leadCategory` enum('Hot','Warm','Cold') NOT NULL DEFAULT 'Cold',
	`status` enum('New','Reviewed','Contacted','Sent to School','School Interested','Not Suitable','Converted','Archived') NOT NULL DEFAULT 'New',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
