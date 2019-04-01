# jQuery  Calendar Heat Map

> This fork is very modified from the real project

This [jQuery] plugin allows to conveniently display data like contributions on a day by day basis, indicating the count by colors, using css grid system

![Calendar Heat Map](https://user-images.githubusercontent.com/17254073/55343067-ff8f3d00-54b2-11e9-918d-8cc26d3dccc0.PNG)

## Install

+ Copy the cdn URL for `.min.js` and `.min.css` file and insert them into your html file

    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/routekick/jquery-calendar-heatmap/dist/jquery.CalendarHeatmap.min.css" />

    <!-- Don't forget to add it after jQuery -->
    <script src="https://cdn.jsdelivr.net/gh/routekick/jquery-calendar-heatmap/dist/jquery.CalendarHeatmap.min.css"></script>
    ```

## Usage

1. Include [jQuery] and [Moment.js] into the header of your html file:

    ```html
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.24.0/moment.min.js"></script>
    ```

2. Include the plugin *after* [jQuery] and [Moment.js]:

    ```html
    <script src="dist/jquery.CalendarHeatmap.min.js"></script>
    ```

3. When the DOM is ready call the plugin:

    ```JavaScript
    $("#element").CalendarHeatmap( data, options );
    ```

## Data

The provided date needs to be a valid [date format] that can be interpreted by [Moment.js].
The date needs to provide at least year month and day, e.g. `YYYY-MM-DD`.

```JavaScript
// Provide dates as an array of objects.
// Provide the keys `count` and date. Make sure, each date provided is unique for that day.
var data = [{count: 2, date: "2017-09-23"}, ...]

// Provide dates as an array.
// The dates can have any format as long as year month and day are provided.
var data = [ "2017-09-23", ...]

// Provide dates as an object.
// The key is the date, the value is event count. Make sure the date has this format: `YYYY-MM-DD`
var data = { "2017-09-23": 2, ...}
```

## Options

The Calendar Heat Map can be modified using the following options:

```JavaScript
// Default options for the heatmap
{
    title: null,
    months: 12,
    lastMonth: 1,
    lastMonth: "current month",
    lastYear: "current year",
    labels: {
        days: false,
        months: true,
        custom: {
            monthLabels: null
        }
    },
    legend: {
        show: true,
        align: "right",
        minLabel: "Less",
        maxLabel: "More"
    }
}
```

### title

You can add a title to the calendar heatmap. If no title is set, or set to `null` it will get ignored.

### months

The number of months to display. If not set, the default number of months to be displayed is `12`.

### lastMonth

The last month shown in the calendar heatmap. Set the month by setting the value between `1 - 12`. If not set, the default is the current month.

### lastYear

The year of the last month shown. Use the four letter notation, e.g. `2017`. If not set, the default is the current year.

### coloring

There is a set of different color gradients available. By default `standard` is selected.

#### Available Color Gradients

The following gradients are available based of [Matplotlib] for Python: `blue`, `earth`, `electric`, `green`, `picknick`, `red`, `teal`, `standard`, `viridis`. If you want to define your own color gradient, use `custom` and add the classes defining the colors to your css stylesheet as described below.

#### Custom Gradient
Just add the colors to be used for the 4 steps as in the example. In this case the name set for `coloring` would be the base class name `custom`.

```css
.custom-1 {
  background-color: #a6c96a !important;
}
.custom-2 {
  background-color: #5cb85c !important;
}
.custom-3 {
  background-color: #009e47 !important;
}
.custom-4 {
  background-color: #00753a !important;
}
```

### labels (Skipped)

The calendar heatmap has two sets of labels. One for week days and one for months. By default only the month labels are shown. The visibility can be set for either by setting them to `true` or `false`.

#### Custom format

Month labels can be formatted using the [Moment.js] format (e.g. `MM` for the month number or `MMMM` for the full month name). Use an array, to provide custom labels. For months the array needs to contain 12 elements, e.g. `["janv", "févr", ..., "déc."]`.

```JavaScript
labels: {
    months: true,
    custom: {
        monthLabels: null
    }
}
```

### `legend`

The legend for the calendar heatmap is located below the heatmap and visible by default. The visibility can be set by setting `show` to `true` or `false`. Set the alignment using `align`. Options are `right`, `center` or `left`. Labels for min and max can be set using `minLabel` and `maxLabel`. Use `null` to hide the labels.

```JavaScript
legend: {
    show: true,
    align: "right",
    minLabel: "Less",
    maxLabel: "More"
}
```
