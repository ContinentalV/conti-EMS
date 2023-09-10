module.exports = {

    EMT: {
        nom: "EMT",
        prix: 46700,
        id: "1148683881332101211",
        maxPrice: 8000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    },
    AMB: {
        nom: "AMB",
        prix: 56000,
        id: "1148682088183251026",
        maxPrice: 7000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    },
    INF: {
        nom: "INF",
        prix: 70000,
        id: "1148681244842926211",
        maxPrice: 8000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    },
    MED: {
        nom: "MED",
        prix: 93334,
        id: "1148681001149661245",
        maxPrice: 8000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    },
    ANE: {
        nom: "ANE",
        prix: 116666,
        id: "1148681498078224384",
        maxPrice: 9000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    },
    CHI: {
        nom: "CHI",
        prix: 140000,
        id: "1148681424644354168",
        maxPrice: 10000000,
        verifyPrice: function(value){
            if (this.maxPrice > value) return this.maxPrice
        }
    }




}

