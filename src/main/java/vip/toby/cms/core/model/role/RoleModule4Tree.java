package vip.toby.cms.core.model.role;


import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.model.module.Module4Tree;

@Table(name = "t_module")
public class RoleModule4Tree extends Module4Tree {

    private boolean checked;

    public boolean getChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}
