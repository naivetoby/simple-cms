-- ----------------------------
--  Table structure for `t_department`
-- ----------------------------
DROP TABLE IF EXISTS `t_department`;
CREATE TABLE `t_department` (
  `dept_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dept_pid` bigint(20) DEFAULT NULL,
  `dept_name` varchar(50) DEFAULT NULL,
  `remark` varchar(4000) DEFAULT NULL,
  `index_number` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Table structure for `t_log`
-- ----------------------------
DROP TABLE IF EXISTS `t_log`;
CREATE TABLE `t_log` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `client_ip` varchar(50) DEFAULT NULL,
  `action` longtext,
  `log_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `module_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Table structure for `t_module`
-- ----------------------------
DROP TABLE IF EXISTS `t_module`;
CREATE TABLE `t_module` (
  `module_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) DEFAULT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `view_info` varchar(4000) DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  `view_type` int(11) NOT NULL DEFAULT '0',
  `icon` varchar(100) DEFAULT NULL,
  `index_number` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Records of `t_module`
-- ----------------------------
BEGIN;
INSERT INTO `t_module` VALUES ('1', '0', '系统管理', '', 'System', '-1', '', '1'), ('2', '1', '模块管理', 'eyJzdG9yZSI6ImNvcmUubW9kdWxlLk1vZHVsZXMiLCJjb250cm9sbGVyIjoiY29yZS5tb2R1bGUuTW9kdWxlQ29udHJvbGxlciIsImNvbmZpZyI6eyJwYWdlU2l6ZSI6ODAsInNvcnRQbHVnaW4iOnRydWUsImZvcm0iOnsidmlldyI6ImRpYWxvZyIsIm5hbWUiOiJPQS52aWV3LmNvcmUubW9kdWxlLk1vZHVsZURpYWxvZyIsImFsaWFzIjoibW9kdWxlZGlhbG9nIn0sInRvb2xzIjpbeyJ0ZXh0IjoiXHU2ZGZiXHU1MmEwXHU2MzA5XHU5NGFlIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkFkZFRvb2wiLCJhbGlhcyI6ImFkZHRvb2wiLCJhdXRoIjoxfSx7InRleHQiOiJcdTUyMjBcdTk2NjRcdTYzMDlcdTk0YWUiLCJuYW1lIjoiT0EucGFydHMuY29yZS5ncmlkdG9vbHMuRGVsVG9vbCIsImFsaWFzIjoiZGVsdG9vbCIsImF1dGgiOjF9LHsidGV4dCI6Ilx1NjdlNVx1OGJlMlx1NjMwOVx1OTRhZSIsIm5hbWUiOiJPQS5wYXJ0cy5jb3JlLmdyaWR0b29scy5GaWx0ZXJUb29sIiwiYWxpYXMiOiJmaWx0ZXJ0b29sIiwiYXV0aCI6MH0seyJ0ZXh0IjoiXHU1YmZjXHU1MWZhRXhjZWwiLCJuYW1lIjoiT0EucGFydHMuY29yZS5ncmlkdG9vbHMuRXhjZWxUb29sIiwiYWxpYXMiOiJleGNlbHRvb2wiLCJhdXRoIjowfV0sImNvbHVtbnMiOlt7InRleHQiOiJcdTk4N2FcdTVlOGZcdTUzZjciLCJkYXRhSW5kZXgiOiJpbmRleE51bWJlciIsImZsZXgiOjEsInNvcnRhYmxlIjp0cnVlfSx7InRleHQiOiJNb2R1bGUiLCJkYXRhSW5kZXgiOiJtb2R1bGUiLCJmbGV4IjoxLCJzb3J0YWJsZSI6dHJ1ZX0seyJ0ZXh0IjoiXHU2YTIxXHU1NzU3XHU1NDBkXHU3OWYwIiwiZGF0YUluZGV4IjoibW9kdWxlTmFtZSIsImZsZXgiOjEsInNvcnRhYmxlIjp0cnVlfSx7InRleHQiOiJcdTRlMGFcdTdlYTdcdTc2ZWVcdTVmNTUiLCJkYXRhSW5kZXgiOiJwYXJlbnROYW1lIiwiZmxleCI6MSwic29ydGFibGUiOnRydWV9LHsidGV4dCI6Ilx1NmEyMVx1NTc1N1x1N2M3Ylx1NTc4YiIsImRhdGFJbmRleCI6InZpZXdUeXBlIiwiZmxleCI6MSwicmVuZGVyZXIiOlJlbmRlcmVycy5tb2R1bGVWaWV3VHlwZVJlbmRlcmVyLCJzb3J0YWJsZSI6ZmFsc2V9XX19', 'Module', '-2', '', '2'), ('3', '1', '部门管理', 'eyJzdG9yZSI6ImNvcmUuZGVwYXJ0bWVudC5EZXBhcnRtZW50cyIsImNvbnRyb2xsZXIiOiJjb3JlLmRlcGFydG1lbnQuRGVwYXJ0bWVudENvbnRyb2xsZXIiLCJjb25maWciOnsicGFnZVNpemUiOjgwLCJzb3J0UGx1Z2luIjp0cnVlLCJmb3JtIjp7InZpZXciOiJkaWFsb2ciLCJuYW1lIjoiT0Eudmlldy5jb3JlLmRlcGFydG1lbnQuRGVwdERpYWxvZyIsImFsaWFzIjoiZGVwdGRpYWxvZyJ9LCJ0b29scyI6W3sidGV4dCI6Ilx1NmRmYlx1NTJhMFx1NjMwOVx1OTRhZSIsIm5hbWUiOiJPQS5wYXJ0cy5jb3JlLmdyaWR0b29scy5BZGRUb29sIiwiYWxpYXMiOiJhZGR0b29sIiwiYXV0aCI6MX0seyJ0ZXh0IjoiXHU1MjIwXHU5NjY0XHU2MzA5XHU5NGFlIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkRlbFRvb2wiLCJhbGlhcyI6ImRlbHRvb2wiLCJhdXRoIjoxfSx7InRleHQiOiJcdTY3ZTVcdThiZTJcdTYzMDlcdTk0YWUiLCJuYW1lIjoiT0EucGFydHMuY29yZS5ncmlkdG9vbHMuRmlsdGVyVG9vbCIsImFsaWFzIjoiZmlsdGVydG9vbCIsImF1dGgiOjB9LHsidGV4dCI6Ilx1NWJmY1x1NTFmYUV4Y2VsIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkV4Y2VsVG9vbCIsImFsaWFzIjoiZXhjZWx0b29sIiwiYXV0aCI6MH1dLCJjb2x1bW5zIjpbeyJ0ZXh0IjoiXHU5ODdhXHU1ZThmXHU1M2Y3IiwiZGF0YUluZGV4IjoiaW5kZXhOdW1iZXIiLCJmbGV4IjoxLCJzb3J0YWJsZSI6dHJ1ZX0seyJ0ZXh0IjoiXHU5MGU4XHU5NWU4XHU1NDBkXHU3OWYwIiwiZGF0YUluZGV4IjoiZGVwdE5hbWUiLCJmbGV4IjoxLCJzb3J0YWJsZSI6dHJ1ZX0seyJ0ZXh0IjoiXHU0ZTBhXHU3ZWE3XHU5MGU4XHU5NWU4IiwiZGF0YUluZGV4IjoicGFyZW50TmFtZSIsImZsZXgiOjEsInNvcnRhYmxlIjp0cnVlfV19fQ==', 'Department', '-2', '', '3'), ('4', '1', '用户管理', 'eyJzdG9yZSI6ImNvcmUudXNlci5Vc2VycyIsImNvbnRyb2xsZXIiOiJjb3JlLnVzZXIuVXNlckNvbnRyb2xsZXIiLCJjb25maWciOnsicGFnZVNpemUiOjgwLCJmb3JtIjp7InZpZXciOiJkaWFsb2ciLCJuYW1lIjoiT0Eudmlldy5jb3JlLnVzZXIuVXNlclJlZ2lzdERpYWxvZyIsImFsaWFzIjoidXNlcnJlZ2lzdGRpYWxvZyJ9LCJ0b29scyI6W3sidGV4dCI6Ilx1NmRmYlx1NTJhMFx1NjMwOVx1OTRhZSIsIm5hbWUiOiJPQS5wYXJ0cy5jb3JlLmdyaWR0b29scy5BZGRUb29sIiwiYWxpYXMiOiJhZGR0b29sIiwiYXV0aCI6MX0seyJ0ZXh0IjoiXHU1MjIwXHU5NjY0XHU2MzA5XHU5NGFlIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkRlbFRvb2wiLCJhbGlhcyI6ImRlbHRvb2wiLCJhdXRoIjoxfSx7InRleHQiOiJcdTY3ZTVcdThiZTJcdTYzMDlcdTk0YWUiLCJuYW1lIjoiT0EucGFydHMuY29yZS5ncmlkdG9vbHMuRmlsdGVyVG9vbCIsImFsaWFzIjoiZmlsdGVydG9vbCIsImF1dGgiOjB9LHsidGV4dCI6Ilx1NWJmY1x1NTFmYUV4Y2VsIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkV4Y2VsVG9vbCIsImFsaWFzIjoiZXhjZWx0b29sIiwiYXV0aCI6MH1dLCJjb2x1bW5zIjpbeyJ0ZXh0IjoiXHU5ODdhXHU1ZThmXHU1M2Y3IiwiZGF0YUluZGV4IjoiaW5kZXhOdW1iZXIiLCJmbGV4IjoxLCJzb3J0YWJsZSI6dHJ1ZSwiZXh0cmFQYXJhbSI6IiJ9LHsidGV4dCI6Ilx1NzUyOFx1NjIzN1x1NTQwZCIsImRhdGFJbmRleCI6InVzZXJOYW1lIiwiZmxleCI6MSwic29ydGFibGUiOnRydWUsImV4dHJhUGFyYW0iOiIifSx7InRleHQiOiJcdTYyNGJcdTY3M2FcdTUzZjciLCJkYXRhSW5kZXgiOiJwaG9uZXMiLCJzb3J0YWJsZSI6ZmFsc2UsImZsZXgiOjEsImV4dHJhUGFyYW0iOiIifSx7InRleHQiOiJcdTc2N2JcdTk2NDZcdTU0MGQiLCJkYXRhSW5kZXgiOiJsb2dpbk5hbWUiLCJmbGV4IjoxLCJzb3J0YWJsZSI6dHJ1ZSwiZXh0cmFQYXJhbSI6IiJ9LHsidGV4dCI6Ilx1NzJiNlx1NjAwMSIsImRhdGFJbmRleCI6InN0YXR1cyIsImZsZXgiOjEsInJlbmRlcmVyIjpSZW5kZXJlcnMudXNlclN0YXR1c1JlbmRlcmVyLCJzb3J0YWJsZSI6dHJ1ZSwiZXh0cmFQYXJhbSI6IiJ9LHsidGV4dCI6Ilx1NjI0MFx1NWM1ZVx1OTBlOFx1OTVlOCIsImRhdGFJbmRleCI6ImRlcHROYW1lIiwiZmxleCI6MSwic29ydGFibGUiOnRydWUsImV4dHJhUGFyYW0iOiIifSx7InRleHQiOiJcdTYyNDBcdTVjNWVcdTg5ZDJcdTgyNzIiLCJkYXRhSW5kZXgiOiJyb2xlcyIsImZsZXgiOjMsInJlbmRlcmVyIjpSZW5kZXJlcnMuY29tbW9uVG9vbHRpcFJlbmRlcmVyLCJzb3J0YWJsZSI6ZmFsc2UsImV4dHJhUGFyYW0iOiIifV19fQ==', 'User', '-2', '', '4'), ('5', '1', '角色管理', 'eyJzdG9yZSI6ImNvcmUucm9sZS5Sb2xlcyIsImNvbnRyb2xsZXIiOiJjb3JlLnJvbGUuUm9sZUNvbnRyb2xsZXIiLCJjb25maWciOnsicGFnZVNpemUiOjgwLCJzb3J0UGx1Z2luIjp0cnVlLCJmb3JtIjp7InZpZXciOiJkaWFsb2ciLCJuYW1lIjoiT0EuY29yZS52aWV3LnJvbGUuUm9sZURpYWxvZyIsImFsaWFzIjoicm9sZWRpYWxvZyJ9LCJ0b29scyI6W3sidGV4dCI6Ilx1NmRmYlx1NTJhMFx1NjMwOVx1OTRhZSIsIm5hbWUiOiJPQS5wYXJ0cy5jb3JlLmdyaWR0b29scy5BZGRUb29sIiwiYWxpYXMiOiJhZGR0b29sIiwiYXV0aCI6MX0seyJ0ZXh0IjoiXHU1MjIwXHU5NjY0XHU2MzA5XHU5NGFlIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkRlbFRvb2wiLCJhbGlhcyI6ImRlbHRvb2wiLCJhdXRoIjoxfSx7InRleHQiOiJcdTY3ZTVcdThiZTJcdTYzMDlcdTk0YWUiLCJuYW1lIjoiT0EucGFydHMuY29yZS5ncmlkdG9vbHMuRmlsdGVyVG9vbCIsImFsaWFzIjoiZmlsdGVydG9vbCIsImF1dGgiOjB9LHsidGV4dCI6Ilx1NWJmY1x1NTFmYUV4Y2VsIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkV4Y2VsVG9vbCIsImFsaWFzIjoiZXhjZWx0b29sIiwiYXV0aCI6MH1dLCJjb2x1bW5zIjpbeyJ0ZXh0IjoiXHU5ODdhXHU1ZThmXHU1M2Y3IiwiZGF0YUluZGV4IjoiaW5kZXhOdW1iZXIiLCJmbGV4IjoyLCJzb3J0YWJsZSI6dHJ1ZSwiZXh0cmFQYXJhbSI6IiJ9LHsidGV4dCI6Ilx1ODlkMlx1ODI3Mlx1NTQwZFx1NzlmMCIsImRhdGFJbmRleCI6InJvbGVOYW1lIiwiZmxleCI6NCwic29ydGFibGUiOnRydWV9LHsidGV4dCI6Ilx1ODlkMlx1ODI3Mlx1OGJmNFx1NjYwZSIsImRhdGFJbmRleCI6InJvbGVEZXNjcmlwdGlvbiIsImZsZXgiOjE4LCJyZW5kZXJlciI6UmVuZGVyZXJzLmNvbW1vblRvb2x0aXBSZW5kZXJlciwic29ydGFibGUiOnRydWV9XX19', 'Role', '-2', '', '5'), ('6', '1', '日志审计', 'eyJzdG9yZSI6ImNvcmUubG9nLkxvZ3MiLCJjb250cm9sbGVyIjoiY29yZS5sb2cuTG9nQ29udHJvbGxlciIsImNvbmZpZyI6eyJwYWdlU2l6ZSI6ODAsInRvb2xzIjpbeyJ0ZXh0IjoiXHU2N2U1XHU4YmUyIiwibmFtZSI6Ik9BLnBhcnRzLmNvcmUuZ3JpZHRvb2xzLkZpbHRlclRvb2wiLCJhbGlhcyI6ImZpbHRlcnRvb2wiLCJhdXRoIjowfSx7InRleHQiOiJcdTViZmNcdTUxZmFFeGNlbCIsIm5hbWUiOiJPQS5wYXJ0cy5jb3JlLmdyaWR0b29scy5FeGNlbFRvb2wiLCJhbGlhcyI6ImV4Y2VsdG9vbCIsImF1dGgiOjB9XSwiY29sdW1ucyI6W3sidGV4dCI6Ilx1NWJhMlx1NjIzN1x1N2FlZklQIiwiZGF0YUluZGV4IjoiY2xpZW50SXAiLCJmbGV4IjoyLCJzb3J0YWJsZSI6dHJ1ZX0seyJ0ZXh0IjoiXHU3NTI4XHU2MjM3XHU1NDBkIiwiZGF0YUluZGV4IjoidXNlck5hbWUiLCJmbGV4IjoxLCJyZW5kZXJlciI6UmVuZGVyZXJzLmxvZ1VzZXJOYW1lUmVuZGVyZXIsInNvcnRhYmxlIjp0cnVlfSx7InRleHQiOiJcdTc2N2JcdTVmNTVcdTU0MGQiLCJkYXRhSW5kZXgiOiJsb2dpbk5hbWUiLCJmbGV4IjoxLCJyZW5kZXJlciI6UmVuZGVyZXJzLmxvZ0xvZ2luTmFtZVJlbmRlcmVyLCJzb3J0YWJsZSI6dHJ1ZX0seyJ0ZXh0IjoiXHU2YTIxXHU1NzU3IiwiZGF0YUluZGV4IjoibW9kdWxlTmFtZSIsImZsZXgiOjEsInNvcnRhYmxlIjp0cnVlfSx7InRleHQiOiJcdTY1ZTVcdTVmZDdcdTRmZTFcdTYwNmYiLCJkYXRhSW5kZXgiOiJhY3Rpb24iLCJmbGV4Ijo0LCJyZW5kZXJlciI6UmVuZGVyZXJzLmNvbW1vblRvb2x0aXBSZW5kZXJlciwic29ydGFibGUiOmZhbHNlfSx7InRleHQiOiJcdTY1ZTVcdTVmZDdcdTY1ZjZcdTk1ZjQiLCJkYXRhSW5kZXgiOiJsb2dUaW1lIiwiZmxleCI6MiwicmVuZGVyZXIiOkV4dC51eC5KQ0RhdGVGb3JtYXQuZGF0YVJlbmRlcmVyKCd5eXl5LU1NLWRkIGhoOm1tOnNzJyksInNvcnRhYmxlIjp0cnVlfV19fQ==', 'Log', '-2', '', '6');
COMMIT;

-- ----------------------------
--  Table structure for `t_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role` (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_type` int(11) NOT NULL DEFAULT '1' COMMENT '角色类型（1:普通角色,2:系统管理员,3:安全保密管理员,4;日志管理员）',
  `auth_info` varchar(4000) NOT NULL DEFAULT 'eyIwIjp7fX0=',
  `index_number` int(11) NOT NULL DEFAULT '1',
  `role_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Records of `t_role`
-- ----------------------------
BEGIN;
INSERT INTO `t_role` VALUES ('1', '系统管理员', '2', 'eyIwIjp7IjEiOnsiMyI6MSwiNCI6MX19fQ==', '1', '负责用户管理，部门管理。注意：拥有系统管理员的用户不能拥有日志审计员。'), ('2', '安全保密管理员', '3', 'eyIwIjp7IjEiOnsiNSI6MX19fQ==', '2', '只负责角色管理。注意：拥有安全保密管理员的用户不能拥有日志审计员。'), ('3', '日志审计员', '4', 'eyIwIjp7IjEiOnsiNiI6MX19fQ==', '3', '只负责日志审计。注意：拥有日志审计员的用户不能拥有系统管理员和安全保密管理员。');
COMMIT;

-- ----------------------------
--  Table structure for `t_role_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_user`;
CREATE TABLE `t_role_user` (
  `role_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `login_name` varchar(100) NOT NULL,
  `login_password` varchar(128) NOT NULL,
  `salt` varchar(64) NOT NULL,
  `dept_id` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '-1' COMMENT '--用户状态，1代表正常，2表示锁定,-1代表未激活',
  `index_number` int(11) NOT NULL DEFAULT '1',
  `phones` varchar(500) DEFAULT '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  View structure for `v_department`
-- ----------------------------
DROP VIEW IF EXISTS `v_department`;
CREATE ALGORITHM=UNDEFINED DEFINER=`heart`@`%` SQL SECURITY DEFINER VIEW `v_department` AS select `d`.`dept_id` AS `dept_id`,`d`.`dept_pid` AS `dept_pid`,`d`.`dept_name` AS `dept_name`,`d`.`remark` AS `remark`,`d`.`index_number` AS `index_number`,(case when (`d`.`dept_pid` = -(1)) then '公司' else (select `t_department`.`dept_name` AS `dept_name` from `t_department` where (`t_department`.`dept_id` = `d`.`dept_pid`)) end) AS `parent_name` from `t_department` `d`;

-- ----------------------------
--  View structure for `v_module`
-- ----------------------------
DROP VIEW IF EXISTS `v_module`;
CREATE ALGORITHM=UNDEFINED DEFINER=`heart`@`%` SQL SECURITY DEFINER VIEW `v_module` AS select `m`.`module_id` AS `module_id`,`m`.`parent_id` AS `parent_id`,`m`.`module_name` AS `module_name`,`m`.`index_number` AS `index_number`,`m`.`icon` AS `icon`,(case when (`m`.`parent_id` = 0) then '项目' else (select `t_module`.`module_name` AS `module_name` from `t_module` where (`t_module`.`module_id` = `m`.`parent_id`)) end) AS `parent_name`,`m`.`module` AS `module`,`m`.`view_info` AS `view_info`,`m`.`view_type` AS `view_type` from `t_module` `m`;

-- ----------------------------
--  View structure for `v_user_grid`
-- ----------------------------
DROP VIEW IF EXISTS `v_user_grid`;
CREATE ALGORITHM=UNDEFINED DEFINER=`heart`@`%` SQL SECURITY DEFINER VIEW `v_user_grid` AS select `u`.`user_id` AS `user_id`,`u`.`user_name` AS `user_name`,`u`.`login_name` AS `login_name`,`u`.`status` AS `status`,`u`.`dept_id` AS `dept_id`,`u`.`index_number` AS `index_number`,`u`.`phones` AS `phones`,(select `t_department`.`dept_name` AS `dept_name` from `t_department` where (`t_department`.`dept_id` = `u`.`dept_id`)) AS `dept_name` from `t_user` `u` order by `u`.`index_number`;

-- ----------------------------
--  Procedure structure for `pro_important_role`
-- ----------------------------
DROP PROCEDURE IF EXISTS `pro_important_role`;
delimiter ;;
CREATE DEFINER=`heart`@`%` PROCEDURE `pro_important_role`()
BEGIN
    START TRANSACTION;
    DELETE FROM t_role_user
    WHERE role_id = v_role_id;
    INSERT INTO t_role_user (role_id, user_id) VALUES (v_role_id, v_user_id);
    COMMIT;
  END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `pro_role`
-- ----------------------------
DROP PROCEDURE IF EXISTS `pro_role`;
delimiter ;;
CREATE DEFINER=`heart`@`%` PROCEDURE `pro_role`()
BEGIN
    START TRANSACTION;
    DELETE FROM t_role
    WHERE role_id = v_role_id;
    DELETE FROM t_role_user
    WHERE role_id = v_role_id;
    COMMIT;
  END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `pro_user`
-- ----------------------------
DROP PROCEDURE IF EXISTS `pro_user`;
delimiter ;;
CREATE DEFINER=`heart`@`%` PROCEDURE `pro_user`()
BEGIN
    START TRANSACTION;
    DELETE FROM t_user
    WHERE user_id = v_user_id;
    DELETE FROM t_role_user
    WHERE user_id = v_user_id;
    COMMIT;
  END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `f_has_str`
-- ----------------------------
DROP FUNCTION IF EXISTS `f_has_str`;
delimiter ;;
CREATE DEFINER=`heart`@`%` FUNCTION `f_has_str`() RETURNS int(11)
BEGIN
    DECLARE result INT;
    IF (Instr(str1, str2) > -1)
    THEN
      SET result = 1;
    ELSE
      SET result = 0;
    END IF;
    RETURN (result);
  END
 ;;
delimiter ;
