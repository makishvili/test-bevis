modules.require(
    ['block'],
    function (Block) {

        Block.initDomTree(document.body).done(function () {
            console.log("start")
        });
    });
