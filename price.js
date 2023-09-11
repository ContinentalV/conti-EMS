module.exports = {

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




}

