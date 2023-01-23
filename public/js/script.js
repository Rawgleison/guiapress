window.addEventListener("load", (event) => {
    var myAlert = document.getElementById("myAlert");
    var bsAlert = new bootstrap.Alert(myAlert);
    if (this.success == undefined) {
        bsAlert.close();

    }
    console.log("Documento lido!!!", this.success);
});