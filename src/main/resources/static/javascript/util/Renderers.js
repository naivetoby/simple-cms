/**
 * renderer方法管理类，所有renderer方法在此注册
 */
var Renderers = null;
(function () {
    Renderers = {
        moduleViewTypeRenderer: function (v) {
            switch (v) {
                case -3:
                    return '系统自定义模块';
                case -2:
                    return '系统功能模块';
                case -1:
                    return '系统目录';
                case 1:
                    return '目录';
                case 2:
                    return '功能模块';
                case 3:
                    return '自定义模块';
                default:
                    return '未知类型';
            }
        },
        userStatusRenderer: function (v) {
            switch (v) {
                case -1:
                    return "未激活";
                case 1:
                    return "正常";
                case 2:
                    return "已锁定";
                default:
                    return "未知状态";
            }
        },
        // 日志审计的用户名显示
        logUserNameRenderer: function (v) {
            if (Ext.isEmpty(v)) {
                return "用户名不存在";
            } else {
                return v;
            }
        },
        // 日志审计的登录名显示
        logLoginNameRenderer: function (v) {
            if (Ext.isEmpty(v)) {
                return "登录名不存在";
            } else {
                return v;
            }
        },
        /**
         * grid小提示方法
         */
        commonTooltipRenderer: function (v, metaData) {
            metaData.tdAttr = 'data-qtip="' + v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"';
            return v;
        },
        /**
         * 解析日期时间
         */
        dateTimeRenderer: function (format) {
            return function (v, metaData) {
                var str = Ext.Date.format(v, format);
                metaData.tdAttr = 'data-qtip="' + str + '"';
                return str;
            };
        },
        articleTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "普通";
                case 1:
                    return "官方";
                default:
                    return "未知类型";
            }
        },
        uncommentAbleRenderer: function (v) {
            if (v) {
                return "不可评论";
            }
            return "正常";
        },
        deletedRenderer: function (v) {
            if (v) {
                return "已删除";
            }
            return "正常";
        },
        genderRenderer: function (v) {
            switch (v) {
                case -1:
                    return "-";
                case 0:
                    return "男";
                case 1:
                    return "女";
                default:
                    return "未知";
            }
        },
        groupArticleGenderRenderer: function (v) {
            switch (v) {
                case -1:
                    return "-";
                case 0:
                    return "男";
                case 1:
                    return "女";
                default:
                    return "未知";
            }
        },
        groupArticleUncommentAbleRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case 1:
                    return "不可回复";
                default:
                    return "未知";
            }
        },
        readedRenderer: function (v) {
            if (v) {
                return "否";
            }
            return "是";
        },
        letterType: function (v) {
            switch (v) {
                case 1:
                    return "普通信件";
                default:
                    return "未知类型";
            }
        },
        letterStatus: function (v) {
            switch (v) {
                case 0:
                    return "未投递";
                case 1:
                    return "已投递";
                case 2:
                    return "已接收";
                case -1:
                    return "拒收";
                default:
                    return "未知状态";
            }
        },
        userstampType: function (v) {
            switch (v) {
                case 1:
                    return "普通邮票";
                default:
                    return " 未知邮票类型";
            }
        },
        userstampUsedFlag: function (v) {
            switch (v) {
                case 0:
                    return "否";
                default:
                    return "是";
            }
        },
        sectionType: function (v) {
            switch (v) {
                case 0:
                    return "普通";
                case 1:
                    return "官方";
                default:
                    return "未知";
            }
        },
        gkUserStatus: function (v) {
            switch (v) {
                case -1:
                    return "已锁定";
                case 0:
                    return "默认";
                case 1:
                    return "正常";
                default:
                    return "未知";
            }
        },
        userDeliverStatus: function (v) {
            switch (v) {
                case -1:
                    return "黑名单";
                case 0:
                    return "待审核";
                case 1:
                    return "正常";
                default:
                    return "未知";
            }
        },
        userClientType: function (v) {
            switch (v) {
                case 0:
                    return "Web";
                case 1:
                    return "iOS";
                case 2:
                    return "Android";
                default:
                    return "未知";
            }
        },
        forcedUpgrade: function (v) {
            switch (v) {
                case 0:
                    return "推荐更新";
                case 1:
                    return "强制更新";
                default:
                    return "未知";
            }
        },
        letterStatus: function (v) {
            switch (v) {
                case 0:
                    return "未投递";
                case 1:
                    return "已投递";
                case 2:
                    return "已接收";
                case -1:
                    return "已拒绝";
                default:
                    return "未知";
            }
        },
        letterReaded: function (v) {
            return v == 0 ? "未读" : "已读";
        },
        stampPackageStatus: function (v) {
            return v == -1 ? "停止发行" : "正常发行";
        },
        userGenderStatus: function (v) {
            switch (v) {
                case 0:
                    return "先生";
                case 1:
                    return "女士";
                default:
                    return "未知";
            }
        },
        userTargetStatus: function (v) {
            switch (v) {
                case 0:
                    return "任意";
                case 1:
                    return "异性";
                default:
                    return "未知";
            }
        },
        formatFloat: function (v) {
            switch (v) {
                case '0':
                    return "0";
                case '1':
                    return "100%";
                default:
                    return Ext.util.Format.number(v * 100, "0.0") + "%";
            }
        },
        formatFloatToStr: function (v) {
            switch (v) {
                case '0':
                    return "0";
                case '1':
                    return "100%";
                default:
                    return Ext.util.Format.number(v, "0.00");
            }
        },
        stampCreateSourceType: function (v) {
            switch (v) {
                case 1:
                    return "系统赠送";
                case 2:
                    return "CMS赠送";
                case 3:
                    return "收信赠送";
                case 4:
                    return "积分兑换";
                default:
                    return "未知来源";
            }
        },
        stampLevelType: function (v) {
            switch (v) {
                case 480:
                    return "普通(8h)";
                case 240:
                    return "快速(4h)";
                case 0:
                    return "即达";
                default:
                    return "未知";
            }
        },
        newLetterStatus: function (v) {
            switch (v) {
                case -1:
                    return "黑名单";
                case 0:
                    return "待审核";
                case 1:
                    return "正常";
                case 2:
                    return "成功";
                default:
                    return "未知";
            }
        },
        letterDeliverStatus: function (v) {
            switch (v) {
                case -1:
                    return "黑名单";
                case 0:
                    return "待审核";
                case 1:
                    return "正常";
                default:
                    return "未知";
            }
        },
        trainspottingStatus: function (v) {
            switch (v) {
                case -3:
                    return "黑名单";
                case -2:
                    return "待审核";
                case -1:
                    return "失败";
                case 0:
                    return "等待匹配";
                case 1:
                    return "游戏中";
                case 2:
                    return "成功";
                default:
                    return "未知";
            }
        },
        usedStatusRenderer: function (v) {
            switch (v) {
                case 0:
                    return "未使用";
                case 1:
                    return "已使用";
                default:
                    return "未知";
            }
        },
        stampLevelRenderer: function (v) {
            switch (v) {
                case 0:
                    return "8H";
                case 1:
                    return "4H";
                case 2:
                    return "即达";
                default:
                    return "未知";
            }
        }, selfVisibleRenderer: function (v) {
            switch (v) {
                case 0:
                    return "否";
                case 1:
                    return "是";
                default:
                    return "未知";
            }
        }, letterKeyStatusRenderer: function (v) {
            switch (v) {
                case 0:
                    return "未使用";
                case 1:
                    return "已使用";
                default:
                    return "未知";
            }
        },
        letterKeyCreateSourceType: function (v) {
            switch (v) {
                case 1:
                    return "系统赠送";
                case 2:
                    return "CMS赠送";
                case 3:
                    return "收信赠送";
                case 4:
                    return "积分兑换";
                default:
                    return "未知来源";
            }
        }, fishboxStatus: function (v) {
            switch (v) {
                case 0:
                    return "待审核";
                case 1:
                    return "正常";
                case -1:
                    return "黑名单";
                default:
                    return "未知状态";
            }
        }, groupArticleStatusRenderer: function (v) {
            if (v) {
                return "正常";
            }
            return "待审核";
        }, groupArticleRangeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "岛内可见";
                case 1:
                    return "公开";
                default:
                    return "未知状态";
            }
        }, groupArticleTypeRenderer: function (v) {
            switch (v) {
                case -1:
                    return "系统日志";
                case 0:
                    return "文本";
                case 1:
                    return "图片";
                case 2:
                    return "链接";
                case 3:
                    return "音频";
                case 4:
                    return "视频";
                default:
                    return "未知状态";
            }
        }, groupTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "普通";
                case 1:
                    return "高级";
                case 2:
                    return "官方";
                default:
                    return "未知类型";
            }
        }, groupStatusRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case -1:
                    return "已锁定";
                default:
                    return "状态";
            }
        }, mybookStatusRenderer: function (v) {
            switch (v) {
                case 1:
                    return "正常";
                case 0:
                    return "待审核";
                case -1:
                    return "沉底";
                default:
                    return "未知";
            }
        }, mybookSortingRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case -1:
                    return "沉底";
                default:
                    return "未知";
            }
        }, reportTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "信件";
                case 1:
                    return "过客岛";
                case 2:
                    return "过客岛动态";
                case 3:
                    return "过客岛评论";
                case 4:
                    return "论坛帖子";
                case 5:
                    return "论坛评论";
                case 6:
                    return "我是谁";
                case 7:
                    return "树洞帖子";
                case 8:
                    return "树洞评论";
                default:
                    return "未知";
            }
        }, reportStatuaRenderer: function (v) {
            switch (v) {
                case 0:
                    return "待处理";
                case 1:
                    return "已处理";
                case -1:
                    return "已忽略";
                default:
                    return "未知";
            }
        }, storeStampProductRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正在发售";
                case 1:
                    return "停止发售";
                default:
                    return "未知";
            }
        }, feedBackTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "反馈问题";
                case 1:
                    return "提供建议";
                default:
                    return "未知";
            }
        }, feedBackStatusRenderer: function (v) {
            switch (v) {
                case 0:
                    return "待处理";
                case 1:
                    return "已处理";
                default:
                    return "未知";
            }
        }, storeOrderTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "积分";
                case 1:
                    return "现金";
                default:
                    return "未知";
            }
        }, storeOrderPayTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "积分";
                case 1:
                    return "微信";
                case 2:
                    return "微信H5";
                case 3:
                    return "支付宝";
                default:
                    return "未知";
            }
        }, storeOrderProductTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "邮票";
                case 1:
                    return "信纸";
                case 2:
                    return "钥匙";
                default:
                    return "未知";
            }
        }, treeHoleArticleRangeTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "公开";
                case 1:
                    return "私密";
                default:
                    return "未知";
            }
        }, treeHoleArticleUncommentAbleRenderer: function (v) {
            switch (v) {
                case 0:
                    return "可以评论";
                case 1:
                    return "不能评论";
                default:
                    return "未知";
            }
        }, treeHoleArticleDeletedRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case 1:
                    return "自己删除";
                case 2:
                    return "管理员删除";
                default:
                    return "未知";
            }
        }, treeHoleCommentDeletedRenderer: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case 1:
                    return "贴主删除";
                case 2:
                    return "管理员删除";
                default:
                    return "未知";
            }
        }, treeHoleCommentUncommentVisibleRenderer: function (v) {
            switch (v) {
                case 0:
                    return "可见";
                case 1:
                    return "私密";
                default:
                    return "未知";
            }
        }, treeHoleArticleStatusdRenderer: function (v) {
            switch (v) {
                case 0:
                    return "待审核";
                case 1:
                    return "审核通过";
                case -1:
                    return "审核不通过";
                default:
                    return "未知";
            }
        }, letterTemplatePackageStatus: function (v) {
            switch (v) {
                case 0:
                    return "正常";
                case -1:
                    return "下架";
                default:
                    return "未知";
            }
        }, clientChannelRenderer: function (v) {
            switch (v) {
                case 'normal':
                    return "官网";
                case 'ios':
                    return "iOS";
                case 'xiaomi':
                    return "小米";
                case 'yingyongbao':
                    return "应用宝";
                case 'ali':
                    return "阿里";
                case 'baidu':
                    return "百度";
                case 'chuizi':
                    return "锤子";
                case 'oppo':
                    return "OPPO";
                case 'vivo':
                    return "vivo";
                case 'meizu':
                    return "魅族";
                case 'huawei':
                    return "华为";
                case 'qh360':
                    return "360";
                case 'other':
                    return "其他";
                default:
                    return "未知类型";
            }
        }, loveLetterStatus: function (v) {
            switch (v) {
                case 1:
                    return "正常";
                case 0:
                    return "待审核";
                case -1:
                    return "黑名单";
                default:
                    return "未知";
            }

        }, magazineContributeTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "缪斯乐影";
                case 1:
                    return "怪谈物语";
                case 2:
                    return "伊甸星测";
                case 3:
                    return "身边故事";
                case 4:
                    return "Gorkor说";
                default:
                    return "未知";
            }
        }, magazineContributeStatusRenderer: function (v) {
            switch (v) {
                case 0:
                    return "待处理";
                case 1:
                    return "已处理";
                default:
                    return "未知";
            }
        }, storeStampProductSellTypeRenderer: function (v) {
            switch (v) {
                case 1:
                    return "积分";
                case 2:
                    return "现金";
                case 3:
                    return "积分+现金";
                default:
                    return "未知";
            }
        }, storeStampProductPackageTypeRenderer: function (v) {
            switch (v) {
                case 0:
                    return "默认";
                case 1:
                    return "虚拟";
                default:
                    return "未知";
            }
        }, letterCreateFromUidRenderer: function (v) {
            switch (v) {
                case '10000':
                    return "大猫";
                case '10001':
                    return "老王";
                case '10002':
                    return "橙子";
                default:
                    return "未知";
            }
        }, filterWordEnabledRenderer: function (v) {
            switch (v) {
                case 0:
                    return "已禁用";
                case 1:
                    return "正常";
                default:
                    return "未知";
            }
        }, filterWordUsedRenderer: function (v) {
            switch (v) {
                case 0:
                    return "未生效";
                case 1:
                    return "已生效";
                default:
                    return "未知";
            }
        }
    };
})();