(function() {

    $("#header-template").load("header-template.html", function() {
        $("#log-in").on("click", function() {
            d3.select(this).style("display", "none");
            d3.select("#log-out").style("display", "block");
        })
    })


    $("#navigator-tab").load("navigator-template.html", function() {
        $('#nav .item')
            .tab();

    });
    $("#examples-tab").load("examples-template.html", function() {
        $('#nav .item')
            .tab();

    });
    $("#howtopopulate-tab").load("howtopopulate-template.html", function() {
        $('#nav .item')
            .tab();

    });
    $("#home-tab").load("home-template.html", function() {

        $('#bycsv').on("click", function() {
            d3.select("#lineresults").style("display", "none")
            d3.select("#searchbylineform").style("display", "none")
            d3.select("#searchbyfile").style("display", "inline")

        })



        $('#byaddress').on("click", function() {
            d3.select("#lineresults").style("display", "block")
            d3.select("#searchbyfile").style("display", "none")
            d3.select("#searchbylineform").style("display", "inline")

        })


        $('#upload-input').on('change', function() {
            console.log("$(this).", $(this), $(this).get(0));
            console.log("$('#upload-input')", $('#upload-input'));
            var files = $('#upload-input').get(0).files;
            console.log("files", files)
            if (files.length > 0) {
                // One or more files selected, process the file upload

                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                var formData = new FormData();
                // console.log(formData)
                // loop through all the selected files
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log("file", file);

                    // add the files to formData object for the data payload
                    formData.append('uploads[]', file.name);
                }
                console.log(formData)


            }
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log('upload successful!', data);
                    fileUploaded(file.name)
                }
            });
        });

        function fileUploaded(name) {
            console.log("file uploaded: name", name)
            $.ajax({
                url: '/processuploaded/' + name,
                type: 'GET',
                // data: name,
                // processData: false,
                // contentType: false,
                success: function(data) {
                    console.log("python processed the data,results are:");
                    console.log(data);
                    console.log("checking if there has been a task initiated for doing this job");
                    address_query.set("filename", name)
                    populateFieldsSelections(data)
                }
            });
            // make call to web service to triger process of the file just got uploaded
        }

    });


    $("#dashboard-tab").load("dashboard-template.html");
    // document.getElementById("pandaframe").setAttribute("src", "/panda/tree");

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "http://localhost:8888");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    document.getElementById("pandaframe").appendChild(ifrm);



}).call(this);