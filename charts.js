function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");


  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value");
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample)
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultsArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultsArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

// DELIVERABLE 1: BAR CHART

  // 2. Use d3.json to load and retrieve the static/js/samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(sampleObject => sampleObject.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    console.log(yticks)
    var xticks = sample_values.slice(0,10).reverse();
    console.log(xticks)
    var labels = otu_labels.slice(0,10).reverse();
    console.log(labels)

    var colorList = [
      '#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
      '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0'
    ];

    const colors = colorList.slice(0, otu_labels.length)
    console.log(colors);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels,
      marker:{
        color: colors
      }
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);


    // DELIVERABLE 2: BUBBLE CHART

    var max = Math.max(sample_values);
    var min = Math.min(sample_values);

    // var bubbleColors = []
    var bubbleFraction = '';
    bubbleFraction = sample_values.forEach(element => {
      if(max - min === 0) return 1; // or 0, it's up to you
      var bubbleFraction = (element - min) / (max - min);
      return bubbleFraction
    });

        // 1. Create the trace for the bubble chart.
        var bubbleData = {
          x: otu_ids,
          y: bubbleData,
          text: otu_labels,
          mode: "markers",
           marker: {
              size: sample_values,
              color: colors,
              sizerefs: bubbleFraction,
              colorscale: 'Greens'
                }
            };    
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU ID"},
          showlegend: false
        }
    
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    

    // DELIVERABLE 3: GAUGE CHAR

    // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(dataObject => dataObject.id == sample);
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metadataArray[0];
    // Create a variable that holds the washing frequency
    var wash_frequency = parseInt(metaResult.wfreq);
    console.log(wash_frequency);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "1"},

        bar: {color: "black"},
        steps:[
          {range: [0, 3], color: "red"},
          {range: [3, 5], color: "orange"},
          {range: [5, 7], color: "yellow"},
          {range: [7, 9], color: "lightgreen"},
          {range: [9, 10], color: "green"}
        ],
        dtick: 1
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
};
