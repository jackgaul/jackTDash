CREATE DATABASE IF NOT EXISTS tickets_db;

USE tickets_db;

DROP TABLE IF EXISTS tickets;


CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    priority VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    description VARCHAR(255),
    raw_text TEXT,
    requesting_user_id INT,
    it_owner_id INT,
    UNIQUE INDEX idx_ticket_id (ticket_id)
);

INSERT INTO tickets (ticket_id, title, status, priority, category, created_at, updated_at, description, raw_text, requesting_user_id, it_owner_id) VALUES
('TICKET-1001', 'Database backup failure', 'open', 'high', 'Database', '2023-04-11 03:15:00', '2023-04-11 07:30:00', 'Nightly database backup job failed to complete', 'Automated backup process for production database cluster failed during overnight run. Error logs show potential disk space issues. Immediate investigation required to ensure data safety.', 201, 1),
('TICKET-1002', 'Windows update deployment issue', 'open', 'high', 'Slack', '2023-04-11 08:00:00', '2023-04-11 09:45:00', 'Critical Windows updates failing to deploy to marketing department machines', 'SCCM reporting 23 workstations in Marketing department failed to receive latest security patches. Error code 0x80070002 appearing in logs. Potential security risk.', 202, 1),
('TICKET-1003', 'Network switch malfunction', 'open', 'high', 'Network', '2023-04-11 07:15:00', '2023-04-11 08:00:00', 'Core switch on 3rd floor showing intermittent failures', 'Switch SW-3F-CORE-01 reporting multiple interface errors. Affecting approximately 50 users on floor 3. Redundant path active but operating at reduced capacity.', 203, 1),
('TICKET-1004', 'Email service not working', 'open', 'high', 'Email', '2023-04-10 09:00:00', '2023-04-10 14:30:00', 'Users are unable to send or receive emails since this morning.', 'Multiple users reported inability to send or receive emails. System-wide email outage affecting all departments. Requires immediate attention.', 101, 1),
('TICKET-1005', 'VPN connection issues', 'in-progress', 'medium', 'Network', '2023-04-09 11:20:00', '2023-04-10 10:15:00', 'Remote workers are experiencing intermittent VPN disconnections.', 'Remote team members reporting frequent VPN drops. Issue appears to be affecting multiple geographic locations. Connection stability varies throughout the day.', 102, 1),
('TICKET-1006', 'New software installation request', 'pending', 'low', 'Software', '2023-04-08 15:45:00', '2023-04-09 09:30:00', 'Marketing department requesting Adobe Creative Suite installation on 5 workstations.', 'Marketing team needs full Adobe Creative Suite installed. Licenses already purchased. Workstations identified: MKT-001 through MKT-005.', 103, 1),
('TICKET-1007', 'Printer not responding', 'open', 'medium', 'Hardware', '2023-04-10 08:30:00', '2023-04-10 08:30:00', 'Main office printer is not responding to print jobs.', 'Main printer (HP-MFP-2024) in building A not accepting print jobs. Print queue shows jobs but nothing printing. No error messages on printer display.', 104, 1),
('TICKET-1008', 'Password reset request', 'closed', 'low', 'Account', '2023-04-09 14:00:00', '2023-04-09 14:15:00', 'User requesting password reset for their account.', 'Standard password reset request. User verified through secondary authentication. Reset completed successfully.', 105, 1),
('TICKET-1009', 'Server maintenance notification', 'in-progress', 'high', 'Server', '2023-04-07 16:20:00', '2023-04-10 11:45:00', 'Scheduled server maintenance notification to all departments.', 'Planned maintenance window for primary application servers. Includes security patches and system updates. Expected downtime: 4 hours.', 106, 1),
('TICKET-1010', 'New employee onboarding', 'pending', 'medium', 'HR', '2023-04-06 10:30:00', '2023-04-08 15:20:00', 'Setup workstation and accounts for new employee starting next week.', 'New hire starting in Marketing department. Needs standard software suite, email account, VPN access, and building access card. Equipment requisition submitted.', 107, 1),
('TICKET-1011', 'Slack integration broken', 'open', 'high', 'Slack', '2023-04-11 10:15:00', '2023-04-11 10:45:00', 'GitHub notifications not appearing in dev-alerts channel', 'GitHub to Slack integration stopped working. No notifications appearing in #dev-alerts channel since 09:30 AM. Development team workflow impacted. Webhook logs show connection timeouts.', 301, 1),
('TICKET-1012', 'Zoom room system offline', 'open', 'high', 'Zoom', '2023-04-11 09:00:00', '2023-04-11 09:30:00', 'Main conference room Zoom system unresponsive', 'Conference Room A Zoom system showing black screen. Multiple failed attempts to restart. Three scheduled meetings impacted. Room calendar shows full booking for today.', 302, 1),
('TICKET-1013', 'Google Drive sync failing', 'in-progress', 'medium', 'Google Workspace', '2023-04-11 08:45:00', '2023-04-11 10:00:00', 'Marketing team unable to sync shared drive', 'Marketing shared drive not syncing for team members. Files showing as "offline only". Network connectivity verified. Affects 12 team members working on current campaign materials.', 303, 1),
('TICKET-1014', 'Slack calls dropping', 'open', 'medium', 'Slack', '2023-04-11 11:00:00', '2023-04-11 11:15:00', 'Users reporting frequent disconnections during Slack calls', 'Multiple reports of audio dropping and call disconnections in Slack. Issue appears network independent. Affects both desktop and mobile users. Started after recent Slack update.', 304, 1),
('TICKET-1015', 'Google Calendar sync delay', 'pending', 'low', 'Google Workspace', '2023-04-11 10:30:00', '2023-04-11 10:45:00', 'Calendar updates taking 30+ minutes to sync across devices', 'Users reporting significant delays in calendar updates appearing across devices. Meeting invites not showing up immediately. No Google Workspace service disruptions reported.', 305, 1),
('TICKET-1016', 'Zoom SSO authentication failed', 'open', 'high', 'Zoom', '2023-04-11 11:30:00', '2023-04-11 11:45:00', 'Unable to login to Zoom using company SSO', 'Company-wide issue with Zoom SSO authentication. Users getting "Authentication Failed" errors. Affecting all new login attempts. SSO working for other services.', 306, 1);



