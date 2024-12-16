-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 16, 2024 at 03:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `driveway`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','disputed') NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_id`, `order_id`, `amount`, `status`, `note`, `created_at`, `updated_at`) VALUES
(3, 3, 3500.00, 'pending', 'Initial invoice for modern home design', '2024-12-15 15:35:00', '2024-12-15 15:35:00'),
(4, 4, 5100.00, 'paid', 'Final payment for completed upgrade', '2024-12-18 17:10:00', '2024-12-18 17:10:00'),
(5, 4, 350.00, 'pending', 'Payment overdue', '2024-12-01 11:30:00', '2024-12-15 13:00:00'),
(6, 3, 150.00, 'pending', 'Overdue payment', '2024-12-05 10:00:00', '2024-12-15 14:00:00'),
(7, 3, 25000.00, 'pending', 'thanks', '2024-12-15 20:51:01', '2024-12-15 20:51:01'),
(8, 3, 2000.00, 'pending', 'testing', '2024-12-15 20:53:56', '2024-12-15 20:53:56'),
(9, 3, 12000.00, 'disputed', 'thanks', '2024-12-15 21:10:56', '2024-12-15 21:11:14');

-- --------------------------------------------------------

--
-- Table structure for table `negotiations`
--

CREATE TABLE `negotiations` (
  `negotiation_id` int(11) NOT NULL,
  `type` enum('quote','bill') NOT NULL,
  `parent_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `note` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `negotiations`
--

INSERT INTO `negotiations` (`negotiation_id`, `type`, `parent_id`, `client_id`, `note`, `created_at`) VALUES
(1, 'quote', 1, 0, 'HII', '2024-12-12 17:25:48'),
(2, 'quote', 1, 0, 'hello', '2024-12-12 17:27:44'),
(4, 'quote', 3, 1, 'hello', '2024-12-12 17:34:12'),
(6, 'quote', 2, 1, 'hey', '2024-12-12 18:19:45'),
(7, 'quote', 8, 7, 'Updated design proposal with more details', '2024-12-15 15:20:00'),
(8, 'quote', 9, 9, 'Not accepting the price as the property is not ideal', '2024-12-15 15:25:00'),
(9, 'bill', 4, 10, 'Payment for the completed project', '2024-12-15 15:30:00'),
(10, 'quote', 4, 1, 'hello', '2024-12-15 20:15:17'),
(11, 'quote', 5, 3, 'hii', '2024-12-15 20:16:17'),
(12, 'quote', 5, 1, 'hello', '2024-12-15 20:16:43'),
(13, 'quote', 8, 3, 'hello', '2024-12-15 21:09:31'),
(14, 'quote', 8, 1, 'hello James', '2024-12-15 21:10:10');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `quote_id` int(11) NOT NULL,
  `status` enum('in_progress','completed') NOT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `quote_id`, `status`, `completed_at`) VALUES
(3, 8, 'completed', '2024-12-10 20:40:14'),
(4, 10, 'completed', '2024-12-18 17:00:00'),
(5, 14, 'in_progress', NULL),
(6, 14, 'in_progress', NULL),
(7, 14, 'in_progress', NULL),
(8, 18, 'in_progress', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `quote_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `counter_price` decimal(10,2) NOT NULL,
  `work_time_start` datetime NOT NULL,
  `work_time_end` datetime NOT NULL,
  `note` text DEFAULT NULL,
  `status` enum('pending','accepted','resubmitted','rejected') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`quote_id`, `request_id`, `counter_price`, `work_time_start`, `work_time_end`, `note`, `status`, `created_at`) VALUES
