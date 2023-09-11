module.exports = {

    SalaryJob: {



    EMT: {
        nom: "EMT",
        prix: 46700,
        id: "1148683881332101211",
        maxPrice: 8000000,
        quotaPrice: 2500000,

        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    },
    AMB: {
        nom: "AMB",
        prix: 56000,
        id: "1148682088183251026",
        maxPrice: 7000000,
        quotaPrice: 2500000,
        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    },
    INF: {
        nom: "INF",
        prix: 70000,
        id: "1148681244842926211",
        maxPrice: 8000000,
        quotaPrice: 2500000,
        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    },
    MED: {
        nom: "MED",
        prix: 93334,
        id: "1148681001149661245",
        maxPrice: 8000000,
        quotaPrice: 2500000,
        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    },
    ANE: {
        nom: "ANE",
        prix: 116666,
        id: "1148681498078224384",
        maxPrice: 9000000,
        quotaPrice: 2500000,
        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    },
    CHI: {
        nom: "CHI",
        prix: 140000,
        id: "1148681424644354168",
        maxPrice: 10000000,
        quotaPrice: 2500000,
        calcSalary: function(value){
            let quotaMin = 40;
            let afterQuotaMin = value - quotaMin;
            if(afterQuotaMin <= 0) return {salary: this.quotaPrice, quota: "Quota non remplis"}
            if (afterQuotaMin * this.prix > this.maxPrice ) return {salary: this.maxPrice, limit: "Limite atteinte"}
            return {salary: afterQuotaMin * this.prix + this.quotaPrice}
        }
    }

    },
    PrimeGrade: {

        CDS: {
            nom: "Chef des services",
            id: "1148687063315652698",
            prix: 3000000,
        },

        DMU: {
            nom: "Cadre DMU",
            id: "1148750838840426558",
            prix: 2500000,
        },

        CASUP: {
            nom: "Cadre Supérieur",
            id: "1148686875708620830",
            prix: 2000000,
        },
        CA: {
            nom: "Cadre",
            id: "1148686820993941575",
            prix: 1500000,
        },
        CE: {
            nom: "Chef d'equipe",
            id: "1150481345206829096",
            prix: 1000000,

        },
        EMS: {
            nom: 'Emmergency Rescue',
            id: "1113289021481828372",
            prix:0,

        }



    }

}

