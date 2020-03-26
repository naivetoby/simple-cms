package vip.toby.cms.core.controller.grid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("grid")
public class GridController {

    @RequestMapping(method = RequestMethod.GET)
    public String grid() {
        return "grid";
    }

}