(7, 16, 2600.00, '2024-12-10 10:00:00', '2024-12-10 14:00:00', 'Approved after some negotiation', 'accepted', '2024-12-10 09:00:00'),
(8, 19, 3500.00, '2024-12-16 09:00:00', '2024-12-16 17:00:00', 'Modern design proposal', 'pending', '2024-12-15 15:05:00'),
(9, 20, 4800.00, '2024-12-16 09:00:00', '2024-12-16 17:00:00', 'Renovation and pool installation', 'rejected', '2024-12-15 15:10:00'),
(10, 21, 5100.00, '2024-12-16 09:00:00', '2024-12-16 17:00:00', 'Complete home upgrade', 'accepted', '2024-12-15 15:15:00'),
(12, 18, 2300.00, '2024-12-11 09:00:00', '2024-12-11 15:00:00', 'Accepted after review', 'accepted', '2024-12-11 08:30:00'),
(13, 22, 3000.00, '2024-12-02 18:30:00', '2024-12-15 18:30:00', 'my first test counter', 'accepted', '2024-12-15 18:30:23'),
(14, 3, 3000.00, '2024-12-02 18:30:00', '2024-12-15 18:30:00', 'my first test counter', 'accepted', '2024-12-15 20:02:36'),
(15, 16, 3000.00, '2024-12-02 18:30:00', '2024-12-15 18:30:00', 'my first test counter', 'accepted', '2024-12-15 20:02:43'),
(16, 23, 12000.00, '2024-12-18 20:05:00', '2024-12-17 20:05:00', '', 'accepted', '2024-12-15 20:05:08'),
(17, 3, 12000.00, '2024-12-18 20:32:00', '2024-12-18 20:32:00', '', 'accepted', '2024-12-15 20:32:38'),
(18, 26, 12000.00, '2024-12-16 21:07:00', '2024-12-19 21:07:00', 'pay the bill', 'accepted', '2024-12-15 21:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `property_address` text NOT NULL,
  `square_feet` int(11) NOT NULL,
  `proposed_price` decimal(10,2) NOT NULL,
  `note` text DEFAULT NULL,
  `status` enum('pending','rejected','quoted','negotiating','accepted','closed') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`request_id`, `client_id`, `property_address`, `square_feet`, `proposed_price`, `note`, `status`, `created_at`, `updated_at`) VALUES
