(function() {
    // $("#templates").load("templates.html .post-title");


    var validationRules;

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;;

    var start = window.mozAnimationStartTime || Date.now(); // Only supported in FF. Other browsers can use something like Date.now().

    var myReq = 0;


    taskAgent = new(function() {
        this.task_id = 0;
        this.number_of_rows = 0;
        this.processing = true;
    })





    validationRules = {
        fields: {
            first_name: {
                identifier: 'address',
                rules: [{
                    type: 'empty',
                    prompt: 'Please enter an address'
                }]
            }
        }
    };




    address_query = d3.map()
    address_query.set("paginate", 1)

    // var socket = io.connect('http://' + document.domain + ':' + location.port + '/updateview',{resource:'socket.io'});
    // var numbers_received = [];


    // socket.on('newnumber', function(msg) {
    // $('#log').append('<p>Received: ' + msg.number + '</p>');
    // });

    // $('#bycsv').on("click", function() {
    //     d3.select("#lineresults").style("display", "none")
    //     d3.select("#searchbylineform").style("display", "none")
    //     d3.select("#searchbyfile").style("display", "inline")

    // })




    function updateViewRow(addresses, rowNum) {
        d3.select("#lineresults")
            // console.log(addresses)
            // d3.select(".ui.active.inverted.dimmer").attr("class", "ui inverted dimmer")
        var dtable = d3.select("#table_values") //.selectAll('.td')
        console.log("tbody#table_values:nth-child(" + rowNum + ")")
        var row = dtable.selectAll("tr:nth-child(" + rowNum + ")");
        // row.html("")
        row.style("color", "black")
        row.selectAll("td:last-child").select("div").attr("class", "ui disabled inline loader")
        var ico = row.selectAll("td:last-child").append("i").attr("class", "ui checkmark icon") //.html("parcel: "+addresses[0]["ma_lp_id"])

        console.log(ico[0])
        $("tbody#table_values:nth-child(" + rowNum + ")" + ":last-child:nth-child(2)")
            .transition('flash');
    }






    function animateScene() {

        var dtable = d3.select("#table_values") //.selectAll('.td')
        console.log("tbody#table_values:nth-child(" + myReq + ")")
        var row = dtable.selectAll("tr:nth-child(" + myReq + ")");
        row.style("color", "gray")
        row.selectAll("td:last-child").append("div").attr("class", "ui active inline loader")

        console.log("animating", this, results)

        if (myReq !== undefined && myReq !== null) {
            console.log("myReq", myReq)
                // cancelAnimationFrame(myReq-1);

            // clearTimeout(frametimeout);
            // clearInterval(frametimeout);


            d3.queue()
                .defer(d3.json, "getInputAddressResults/" + results["current process"][myReq][address_query.get("streetname")] + " " + results["current process"][myReq][address_query.get("colmuniname")] + " ma " + "0" + results["current process"][myReq][address_query.get("colzip")])
                // .defer(d3.json,"zipcode_business_geojson/"+currentCity)
                .await(getInputAddressResults);
        }

        function getInputAddressResults(err, address_result) {
            d3.queue()
                .defer(d3.json, "get_by_par_id/" + address_result["current process"])
                // .defer(d3.json,"zipcode_business_geojson/"+currentCity)
                .await(getParcelByParcelID);

            function getParcelByParcelID(error, parcel_res) {
                updateViewRow(parcel_res, myReq)
                myReq = requestAnimationFrame(animateScene);
            }
        }

        // myReq = requestAnimationFrame(animateScene);
        // frametimeout = setTimeout(function() {

        // textReq = requestAnimationFrame(updateDynamicText)
        // Drawing code goes here
        // }, 100000 / fps);
    }



















    function populateTable() {

        curr_page = address_query.get("paginate")
        d3.queue()
            .defer(d3.json, "get_address/" + curr_page)
            .await(populatele);


        function populatele(error, addresses) {
            updateView(addresses)
        }
    }



    $("#addressenter").on("change", function(val) {
        d3.select(".ui.inverted.dimmer").attr("class", "ui active inverted dimmer")
        console.log(d3.select(this), val.target.value)
        d3.queue()
            .defer(d3.json, "getInputAddressResults/" + val.target.value)
            // .defer(d3.json,"zipcode_business_geojson/"+currentCity)
            .await(getInputAddressResults);
    })

    function getInputAddressResults(err, address_result) {

        console.log("address_result", address_result, address_result["current process"])

        d3.queue()
            .defer(d3.json, "get_by_par_id/" + address_result["current process"])
            // .defer(d3.json,"zipcode_business_geojson/"+currentCity)
            .await(getParcelByParcelID);

        function getParcelByParcelID(error, parcel_res) {
            updateView(parcel_res)

        }
    }



    $('#click_about_modal').on("click", function() {
        return $('#about_modal').modal('setting', 'transition', 'fade').modal('show');
    })






}).call(this);