<script>
var linkStatusData = {
   "status": 200,
   "content": {
        "directed": false,
        "links": [ {
           "status": "online",
           "source": 1,
           "target": 2
        }, {
           "status": "online",
           "source": 2,
           "target": 5
        }, {
           "status": "online",
           "source": 3,
           "target": 4
        }, {
           "status": "online",
           "source": 3,
           "target": 6
        }],
        "multigraph": false,
        "graph": [],
        "nodes": [ {
           "status": "online",
           "forwarding_policy": "0",
           "type": "switch",
           "id": "00:00:00:00:00:00:00:01",
           "type_of_switch": "OF"
           }, {
           "status": "offline",
           "_id": "54af98aea1234b06bbac8d5d",
           "type": "host",
           "id": "10.0.0.4"
           }, {
           "status": "online",
           "forwarding_policy": "0",
           "type": "switch",
           "id": "00:00:00:00:00:00:00:03",
           "type_of_switch": "OF"
           }, {
           "status": "online",
           "forwarding_policy": "0",
           "type": "switch",
           "id": "00:00:00:00:00:00:00:02",
           "type_of_switch": "OF"
           }, {
           "status": "online",
           "_id": "54af98aea1234b06bbac8d5e",
           "type": "host",
           "id": "10.0.0.1"
           }, {
           "status": "online",
           "_id": "54af98aea1234b06bbac8d5f",
           "type": "host",
           "id": "10.0.0.3"
           }, {
           "status": "offline",
           "_id": "54af98aea1234b06bbac8d60",
           "type": "host",
           "id": "10.0.0.2"
           }],
        "last_seen": "1421832648.22" },
        "message": "success"};

// original width=1013, height=578
var width = 400, // 1500
   height = 200, // 700
   linkedByIndex = {},
   node=null,
   link=null,
   force=null,
   nodelinks = null,
   sourceStatus="",
   imageByType = {
        "host_online" : "images/groundStationOnline.png",
        "switch_online" : "images/satelliteOnline.png",
        "host_offline" : "images/groundStationOffline.png",
        "switch_offline" : "images/satelliteOffline.png"
   };

function drawNetworkTopology(linkStatusData) {

   force = d3.layout.force()
        .nodes(linkStatusData.content.nodes)
        .links(linkStatusData.content.links)
        .linkDistance(100)
        .charge(-600)
        .size([width, height])
        .start();

//add zoom behavior to nodes
var zoom = d3.behavior.zoom()
        .scaleExtent([1, 3])
        .on("zoom", zoomed);

//add drag behavior to nodes
var drag = d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

//create svg element using d3
var svg = d3.select("#linkStatus").append("svg")
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .call(zoom);

//append container lable to bounding box
svg.append("text")
        .text("")
        .attr({'x' : width-70,
           'y' : height-5,
           "text-anchor" : "middle",
        });

//add bounding box
svg.append("rect")
        .attr({"width" : width,
           "height" : height, })
        .style({"fill" : "none",});

//add container
var containerGrp = svg.append("g");

//add group of all lines
link = containerGrp
   .selectAll("line")
   .data(linkStatusData.content.links)
   .enter().append("line")
   .attr({"class" : function (linkStatusData) {
        return linkStatusData.status+"-color";
   }
});

//add group of all nodes
node = containerGrp
   .selectAll(".node")
   .data(linkStatusData.content.nodes)
   .enter().append("g")
   .attr({"class" : "nodes",
        "cx" : function (d) {
           return d.x;
        },
        "cy" : function (d) {
           return d.y;
        },
   })
   .call(drag);

//add image to node dynamically
node.append("image")
   .attr({"xlink:href" : function (d) {
        if (d.status === ('online').toLocaleLowerCase() &&
            d.forwarding_policy == 1)
           return "images/proactive_forward.png";
        else
           return imageByType[d.type+"_"+d.status];
   },
   "x" : -15,
   "y" : -15,
   "width" : 30,
   "height" : 30,
   })
   .on("click",function(d){
        if (d3.event.defaultPrevented) return; // click suppressed
   })
   .on("mouseover", mouseOverFunction)
   .on("mouseout", mouseOutFunction);

//add labeled text to each node
node.append("text")
   .attr({"y" : 25,
        "text-anchor" : "middle"
   })
   .text(function (d) {
        return d.id;
   });

//tick event of network node
force.on("tick", tick);

//map of all connected nodes index
linkStatusData.content.links.forEach(function (d) {
   linkedByIndex[d.source.index + "," + d.target.index] = true;
});

var tooltip = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);

/**
* Event - mouseover for network nodes
* @param linkStatusData
*/
function mouseOverFunction(d, i) {
   if (d3.event.defaultPrevented) return;
   tooltip.transition().duration(200).style("opacity", 1);
   tooltip.html("<B>Properties</B><BR/><b>ID:</b>"
        + linkStatusData.content.nodes[i].id + "<BR/><b>Type:</b>" +
   linkStatusData.content.nodes[i].type+"<BR/><b>Status:</b>" +
   linkStatusData.content.nodes[i].status)
   .style({"left" : (d3.event.pageX - 130) + "px",
        "top" : (d3.event.pageY + 10) + "px"
   });
}

/**
* Event-mouseout for network nodes
*/
function mouseOutFunction() {
   if (d3.event.defaultPrevented) return;
   tooltip.transition().duration(500).style("opacity", 0);
}

/**
* check for nodes connection
* @param a
* @param b
* @returns {Boolean}
*/
function isConnected(a, b) {
   return isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a.index == b.index;
}

/**
* check for node connection as soure
* @param a
* @param b
* @returns{boolean}
*/
function isConnectedAsSource(a, b) {
   return linkedByIndex[a.index + "," + b.index];
}

/**
* check for node connection as target
* @param a
* @param b
* @returns {boolean}
*/
function isConnectedAsTarget(a, b) {
   return linkedByIndex[b.index + "," + a.index];
}

/**
* This method can be used in conjunction with force.start() and force.stop() to compute a static layout.
*/
function tick() {
   node.attr({
        "cx" : function (d) {
           return d.x = Math.max(15, Math.min(width - 15, d.x));
   },
   "cy" : function (d) {
        return d.y = Math.max(15, Math.min(height - 15, d.y));
   },
        "transform" : function (d) {
           return "translate(" + d.x + "," + d.y + ")";
        }
   });
   link.attr({
        "x1" : function (d) {
           return d.source.x;
        },
        "y1" : function (d) {
           return d.source.y;
        },
        "x2" : function (d) {
           return d.target.x;
        },
        "y2" : function (d) {
           return d.target.y;
        },
   });
}

/**
* zoomed function
*/
function zoomed() {
   var e = d3.event,
   tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
   ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
   zoom.translate([tx, ty]);
   containerGrp.attr("transform", ["translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"].join(" "));
}

function dragstarted(d, i) {
   force.stop(); // stops the force auto positioning before you start dragging
}

function dragged(d, i) {
   d.px += d3.event.dx;
   d.py += d3.event.dy;
   d.x += d3.event.dx;
   d.y += d3.event.dy;
   tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragended(d, i) {
   d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
   tick();
   force.resume();
}

};// drawNetworkTopology() closed

drawNetworkTopology(linkStatusData);
</script>