(3, 3, '45556876jnhh', 8767676, 9876767.00, '786767', 'accepted', '2024-12-15 15:22:55', '2024-12-15 15:27:37'),
(16, 4, '234 Elm Street, Springfield', 1500, 2500.00, 'Needs renovation', 'accepted', '2024-12-15 10:00:00', '2024-12-15 20:02:43'),
(17, 5, '567 Birch Lane, Downtown', 1800, 3500.00, 'New construction', 'quoted', '2024-12-15 11:30:00', '2024-12-15 11:30:00'),
(18, 6, '123 Cedar Boulevard, Midtown', 1200, 2200.00, 'Old building', 'negotiating', '2024-12-15 12:00:00', '2024-12-15 12:00:00'),
(19, 3, '897 Maple Drive, Greenwood', 1600, 3200.00, 'Looking for a modern home', 'pending', '2024-12-15 14:00:00', '2024-12-15 20:55:21'),
(20, 9, '432 Birch Avenue, Lakeview', 2100, 4500.00, 'Needs a pool', 'rejected', '2024-12-15 14:30:00', '2024-12-15 14:30:00'),
(21, 10, '321 Pinewood Street, Rivercity', 2200, 5000.00, 'New construction', 'quoted', '2024-12-15 15:00:00', '2024-12-15 15:00:00'),
(22, 3, '3234rimdo', 3293290, 49439.00, 'first test', 'accepted', '2024-12-15 18:29:14', '2024-12-15 18:30:23'),
(23, 3, 'detroit', 1234, 12000.00, '', 'accepted', '2024-12-15 20:04:17', '2024-12-15 20:05:08'),
(24, 5, '567 west, Downtown', 1800, 3500.00, 'old construction', 'pending', '2024-12-15 11:30:00', '2024-12-15 11:30:00'),
(25, 5, '567 ber, Downtown', 1800, 3500.00, 'New', 'pending', '2024-12-15 11:30:00', '2024-12-15 11:30:00'),
(26, 3, 'detroit', 300, 12000.00, 'driveway', 'accepted', '2024-12-15 21:06:51', '2024-12-15 21:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `client_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `credit_card_info` text NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`client_id`, `first_name`, `last_name`, `address`, `credit_card_info`, `phone_number`, `email`, `password`, `user_type`) VALUES
(1, 'David', 'Smith', '234 valhalla, Asgard.', '3124542352345342', '4524351451', 'david@gmail.com', '$2b$10$6YEGcIMVPUm8wj4tX1in5Oe/uSy58OUj6xcTLHVaT3RG9nnYpa8oC', 1),
(3, 'James', 'Akintunde', '4500 cass avenue', '4738294726482946', '2847584920', 'akintunde1201@gmail.com', '$2b$10$gERAlbAQu/ytFtMcV8MYMufT7ojodGCLRinZhzxZU0uhYIvyZYL3u', 2),
(4, 'Alice', 'Johnson', '123 Maple Street, Springfield', '1234567812345678', '5551234567', 'alice.johnson@example.com', '$2b$10$8d5Mbd6r44RzGLYuGjZH1TgnP1zYPyFqI1VEl8vXy8lAjiYOcLg8u', 1),
(5, 'Bob', 'Martinez', '456 Oak Avenue, Metropolis', '2345678923456789', '5552345678', 'bob.martinez@example.com', '$2b$10$D8Qjzn31ekZXDNb3h8U8WoIh/WP6KbAPQ.O4g0N6xkP80UyeyVu3u', 2),
(6, 'Catherine', 'Lopez', '789 Pine Drive, Gotham', '3456789034567890', '5553456789', 'catherine.lopez@example.com', '$2b$10$eH7QmMnTHT9jlXHi84qJg.k6tNBlX2Y9qVXg6GmXmwRHzOBZ.WDce', 2),
(7, 'Eve', 'Davis', '987 Willow Lane, Smalltown', '4763829383748483', '5559876543', 'eve.davis@example.com', '$2b$10$Oeq1v9J8LMeDDYgOcNkg3R66MnKDJ.fhoMBdtfcMCc3qFTjMGH67O', 1),
(8, 'Liam', 'Brown', '321 Elm Avenue, Rivertown', '4938209384827482', '5554561234', 'liam.brown@example.com', '$2b$10$G9WlKZW4yWlvFzFvLZKLXkD4fzZjvBiDTmQd5oaZ0F9ijHeh0QwCu', 2),
(9, 'Sophia', 'Williams', '654 Pine Road, New City', '5897638294837627', '5557654321', 'sophia.williams@example.com', '$2b$10$X3DiGRxBzz8G6vB8Zm8Qz2tPDRXIY0k12S3nv3GyD0C8aW4Q/OwEu', 1),
(10, 'Mason', 'Taylor', '789 Oak Drive, Uptown', '5638294829837463', '5556781234', 'mason.taylor@example.com', '$2b$10$nlZGAtuyh0MlX4B8w7Ors/RMfS9ah66vxtP0AfWreOckAy5f0zHk8', 2),
(11, 'Olivia', 'Martinez', '123 Cedar Lane, Westfield', '7329487239847293', '5554325678', 'olivia.martinez@example.com', '$2b$10$PVwJm57v9m8Zp9XQJ.MFJtGBggE5oQgUbApoJLfpQlwCFZlTkjKkC', 1),
(12, 'Tom', 'Harris', '1234 Sunset Blvd, Los Angeles', '1234567812345678', '5559876543', 'tom.harris@domain.com', '$2b$10$9zM8s5I9Z8Dd3pZsLt9NeEcOeVeeh1o9jDqfGhFchVHQgxuZ1S9Aq', 1),
(13, 'Eva', 'Williams', '567 Oak St, Dallas', '8765432187654321', '5554321987', 'eva.williams@domain.com', '$2b$10$UJndzMzvsCmMeSPmJ7bXlWFLd29z7OlqT7F04mlrbb.fJ0JpM8OCY', 2),
(14, 'Grace', 'Lee', '890 Pine Street, Seattle', '2345678923456789', '5556789021', 'grace.lee@domain.com', '$2b$10$7SYvlhbcXJfyloSYuS9DB0fXyWqzR4zOtbkWklzAmYTp6p6dC6aCG', 1),
(15, 'Jack', 'Brown', '432 Maple Avenue, Chicago', '3456789034567890', '5557654321', 'jack.brown@domain.com', '$2b$10$OK7OnAv91S58eXs9iI8mn3sStYqfGiI0kQklE.Ak7JdR6J6kvOYjS', 2),
(16, 'Sophia', 'Miller', '678 Birch Lane, Boston', '1231231231231234', '5551231234', 'sophia.miller@domain.com', '$2b$10$lkdYx7A2m9Ox0kFkgrb3XzG.WDtnq.M6o9jYePQx0d8lLg1IkaA6a', 1),
(17, 'Oliver', 'Davis', '987 Cedar Street, San Francisco', '4321432143214321', '5553213211', 'oliver.davis@domain.com', '$2b$10$6o5N9JYbcXKhcn2IGx6nOq99zOajZmgV9Vz3Hq9rXyDKQmjkskG7S', 2),
(18, 'Liam', 'Wilson', '321 Birch Road, New York', '5678567856785678', '5554321987', 'liam.wilson@domain.com', '$2b$10$5hzFEu3UxiAtZZOplFCa6v1cVY5hLFMfbaAqFO3EFM8qJ4kmpkE2i', 1),
(19, 'Amelia', 'Martinez', '234 Pine Street, Miami', '6789678967896789', '5556578901', 'amelia.martinez@domain.com', '$2b$10$4mFdEF9OSfGbYPn5zYtHeQFZ4TnET7FytjN2gxOSZ0r1uK1bCZ7G0', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `negotiations`
--
ALTER TABLE `negotiations`
  ADD PRIMARY KEY (`negotiation_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `quote_id` (`quote_id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`quote_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `negotiations`
--
ALTER TABLE `negotiations`
  MODIFY `negotiation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `quote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`quote_id`);

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`request_id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`client_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
