CREATE TABLE `licence_quiz_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`goal` varchar(50),
	`timeCommitment` varchar(50),
	`budget` varchar(50),
	`wantsCommercial` varchar(50),
	`experience` varchar(50),
	`location` varchar(50),
	`speedPriority` varchar(50),
	`mainPriority` varchar(50),
	`recommendedLicence` varchar(50) NOT NULL,
	`email` varchar(320),
	`consentToContact` boolean NOT NULL DEFAULT false,
	`proceededToMainQuiz` boolean NOT NULL DEFAULT false,
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `licence_quiz_leads_id` PRIMARY KEY(`id`)
);
