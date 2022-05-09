function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("sample")
        .property("value");
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultsarray = metadata.filter(sampleObject => 
      sampleobject.id == sample);
    var result = resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    var metadataFiltered = metadata.filter(bacteriaInfo => bacteriaInfo.id == sample[0]);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFiltered = samples.filter(bacteriaInfo => bacteriaInfo.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = sampleNames[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log(yticks)


    // 8. Create the trace for the bar chart. 
    var barData = [
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    
  });
}

function optionChanged(newSample) {
  updateMetadata(newSample);
  updateCharts(newSample);
}
