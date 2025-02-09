SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `business_demand` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `item_name` varchar(200) NOT NULL,
  `quantity_per_month` int(5) NOT NULL COMMENT 'Ammount needed, per month. in kg. ',
  `description` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `expert_profile` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `title` int(200) NOT NULL,
  `services` varchar(300) NOT NULL,
  `description` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `title` int(11) NOT NULL,
  `description` int(11) NOT NULL,
  `keywords` varchar(500) NOT NULL,
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `post_replies` (
  `id` int(11) NOT NULL,
  `of_post` int(11) NOT NULL,
  `replied_by` int(11) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `production_info` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `item_label` varchar(200) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `quantity_per_month` int(11) NOT NULL,
  `costing_per_month` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `contact_num` varchar(24) NOT NULL,
  `country_code` varchar(7) NOT NULL DEFAULT '977',
  `first_name` varchar(20) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(40) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `location_raw` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `business_demand`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

ALTER TABLE `expert_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

ALTER TABLE `post_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `replied_by` (`replied_by`),
  ADD KEY `of_post` (`of_post`);

ALTER TABLE `production_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_contact` (`contact_num`);


ALTER TABLE `business_demand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `expert_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `post_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `production_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `business_demand`
  ADD CONSTRAINT `business_demand_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `expert_profile`
  ADD CONSTRAINT `expert_profile_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `post_replies`
  ADD CONSTRAINT `post_replies_ibfk_1` FOREIGN KEY (`replied_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `post_replies_ibfk_2` FOREIGN KEY (`of_post`) REFERENCES `posts` (`id`);

ALTER TABLE `production_info`
  ADD CONSTRAINT `production_info_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
COMMIT;
