package com.feedback2me.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.*;
import com.feedback2me.domain.JAllEmailMessages;
import org.springframework.web.servlet.View;

import javax.tools.JavaCompiler;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: twer
 * Date: 7/18/11
 * Time: 9:55 PM
 * To change this template use File | Settings | File Templates.
 */

@Controller
public class JFeedbackController {
    @RequestMapping(value = "/{email}.html", method = RequestMethod.GET)
    public ModelAndView index(@PathVariable("email") String email){
        HashMap<String, String> data  = new HashMap();
        data.put("email", email);
        return new ModelAndView("index", data);
    }
    @RequestMapping(value = "/{email}.json", method = RequestMethod.GET)
    public View timeLine(@PathVariable("email") String email) {
        String events = JAllEmailMessages.lookUp(email).toJson();
        String jsonTemplate = "{\"memos\":%s}";
        return new JJsonView(java.lang.String.format(jsonTemplate, events));
    }
    @RequestMapping(value = "/{email}.date", method = RequestMethod.GET)
    public View timeRange(@PathVariable("email") String email) {
        String events = JAllEmailMessages.lookUp(email).toDate();
        return new JJsonView(events);
    }
}
