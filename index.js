// data request
req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', true);
req.send();
req.onload = function() {
	let json = JSON.parse(req.responseText);
	
	// link and node initializing
	let links = [], nodes = [];
	
	json.links.forEach(val => {
		links.push({source: json.nodes[val.source].country, 
					target: json.nodes[val.target].country});
	});
	json.nodes.forEach(val => nodes.push({id: val.country, code: "flag flag-" + val.code}));
	
		// tick function for refreshing position
	const ticked = () => {
		link.attr("x1", d => Math.max(0, Math.min(width, d.source.x)))
			.attr("y1", d => Math.max(0, Math.min(height, d.source.y)))
			.attr("x2", d => Math.max(0, Math.min(width, d.target.x)))
			.attr("y2", d => Math.max(0, Math.min(height, d.target.y)));
			
		node.attr("transform", d => "translate(" + Math.max(0 , Math.min(width, d.x)) + ", " + Math.max(0 , Math.min(height, d.y)) + ")");
  }
  
	// drag functions
	const dragStarted = (d) => {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
	}

	const dragged = (d) => {
		d.fx = Math.max(0, Math.min(width, d3.event.x));
		d.fy = Math.max(0, Math.min(height, d3.event.y));
	}
	
	const dragEnded = (d) => {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = undefined;
		d.fy = undefined;
	}
	
	// setting svg canvas, force simulation, and elements
	const width = document.documentElement.clientWidth,
		  height = document.documentElement.clientHeight - 1,
          svg = d3.select("body")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height),
          simulation = d3.forceSimulation()
                         .force("link", d3.forceLink().id(d => d.id).distance(40).strength(1).iterations(3))
                         .force("charge", d3.forceManyBody().distanceMax(100).strength(-100))
                         .force("collide", d3.forceCollide().radius(15).strength(1))
                         .force("center", d3.forceCenter(width / 2, height / 2)),
          titleLabel = svg.append("text")
                          .text("Force Directed Graph by National Contiguity")
                          .attr("class", "titleLabel")
                          .attr("fill", "#eeeeee"),
          titleBox = titleLabel.node()
                               .getBBox();

	titleLabel.attr("x", (width / 4 - titleBox.width / 2))
              .attr("y", titleBox.height + height / 100);

	const link = svg.selectAll(".link")
					.data(links, d => d.target.id)
					.enter()
					.append("line")
					.attr("class", "link")
					.attr("stroke", "white"),
		  node = svg.selectAll(".node")
					.data(nodes)
					.enter()
					.append("g")
					.attr("class", "node")
					.call(d3.drag()
							.on("start", dragStarted)
							.on("drag", dragged)
							.on("end", dragEnded));

	node.append("foreignObject")
		.attr("width", 100)
		.attr("height", 100)
		.append("xhtml:img")
		.attr("class", d => d.code);
    
	node.append("title")
		.text(d => d.id);
  
	simulation.nodes(nodes)
			  .on("tick", ticked);

	simulation.force("link")
			  .links(links);
};