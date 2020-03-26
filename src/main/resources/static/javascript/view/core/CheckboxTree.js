/**
 * 带复选框树型视图
 * 
 * @author 彭嘉辉
 */
Ext.define('OA.view.core.CheckboxTree', {
	alias : 'widget.checkboxtree',
	extend : 'Ext.tree.Panel',
	width : '100%',
	height : '100%',
	store : null,
	rootVisible : false,
	useArrows : true,
	autoScroll : true,
	animate : true,
	multiSelect : true,
	border : false,
	bodyBorder : false,
	viewConfig : {
		forceFit : true
	},
	listeners : {
		checkchange : function(node, checked, opt) {
			var self = this;
			if (!node.isLeaf()) {
				node.expand(true, function() {
					self.treeSelectedSon(node, checked);
				});
			}
			if (node.parentNode && !node.parentNode.isRoot()) {
				self.treeSelectedFather(node, checked);
			}
		},
		afteritemexpand : function(node, opt) {
			this.setNode(this, node, node.isHalfSelected);
			this.setChildStyle(this, node);
		},
		itemcollapse : function(node, opt) {
			this.setNode(this, node, node.isHalfSelected);
		}
	},
	initComponent : function() {
		this.callParent();
	},
	treeSelectedSon : function(node, checked) {
		var tree = this;
		node.isHalfSelected = false;
		node.eachChild(function(child) { // 循环下一级的所有子节点
			if (null != child.get('checked')) // 这里这么写是因为后台有些节点的checked没赋值，其在web上不显示复选框，这里就过滤掉对它们
			{
				child.set('checked', checked); // 选中
				if (!child.isLeaf()) {
					tree.treeSelectedSon(child, checked); // 递归选中子节点
				}
			}
		});
	},
	treeSelectedFather : function(node, checked) {
		var parent = node.parentNode; // 获取父节点
		var flag = false;
		var hasUnCheckedChild = false;
		var isHalfSelected = false;
		if (null != parent) { // 是否有子节点
			parent.eachChild(function(child) { // 循环下一级的所有子节点

				if (child.get('checked') == true) {
					flag = true;
					if (child.isHalfSelected) {
						isHalfSelected = true;
					}
				} else if (child.get('checked') == false) {
					hasUnCheckedChild = true;
				}
			});

			parent.set('checked', flag);
			if ((flag && hasUnCheckedChild) || isHalfSelected) {
				parent.isHalfSelected = true;
				this.setNode(this, parent, true);
			} else {
				parent.isHalfSelected = false;
				this.setNode(this, parent, false);
			}
			if (!parent.isRoot()) {
				this.treeSelectedFather(parent, flag);
			}

		}
	},
	setNode : function(tree, node, value) {
		var checkbox = this.getCheckbox(tree, node);
		// checkbox.disabled=value;
		// 半选中状态
		if (!Ext.isEmpty(checkbox) && node.isHalfSelected != null) {
			if (value == true) {
				checkbox.className = checkbox.className.replace(' x-tree-checkbox-half-checked', '') + ' x-tree-checkbox-half-checked';
			}
			// 取消半选中
			else {
				checkbox.className = checkbox.className.replace(' x-tree-checkbox-half-checked', '');
			}
		}
	},
	getCheckbox : function(tree, node) {
		if (node.isRoot()) {
			return null;
		}
		var checkbox = null;
		var td = null;
		if (tree.getView) {
			td = tree.getView().getNode(node).firstChild.firstChild;
		} else {
			td = tree.getNode(node).firstChild.firstChild;
		}
		checkbox = td.getElementsByTagName('input')[0];
		return checkbox;
	},
	setChildStyle : function(tree, node) {
		var self = this;
		if (node.isExpanded()) {
			node.eachChild(function(child) { // 循环下一级的所有子节点
				if (child.isHalfSelected != null) {
					var checkbox = self.getCheckbox(tree, child);
					if (!Ext.isEmpty(checkbox)) {
						// 半选中状态
						if (child.isHalfSelected == true) {
							checkbox.className = checkbox.className.replace(' x-tree-checkbox-half-checked', '') + ' x-tree-checkbox-half-checked';
						}
						// 取消半选中
						else {
							checkbox.className = checkbox.className.replace(' x-tree-checkbox-half-checked', '');
						}
						if (!child.isLeaf()) {
							tree.setChildStyle(tree, child);
						}
					}
				}
			});
		}
	}
});