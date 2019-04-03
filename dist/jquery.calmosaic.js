/*
 *  calmosaic - v2.1.0
 *  jQuery plugin to create github like contributions timeline
 *  https://github.com/routekick/calmosaic
 *
 *  Made by Routekick
 *  Under MIT License
 */
/* global moment */
(function ($) {
    "use strict";

    // Default Options
    var pluginName = "calmosaic",
        defaults = {
            title: null,
            months: 12,
            lastMonth: moment().month() + 1,
            lastYear: moment().year(),
            coloring: null,
            labels: {
                days: false,
                months: true,
                custom: {
                    weekDayLabels: null,
                    monthLabels: null
                }
            },
            legend: {
                show: true,
                align: "right",
                minLabel: "Less",
                maxLabel: "More"
            }
        };

    // The actual plugin constructor
    function Plugin(element, data, options) {
        this.element = element;
        this.data = data;
        this.settings = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Run Calandar Heatmap Function
            this.calendarHeatmap();

            // Check if the moment.js library is available.
            if (!moment) {
                console.log("The calmosaic plugin requires moment.js");
            }
        },
        parse: function () {
            var type = $.type(this.data);
            if (["array", "object"].indexOf(type) === -1) {
                console.log("Invalid data source");
                return null;
            } else {
                if (type === "array" && this.data.length > 0) {
                    var arrtype = $.type(this.data[0]);
                    if (arrtype === "object") {
                        if (this.data[0].date && this.data[0].count) {
                            return this.data.slice(0);
                        } else {
                            return null;
                        }
                    } else if (["string", "date"].indexOf(arrtype) > -1) {
                        if (moment(this.data[0]).isValid()) {
                            var obj = {};
                            for (var i in this.data) {
                                var d = moment(this.data[i]).format("YYYY-MM-DD");
                                if (!obj[d]) {
                                    obj[d] = 1;
                                } else {
                                    obj[d] += 1;
                                }
                            }
                            var arr = [];
                            for (var j in obj) {
                                arr.push({
                                    "count": obj[j],
                                    "date": j
                                });
                            }
                            return arr;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else if (type === "array" && this.data.length === 0) {
                    return [];
                } else if (type === "object" && !Object.empty(this.data)) {
                    var keys = Object.keys(this.data);
                    if (moment(keys[0]).isValid()) {
                        if ($.type(this.data[keys[0]]) === "number") {
                            var data = [];
                            for (var k in this.data) {
                                data.push({
                                    "count": this.data[k],
                                    "date": moment(k).format("YYYY-MM-DD")
                                });
                            }
                            return data;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        },
        index: function (data) {
            this.idx = {};
            for (var i in data) {
                this.idx[data[i].date] = i;
            }
        },
        pad: function (str, max) {
            str = String(str);
            return str.length < max ? this.pad("0" + str, max) : str;
        },
        calculateBins: function (events) {
            // Calculate bins for events
            var arr = [];
            var i;
            var bins = this.settings.steps || 4;
            var binlabels = ["0"];
            var binlabelrange = [
                [0, 0]
            ];
            for (i in events) {
                events[i].count = parseInt(events[i].count);
                arr.push(events[i].count);
            }
            var firstStep = Math.min.apply(Math, arr);
            var maxCount = Math.max.apply(Math, arr);
            var stepWidth = (maxCount - firstStep) / bins;

            if (stepWidth === 0) {
                stepWidth = maxCount / bins;
                if (stepWidth < 1) {
                    stepWidth = 1;
                }
            }

            // Generate bin labels
            for (i = 0; i < bins; i++) {
                if (!isFinite(firstStep)) {
                    binlabels.push("");
                    binlabelrange.push([null, null]);
                } else if (maxCount < bins) {
                    if ((i - (bins - maxCount)) >= 0) {
                        binlabels.push(String(1 + (i - (bins - maxCount))));
                        binlabelrange.push([
                            (1 + (i - (bins - maxCount))),
                            (1 + (i - (bins - maxCount)))
                        ]);
                    } else {
                        binlabels.push("");
                        binlabelrange.push([null, null]);
                    }
                } else if (maxCount === bins) {
                    binlabels.push(String((i + 1)));
                    binlabelrange.push([(i + 1), (i + 1)]);
                } else if ((maxCount - 2) === bins) {
                    if ((i + 1) === bins) {
                        binlabels.push(String((i + 1)) + "+");
                        binlabelrange.push([(i + 1), null]);
                    } else {
                        binlabels.push(String((i + 1)));
                        binlabelrange.push([(i + 1), (i + 1)]);
                    }
                } else {
                    var l = Math.round(i * stepWidth) + 1;
                    var ll = Math.round(i * stepWidth + stepWidth);
                    binlabelrange.push([l, ll]);
                    if (i === (bins - 1)) {
                        l += "+";
                    } else {
                        if (l !== ll) {
                            l += " to ";
                            l += ll;
                        }
                    }
                    binlabels.push(String(l));
                }
            }

            // Assign bins to counts
            for (i in events) {
                if (events[i].count === 0) {
                    events[i].level = 0;
                } else if (events[i].count - firstStep === 0) {
                    events[i].level = 1;
                } else if (!isFinite(firstStep)) {
                    events[i].level = bins;
                } else {
                    events[i].level = this.matchBin(binlabelrange, events[i].count);
                }
            }

            return {
                events: events,
                bins: binlabels
            };
        },
        matchBin: function (range, value) {
            for (var r in range) {
                if (value >= range[r][0] && value <= range[r][1]) {
                    return r;
                }
            }
            return 0;
        },
        matchDate: function (obj, key) {
            if (this.idx[key]) {
                return obj[this.idx[key]];
            } else {
                return null;
            }
        },
        calendarHeatmap: function () {
            var data = this.parse();

            if ($.type(data) !== "array") {
                return;
            }

            // Generate lookup index
            this.index(data);

            var calc = this.calculateBins(data);
            var events = calc.events;
            var binLabels = calc.bins;
            var currMonth = this.settings.lastMonth;
            var currYear = this.settings.lastYear;
            var months = this.settings.months;
            var i;

            // Empty container first
            $(this.element).empty();

            // Add a title to the container if not null
            if (this.settings.title) {
                $("<h3>", {
                    class: "ch-title",
                    html: this.settings.title
                }).appendTo($(this.element));
            }

            var $graph = $("<div class='ch-graph' />");
            var $months = $("<ul class='ch-months' />");
            var $days = $("<ul class='ch-days'></ul>");

            $graph.append($months);
            $graph.append($days);

            $(this.element).append($graph);

            // Start building the months
            for (i = months; i > 0; i--) {
                var month = currMonth - i;
                var year = currYear;
                if (month < 0) {
                    year -= 1;
                    month += 12; // TODO: FIX for more than one year
                }

                // Build Month
                var monthName = moment().set({
                        "month": month,
                        "year": year
                    })
                    .format("MMM");
                if (this.settings.labels.custom.monthLabels) {
                    if ($.type(this.settings.labels.custom.monthLabels) === "array") {
                        monthName = this.settings.labels.custom.monthLabels[month] || "";
                    } else {
                        monthName = moment().set({
                                "month": month,
                                "year": year
                            })
                            .format(this.settings.labels.custom.monthLabels);
                    }
                }

                $months.append("<li>" + monthName + "</li>");

                // Get the number of days for the month
                var days = moment().set({
                    "month": month,
                    "year": year
                }).daysInMonth();

                // Build days
                for (var j = 0; j < days; j++) {
                    var str = year + "-" + this.pad((month + 1), 2);
                    str += "-" + this.pad((j + 1), 2);
                    var obj = this.matchDate(events, str);

                    if (obj) {
                        var title = obj.count + " on ";
                        title += moment(obj.date).format("ll");

                        var color = "";

                        if (this.settings.coloring) {
                            color = " " + this.settings.coloring + "-" + obj.level;
                        }

                        $("<li/>", {
                            "class": "ch-day lvl-" + obj.level + color,
                            "title": title
                        }).appendTo(
                            $days
                        );
                    } else {
                        $("<li/>", {
                            "class": "ch-day"
                        }).appendTo(
                            $days
                        );
                    }
                }
            }

            // Add a legend
            if (this.settings.legend.show) {
                // Add the legend container
                $("<div>", {
                        class: "ch-legend"
                    })
                    .appendTo($graph)
                    .append("<small>" + (this.settings.legend.minLabel || "") + "</small>")
                    .append("<ul class=\"ch-lvls\"></ul>")
                    .append("<small>" + (this.settings.legend.maxLabel || "") + "</small>");

                if (this.settings.legend.align === "left") {
                    $(".ch-legend", this.element).addClass("ch-legend-left");
                }

                if (this.settings.legend.align === "center") {
                    $(".ch-legend", this.element).addClass("ch-legend-center");
                }

                // Add the legend steps
                for (i = 0; i < binLabels.length; i++) {
                    $("<li>", {
                            "class": "ch-lvl lvl-" + i,
                            "title": binLabels[i],
                            "data-toggle": "tooltip"
                        })
                        .appendTo($(".ch-lvls", this.element));
                    if (this.settings.coloring) {
                        $(".ch-lvls li:last", this.element)
                            .addClass(this.settings.coloring + "-" + i);
                    }
                }
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (data, options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, data, options));
            }
        });
    };
})(jQuery);
