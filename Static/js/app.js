// data URL from the assignment
const dataLink = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// function to build the demographic info box
function showMetadata(selectedId) {
  d3.json(dataLink).then(function(info) {
    let allMeta = info.metadata;
    let chosenPerson = allMeta.find(person => person.id == selectedId);

    let box = d3.select("#sample-metadata");
    box.html(""); // clear old data

    // loop through all keys and values
    for (let key in chosenPerson) {
      box.append("h6").text(`${key.toUpperCase()}: ${chosenPerson[key]}`);
    }
  });
}

// function for bar and bubble charts
function drawCharts(idPicked) {
  d3.json(dataLink).then(function(jsonData) {
    let allSamples = jsonData.samples;
    let personData = allSamples.find(entry => entry.id === idPicked);

    let bacteriaIDs = personData.otu_ids;
    let labels = personData.otu_labels;
    let counts = personData.sample_values;

    // top 10 bar chart
    let barInfo = [{
      x: counts.slice(0,10).reverse(),
      y: bacteriaIDs.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barSettings = {
      title: "Top 10 OTUs Found in Sample",
      margin: { l: 80, r: 20, t: 40, b: 40 }
    };

    Plotly.newPlot("bar", barInfo, barSettings);

    // bubble chart with everything
    let bubbles = [{
      x: bacteriaIDs,
      y: counts,
      text: labels,
      mode: "markers",
      marker: {
        size: counts,
        color: bacteriaIDs,
        colorscale: "Viridis"
      }
    }];

    let bubbleSettings = {
      title: "OTUs in Sample",
      xaxis: { title: "OTU ID" },
      showlegend: false
    };

    Plotly.newPlot("bubble", bubbles, bubbleSettings);
  });
}

// this runs when the page loads
function startDashboard() {
  d3.json(dataLink).then(function(data) {
    let dropMenu = d3.select("#selDataset");
    let nameList = data.names;

    // put each name in the dropdown
    for (let i = 0; i < nameList.length; i++) {
      dropMenu.append("option").text(nameList[i]).property("value", nameList[i]);
    }

    // use the first one by default
    let firstOne = nameList[0];
    drawCharts(firstOne);
    showMetadata(firstOne);
  });
}

// when the user picks a new ID
function optionChanged(newId) {
  drawCharts(newId);
  showMetadata(newId);
}

// initialize everything
startDashboard();
