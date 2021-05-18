Dropzone.options.frmTarget = {
    autoProcessQueue: false,
    parallelUploads: 10,
    uploadMultiple: true,
    url: '/team/addEntrega',
    paramName: "archivo",
    dictDefaultMessage: 'Dropea aquí tus archivos a entregar',
    init: function () {
        var myDropzone = this;
        // Update selector to match your button
        $("#button").click(function (e) {
            e.preventDefault();
            myDropzone.processQueue();
        });
        myDropzone.on('sendingmultiple', function (file, xhr, formData) {
            var data = $('#form').serializeArray();
            $.each(data, function (key, el) {
                console.log(el.name, el.value)
                formData.append(el.name, el.value);
            });
            console.log(formData.getAll("time"))
        });
        myDropzone.on("successmultiple", function(file, responseText) {
            location.reload(true);
        });
    }
}