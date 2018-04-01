function populateFieldsSelections(data) {
    d3.select("#banner").style("display", "none");
    d3.select("#upline").append("hr");
    row0 = d3.select("#upconfigs").append("div").attr("class", "row");
    row1 = d3.select("#upconfigs").append("div").attr("class", "row");
    // row2 = d3.select("#upconfigs").append("div").attr("class", "row");
    // row3 = d3.select("#upconfigs").append("div").attr("class", "row");

    row4 = d3.select("#upconfigs").append("div").attr("class", "row");

    rowS = d3.select("#upconfigs").append("div").attr("class", "row");
    rowS.append("div").attr("class", "six wide column").append("div").attr("class", "ui small submit button").attr("id", "uploadsubmit").html("submit file").on("click", submitClicked)

    row0.append("div").attr("class", "eight wide column").append("h4").html("address components")
    row0.append("div").attr("class", "eight wide column") //.append("h4").html("choose columns names")
    row1.append("div").attr("class", "eight wide column").attr("id", "columnamesstr")

    // row1.append("div").attr("class", "eight wide column")
    // row2.append("div").attr("class", "eight wide column").attr("id", "columnamescity")

    // row2.append("div").attr("class", "eight wide column")
    // row3.append("div").attr("class", "eight wide column").attr("id", "columnameszip")

    // row3.append("div").attr("class", "eight wide column")

    row4.append("div").attr("class", "eight wide column").attr("id", "columnamesdsagainst")

    row4.append("div").attr("class", "eight wide column")

    field_names = data.fields.split(",");
    field_names.shift();
    console.log(field_names)


    colselstr = d3.select("#columnamesstr");
    colselcity = d3.select("#columnamescity");
    colselzip = d3.select("#columnameszip");
    // colselds = d3.select("#columnamesdsagainst");
    // injecting the selection for drop down for address string
    cls = colselstr.append("select").attr("class", "ui compact dropdown button").attr("name", "columns"
        // ).attr("multiple"," "
    ).attr("id", "addressstring")
    cls.append("option").attr("value", "").html("address string")

    // clm = colselcity.append("select").attr("class", "ui compact dropdown button").attr("name", "columns"
    //     // ).attr("multiple"," "
    // ).attr("id", "colmuniname")

    // clm.append("option").attr("value", "").html("municipality name")

    // clz = colselzip.append("select").attr("class", "ui compact dropdown button").attr("name", "columns"
    //     // ).attr("multiple"," "
    // ).attr("id", "colzip")

    // clz.append("option").attr("value", "").html("zipcode")

    $('#addressstring').dropdown({
        allowAdditions: false,
        // when selected, it will remove the selected from the list, and add it to the address query map
        onChange: function(val) {


            address_query.set("streetname", val)

        }
    })

    // $('#colmuniname').dropdown({
    //     allowAdditions: false,
    //     // when selected, it will remove the selected from the list, and add it to the address query map
    //     onChange: function(val) {


    //         address_query.set("colmuniname", val)

    //     }
    // })

    // $('#colzip').dropdown({
    //     allowAdditions: false,
    //     // when selected, it will remove the selected from the list, and add it to the address query map
    //     onChange: function(val) {


    //         address_query.set("colzip", val)

    //         // .append("div").attr("class", "ui active progress").append("div").attr("class","bar").append("div").attr("class","progress")


    //     }
    // })

    $('#colds').dropdown({
        allowAdditions: true,
        // when selected, it will remove the selected from the list, and add it to the address query map
        onChange: function(val) {


            address_query.set("target_dataset", val)

        }
    })


    colsops = d3.select('#addressstring').selectAll('option').data(field_names)

    colsops.enter().append("option").attr('data-id', function(d) {
        return d;
    }).attr('value', function(d) {
        return d;
    }).html(function(d) {
        console.log("d in op", d)
        return d;
    })

    // colsopm = d3.select('#colmuniname').selectAll('option').data(field_names)
    // colsopm.enter().append("option").attr('data-id', function(d) {
    //     return d;
    // }).attr('value', function(d) {
    //     return d;
    // }).html(function(d) {
    //     console.log("d in op", d)
    //     return d;
    // })

    // colsopz = d3.select('#colzip').selectAll('option').data(field_names)
    // colsopz.enter().append("option").attr('data-id', function(d) {
    //     return d;
    // }).attr('value', function(d) {
    //     return d;
    // }).html(function(d) {
    //     console.log("d in op", d)
    //     return d;
    // })

}


function submitClicked() {

    address_query.set("target_dataset", "all_parcels_16")
    d3.select(".ui.inverted.dimmer").attr("class", "ui active inverted dimmer")
    d3.queue()
        .defer(d3.json, '/parcelprocess/' + "config=," + address_query.get("filename") + "," + address_query.get("streetname") + "," + address_query.get("colmuniname") + "," + address_query.get("colzip") + "," + address_query.get("target_dataset"))
        .await(parcelsrsults);
}


function parcelsrsults(error, results) {


    console.log('connection made successfully!');
    console.log(results)




    updateView(results["current process"])
    d3.select("#upconfigs").html("")
    fps = 5;
    console.log("task agents1 ", taskAgent.number_of_rows)
        // frametimeout = setTimeout(function() {
    myReq = requestAnimationFrame(animateScene);
    // textReq = requestAnimationFrame(updateDynamicText)
    // Drawing code goes here
    // }, 10000 / fps);
    // animateScene()


}

function updateView(addresses) {
    d3.select("#lineresults").html("")
    d3.select(".ui.active.inverted.dimmer").attr("class", "ui inverted dimmer")
    d3.select("#lineresults").style("display", "block")
    console.log(addresses)
    var one_b = addresses[0]
    var kes = Object.keys(one_b);
    kes.push("processing ")


    thead = d3.select("#lineresults").append("table").attr("class", "ui very compact table")

    trow2 = thead.append("thead").append("tr")
    trow = trow2.selectAll("th")
    trow.data(kes).enter().append("th").html(function(d, i) {
        console.log(d)
        return d;
    })

    thead.append("tbody").attr("id", "table_values")

    var dtable = d3.select("#table_values").selectAll('.td')
    dtable.data(
        addresses,
        function(d) { return d["bid"]; }
    ).enter().append("tr").html(function(d, i) {
        var ret = "";
        d[kes[kes.length - 1]] = ""
        for (var i = 0; i < kes.length; i++) {
            ret = ret + "<td>" + d[kes[i]] + "</td>"
        }
        // ret = ret + "<td>" + " --- " + "</td>"
        return ret; //"<td>"+ d["Land_Parcel_ID"]+"</td>" + "<td>"+ d["TLID_1"]+"</td>" + "<td>" + 35 + "</td>" + "<td>" + d["minNum_1"] + " "+d["street_1"] + " "+d["suffix_1"] + "</td>"  + "<td>" + d["LU"] + "</td>" 
    })


}