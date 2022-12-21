var spec2 = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "A plot of Game Sales",
  width: 600,
  height: 400,
  padding: 10,
  signals: [
    {
      name: "mouseX",
      on: [
        {
          events: "*:mousemove",
          update: "event.x"
        }
      ]
    },
    {
      name: "mouseY",
      on: [
        {
          events: "*:mousemove",
          update: "event.y"
        }
      ]
    },
    {
      name: "displayText",
      value: {},
      on: [
        {
          events: "rect:mouseover",
          update: "datum"
        },
        {
          events: "rect:mouseout",
          update: "{}"
        }
      ]
    }
  ],
  data: [
    {
      name: "games",
      url: "https://raw.githubusercontent.com/vsiddireddy/gamesales/main/vgsales.csv",
      format: { type: "csv" },
      transform: [
        {
          type: "aggregate",
          groupby: ["Publisher"],
          fields: ["Global_Sales"],
          ops: ["sum"],
          as: ["total"]
        },
        {
          type: "collect",
          sort: { field: "total", order: "descending" }
        },
        {
          type: "filter",
          expr: "datum.Publisher == 'Nintendo' || datum.Publisher == 'Microsoft Game Studios' || datum.Publisher == 'Sony Computer Entertainment'"
        }
      ]
    },
  ],
  marks: [
    {
        type: "rect",
        from: { data: "games"},
        encode: {
            enter: {
                x: { field: "Publisher", scale: "xScale"},
                y2: { value: 0, scale: "yScale"},
                y: { field: "total", scale: "yScale"},
                width: { value: 50}
            }
        }
    },
    {
        type: "text",
        encode: {
          enter: {
            x: {value: -10},
            y: {value: -10},
            align: {value: "center"}
          },
          update: {
            x: {signal: "displayText.Publisher", scale: "xScale"},
            y: {signal: "displayText.total", scale: "yScale"},
            dx: { value: 15 },
            dy: { value: 10 },
            text: {signal: "displayText.total"},
            fill: { value: "black" },
            fillOpacity: [
              { test: "displayText.total > 0", value: 1 },
              { value: 0 }
            ]
          }
        }
    }
  ],
  scales: [
    {
      name: "xScale",
      type: "band",
      domain: { data: "games", field: "Publisher" },
      range: "width",
      padding: 0.7
    },
    {
      name: "yScale",
      type: "linear",
      domain: { data: "games", field: "total" },
      range: "height"
    }
  ],
  axes: [
      {
          scale: "xScale",
          orient: "bottom",
          title: "Publisher"
      },
      {
          scale: "yScale",
          orient: "left",
          title: "Total Global Sales (in millions)",
          grid: true
      }
  ]
}

// create spec
var spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "A plot of Game Sales",
  width: 800,
  height: 700,
  padding: 10,
  signals: [
    {
      name: "mouseX",
      on: [
        {
          events: "*:mousemove",
          update: "event.x"
        }
      ]
    },
    {
      name: "mouseY",
      on: [
        {
          events: "*:mousemove",
          update: "event.y"
        }
      ]
    },
    {
      name: "displayText",
      value: {},
      on: [
        {
          events: "symbol:mouseover",
          update: "datum"
        },
        {
          events: "symbol:mouseout",
          update: "{}"
        }
      ]
    },
    {
        name: "Company",
        value: ['Nintendo'],
        bind: {
            input: "select",
            options: ['Nintendo', 'Microsoft Game Studios', 'Sony Computer Entertainment'],
        }
    }
  ],
  data: [
    {
      name: "games",
      url: "https://raw.githubusercontent.com/vsiddireddy/gamesales/main/vgsales.csv",
      format: { type: "csv" },
      transform: [
        {
          type: "filter",
          expr: "datum.Year != 'N/A'"
        },
        {
          type: "filter",
          expr: "datum.Publisher == Company"
        },
        {
          type: "collect",
          sort: { field: "Year", order: 'ascending' }
        }
      ]
    },
    {
      name: "aggregated",
      source: "games",
      transform: [
        {
          type: "aggregate",
          groupby: ["Year", "Publisher"],
          fields: ["Global_Sales"],
          ops: ["sum"],
          as: ['total']
        }
      ]
    }
  ],
  scales: [
    {
      name: "xScale",
      type: "linear",
      zero: false,
      domain: { data: "aggregated", field: "Year" },
      range: "width"
    },
    {
      name: "yScale",
      type: "linear",
      domain: { data: "aggregated", field: "total" },
      range: "height"
    }
  ],
  axes: [
      {
          scale: "xScale",
          orient: "bottom",
          title: "Year",
          format: "d"
      },
      {
          scale: "yScale",
          orient: "left",
          title: "Global Sales (in millions)",
          grid: true
      }
  ],
  marks: [
    {
      type: "symbol",
      from: { data: "aggregated" },
      encode: {
        enter: {
          x: {field: "Year", scale: "xScale"},
          y: {field: "total", scale: "yScale"}
        }
      }
    },
    {
        type: "text",
        encode: {
          enter: {
            x: {value: -10},
            y: {value: -10},
            align: {value: "center"}
          },
          update: {
            x: {signal: "displayText.Year", scale: "xScale"},
            y: {signal: "displayText.total", scale: "yScale"},
            text: {signal: "displayText.total"},
            fillOpacity: [
              { test: "displayText.total > 0", value: 1 },
              { value: 0 }
            ]
          }
        }
    },
    {
      type: "group",
      from: {
        facet: {
          name: "series",
          data: "aggregated",
          groupby: "show"
        }
      },
        marks: [
          {
            type: "line",
            from: { data: "series" },
            encode: {
              enter: {
                x: { field: "Year", scale: "xScale" },
                y: { field: "total", scale: "yScale" },
              }
            }
          }
        ]
      }
  ],
  title: {
      text: "Total Game Copies Sold by Publisher"
  }
};

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
                   .logLevel(vega.Error)
                   .renderer("svg")
                   .initialize("#view")
                   .hover();

// run it
view.run();

var runtime2 = vega.parse(spec2);
var view2 = new vega.View(runtime2).logLevel(vega.Error).renderer("svg").initialize("#view2").hover();
view2.run();
