
document.addEventListener("DOMContentLoaded", function() {

    var selector = d3.select("#selDataset");

    selector.on('change', function() {buildMetadata(); draw();});


    // this section is only run once
    d3.json("/names").then(function(sampleNames) {
        selector.selectAll("option")
                .data(sampleNames).enter()
                .append("option")
                .text(function(d) {return d;})
                .property("value", function(d) {return d;})
    }).then(function() {
      
        var initSample = d3.select("#selDataset").property("value");
    
        console.log(initSample);
    
        buildMetadata(initSample);
        draw(initSample);
    })

});



var draw = function() {
  
    var sample = d3.select("#selDataset").property("value");
    
    d3.json(`/samples/${sample}`).then((data) => {
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;
      var sample_values = data.sample_values;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
  
      var pieData = [
        {
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
  
      var pieLayout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.newPlot("pie", pieData, pieLayout);
    });

}

var buildMetadata = function() {

    var sample = d3.select("#selDataset").property("value");
    
    d3.json(`/metadata/${sample}`).then((d) => {
        console.log(d);

        mData = Object.entries(d);

        console.log(mData);

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        PANEL.selectAll("h6").data(mData).enter().append("h6").text(function(d) {return `${d[0]} : ${d[1]}`});

    });
}