-- Migration 0010: Add flight_deck_email_captures and school_subscriptions tables

CREATE TABLE `flight_deck_email_captures` (
  `id` int AUTO_INCREMENT NOT NULL,
  `email` varchar(320) NOT NULL,
  `name` varchar(200),
  `phase` varchar(50),
  `score` int,
  `biggestBarrier` varchar(100),
  `consentToContact` boolean NOT NULL DEFAULT false,
  `source` varchar(100) DEFAULT 'flight_deck_results',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `flight_deck_email_captures_id` PRIMARY KEY(`id`)
);

CREATE TABLE `school_subscriptions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `schoolId` int NOT NULL,
  `tier` enum('basic','featured','premium') NOT NULL DEFAULT 'basic',
  `status` enum('active','trialing','past_due','cancelled','pending') NOT NULL DEFAULT 'pending',
  `stripeCustomerId` varchar(255),
  `stripeSubscriptionId` varchar(255),
  `leadCreditsUsed` int NOT NULL DEFAULT 0,
  `leadCreditsLimit` int NOT NULL DEFAULT 0,
  `billingEmail` varchar(320),
  `activatedAt` timestamp,
  `expiresAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `school_subscriptions_id` PRIMARY KEY(`id`),
  CONSTRAINT `school_subscriptions_schoolId_unique` UNIQUE(`schoolId`)
);
