var assert = function (statement, errormessage) {
    if(statement != true){
        console.log(errormessage);
    }
}


var LSystem = function (lsystem){ // properties : axoim, constants, rules, iterations
    //B : branch
    //L : leaf
    //F : flower
    //S : seed
    
    var i=0, l=0;
    for(i in lsystem)
        this[i] = lsystem[i];
    this.parsed_rules = [];
    for(i=0, l=this.rules.length; i<l; ++i){
        var rule = this.rules[i];
        var parsed = /([\w\[\]\-\+]*|[\w\[\]\-\+]*<[\w\[\]\-\+]+>[\w\[\]\-\+]*)\(?([0-9]*\.?[0-9]*)\)?=([\w\[\]\-\+@]*)/.exec(rule)

        var parsed_rule = {};
        parsed_rule.from = parsed[1].replace("<", "").replace(">", ""); 
        parsed_rule.regex_from = new RegExp(parsed_rule.from, "g");
        if(0 < rule.search("<"))
            parsed_rule.to = parsed[1].substr(0, parsed[1].search("<")) + parsed[3] + parsed[1].substr(parsed[1].search(">")+1);
        else
            parsed_rule.to = parsed[3];
        parsed_rule.prob = parsed[2] == ""? 1.0 : parseFloat(parsed[2]);
        parsed_rule.growth_mask = parsed_rule.to.replace(/[^@]/g, " ");
        parsed_rule.growth_mask = parsed_rule.growth_mask.replace(/[@]/g, parsed_rule.from);
        this.parsed_rules.push(parsed_rule);
    }
    this.result = lsystem.axiom || "";
    i = this.iterations-0;
    this.iterations = 0;
    for(; i>0; --i)
        this.iterate();
};
LSystem.prototype.iterate = function () {
    var original = this.result;
    var growth_mask = this.result;
    for(var i=0, l=this.parsed_rules.length; i<l; i++){
        var rule = this.parsed_rules[i];
        if(rule.prob >= Math.random())
            original = original.replace(rule.regex_from, ""+i);
            growth_mask = growth_mask.replace(rule.regex_from, ""+i);
    }
    for(var i=0, l=this.parsed_rules.length; i<l; i++){
        var rule = this.parsed_rules[i];
        original = original.replace(new RegExp(i, "g"), rule.to);
        original = original.replace(/@/g, rule.from);
        growth_mask = growth_mask.replace(new RegExp(i, "g"), rule.growth_mask);
    }
    this.result = original;
    this.growth_mask = growth_mask;
    this.iterations += 1;
    return this.result;
};


var Plant = function (l_system, organize_resource, angle) {
    this.l_system = l_system;
    this.resource = {
        water: 0,
        mineral: 0,
        sunshine: 0,
        energy: 0,
    };
    this.organize_resource = organize_resource;
    this.feed(organize_resource.seed);
    this.angle = angle;
    this.leaf_area= 0;
    this.stage = 0;
    this.growth_mask_array = [];

    this.initStage();
    this.age = 0;
};
Plant.ORGANIZE_LETTER = {
    "B": "branch",
    "L" : "leaf",
    "F" : "flower",
    "S": "seed",
    " ": null,
};
Plant.prototype.feed = function(resource) {
    for(var i in resource){
        assert(this.resource[i] != null, "l_lang doesn't have resource " + i);
        this.resource[i] += resource[i];
    }
};
Plant.prototype.grow = function(day) {
    if(this.stage >= this.l_system.result.length){
        this.l_system.iterate();
        this.growth_mask_array = this.l_system.growth_mask.split("");
        this.initStage();
    }
    if(this.resource.water <= 0) return false;
    // water evaporation(proporse to sunshine)
    this.resource.water = Math.max(0, this.resource.water - day*this.resource.sunshine);

    // photo synthesis(proporse to leaf area and sunshine)
    this.resource.energy += day * this.leaf_area * this.resource.sunshine;

    // grow(consume energy)
    while(day > 0){
        var last_stage = this.stage,
            remain_organize_day = Math.floor(last_stage+1)-last_stage,
            spend_day = Math.min(day, remain_organize_day, this.l_system.result.length - last_stage);
        // check if already drown
        // calcualte will spend day
        var current_organize = Plant.ORGANIZE_LETTER[this.l_system.growth_mask[Math.floor(last_stage)]];
        if(current_organize != null){
            // calculate will be consume
            var current_organize_resource = this.organize_resource[current_organize];
            assert(current_organize_resource != null, "no organize resource definition : " + current_organize);
            for(var i in current_organize_resource)
                spend_day = Math.min(spend_day, this.resource[i] / current_organize_resource[i]);
            // consume energy
            for(var i in current_organize_resource)
                this.resource[i] -= spend_day*current_organize_resource[i];
            this.age += spend_day;
            day -= spend_day;
        }
        if(spend_day === 0) break;
        this.stage += spend_day;

        // organize complete
        if(Math.floor(last_stage) != Math.floor(this.stage)){
            if(current_organize === "leaf")
                this.leaf_area += 1;
            this.growth_mask_array[Math.floor(last_stage)] = this.l_system.result[Math.floor(last_stage)];
        }
    }
};
Plant.drawBranch = function(context, draw_state, rollback) {
    context.save();
    context.beginPath();
    context.strokeStyle = "#8B4513";
    context.lineWidth=draw_state.width;
    context.moveTo(draw_state.x, draw_state.y);
    if(!rollback){
        draw_state.x += Math.cos(Math.PI * draw_state.angle/180)*draw_state.length;
        draw_state.y += Math.sin(Math.PI * draw_state.angle/180)*draw_state.length;
        context.lineTo(draw_state.x, draw_state.y);
    }
    else{
        context.lineTo(
            draw_state.x + Math.cos(Math.PI * draw_state.angle/180)*draw_state.length,
            draw_state.y + Math.sin(Math.PI * draw_state.angle/180)*draw_state.length
        );
    }
    context.closePath();
    context.stroke();
    context.restore();
};
Plant.drawLeaf = function(context, draw_state) {
    context.save();
    context.beginPath();
    context.strokeStyle = "#8FBC8F";
    context.lineWidth=draw_state.width;
    context.moveTo(draw_state.x, draw_state.y);
    var x = draw_state.x + Math.cos(Math.PI * draw_state.angle/180)*draw_state.length,
        y = draw_state.y + Math.sin(Math.PI * draw_state.angle/180)*draw_state.length;
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
};
Plant.drawFlower = function(context, draw_state) {
    context.save();
    context.beginPath();
    context.fillStyle = "#CD5C5C";
    context.strokeStyle = "#CD5C5C";
    context.lineWidth=draw_state.width;
    /*
    var x = draw_state.x + Math.cos(Math.PI * draw_state.angle/180)*draw_state.length*0.5,
        y = draw_state.y + Math.sin(Math.PI * draw_state.angle/180)*draw_state.length*0.5;
    context.arc(x, y, draw_state.length*0.5, 0, Math.PI*2, false);
    */
    context.moveTo(draw_state.x, draw_state.y);
    var x = draw_state.x + Math.cos(Math.PI * draw_state.angle/180)*draw_state.length,
        y = draw_state.y + Math.sin(Math.PI * draw_state.angle/180)*draw_state.length;
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
};
Plant.prototype.initStage = function() {
    this.stage = 0;
    /*
    if(this.bufferCanvas == null){
        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = 500;
        this.bufferCanvas.height = 500;
        this.buffer = this.buffer || this.bufferCanvas.getContext("2d");
    }
    this.buffer.clearRect(0, 0, 1000, 1000);
    this.drawn = 0;
    this.draw_state = {
        angle: -90,
        width: Math.max(1, Math.log10(this.l_system.result.length)),
        length: 4,
        x: this.bufferCanvas.width*0.5,
        y: this.bufferCanvas.height,
    };
    this.draw_state_stack = [];
    */
}
Plant.prototype.draw = function(context, x, y, w, h) {
    if(this.bufferCanvas == null){
        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = 500;
        this.bufferCanvas.height = 500;
        this.buffer = this.buffer || this.bufferCanvas.getContext("2d");
    }
    var draw_state = {
            angle: -90,
            width: Math.max(1, Math.log10(this.l_system.result.length)),
            length: 4,
            x: this.bufferCanvas.width*0.5,
            y: this.bufferCanvas.height,
        },
        draw_state_stack = [],
        buffer = this.buffer;
    buffer.clearRect(0, 0, 1000, 1000);
    for(var i=0, l=this.growth_mask_array.length; i<l; i++){
        var current_organize = this.growth_mask_array[i];
        switch(current_organize){
        case "B":
            Plant.drawBranch(buffer, draw_state);
            draw_state.width = Math.max(1, draw_state.width - 0.1);
            break;
        case "L":
            Plant.drawLeaf(buffer, draw_state);
            break;
        case "F":
            Plant.drawFlower(buffer, draw_state);
            break;
        case "-":
            draw_state.angle -= this.angle;
            break;
        case "+":
            draw_state.angle += this.angle;
            break;
        case "[":
            var new_state = {};
            for(var attr in draw_state) new_state[attr] = draw_state[attr];
            draw_state_stack.push(draw_state);
            draw_state = new_state;
            break;
        case "]":
            draw_state = draw_state_stack.pop() || draw_state;
            break;
        }
    }
    /*
    if(this.stage > i){
        var length = draw_state.length;
        draw_state.length *= Math.max(this.stage - i, 0);
        var current_organize = this.l_system.result[i];
        switch(current_organize){
        case "B":
            Plant.drawBranch(buffer, draw_state, true);
            break;
        case "L":
            Plant.drawLeaf(buffer, draw_state);
            break;
        case "F":
            Plant.drawFlower(buffer, draw_state);
            break;
        }
        draw_state.length = length;
    }
    */
    if(w && h)
        context.drawImage(this.bufferCanvas, x, y, w, h); 
    else
        context.drawImage(this.bufferCanvas, x, y); 
};


