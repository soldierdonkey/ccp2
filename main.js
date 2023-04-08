calculate()
document.getElementById("includeratio").onclick = () => {
    if (document.getElementById("ratio").hidden != true) {
        let prev = 0;
        let skipped = false;
        [...document.getElementsByClassName("box")].forEach(i => {
            i.style.width = "125px"
            i.style.left = `${prev}%`
            if(prev == 25 && skipped == false) {skipped = true}
            else prev += 25
        })
        document.getElementById("ratio").hidden = true
    } else {
        let prev = 0;
        [...document.getElementsByClassName("box")].forEach(i => {
            i.style.width = "100px"
            i.style.left = `${prev}%`
            prev += 20
        })
        document.getElementById("ratio").hidden = false
    }
    calculate()
}
document.getElementById("inputType").addEventListener("change", () => {
    let inputType = document.getElementById("inputType").value
    if(inputType == "Grams") document.getElementById("mmInput").hidden = false
    else document.getElementById("mmInput").hidden = true
})
document.getElementById("outputType").addEventListener("change", () => {
    let inputType = document.getElementById("outputType").value
    if(inputType == "Grams") document.getElementById("mmOutput").hidden = false
    else document.getElementById("mmOutput").hidden = true
})

;[...document.querySelectorAll("input"), ...document.querySelectorAll("select")].forEach(i => {
  i.onchange = () => {
    calculate()
  }
})
function calculate() {
    let input = document.getElementById("input").value
    let molar_ratio = !document.getElementById("ratio").hidden ? document.getElementById("ratioTop").value/document.getElementById("ratioBottom").value : 1
    let inputType = document.getElementById("inputType").value
    let outputType = document.getElementById("outputType").value
    if(inputType == "Grams" && isNaN(parseFloat(document.getElementById("mmInput").value)+1)){
        console.error("Wrong input type!")
    }
    let inputToMole = {
        Litres : 1/22.4,
        Grams : 1/parseFloat(document.getElementById("mmInput").value),
        Parts : 1/6.022e+23,
    }
    let inputToMoleHTML = {
        Litres : {t:"1 mole", b:"22.4 Litres at STP"},
        Grams : {t:"1 mole",b:`${parseFloat(document.getElementById("mmInput").value)} Grams`},
        Parts : {t:"1 mole",b:"6.022E23 Parts"},
    }
    if(outputType == "Grams" && isNaN(parseFloat(document.getElementById("mmOutput").value)+1)){
        console.error("Wrong output type!")
    }
    let moleToOutput = {
        Litres : 22.4,
        Grams : parseFloat(document.getElementById("mmOutput").value),
        Parts : 6.022e+23,
    }
    let moleToOutputHTML = {
        Litres : {b:"1 mole", t:"22.4 Litres at STP"},
        Grams : {b:"1 mole",t:`${parseFloat(document.getElementById("mmOutput").value)} Grams`},
        Parts : {b:"1 mole",t:"6.022E23 Parts"},
    }
    let inSplit = (input).split("")
    if(inSplit[inSplit.length-4] == "e") {
        console.log("e")
        inEndSlice = []
        inEndSlice.push(inSplit.pop())
        inEndSlice.push(inSplit.pop())
        inSplit.pop()
        inSplit.pop()
        sigFigs = findSigFig(String(inSplit.join("")))
    }
    else {
        sigFigs = findSigFig(String(input))
    }
    console.log(sigFigs)
    
    document.getElementById("toMoleTop").innerText = inputToMoleHTML[inputType].t
    document.getElementById("toMoleBottom").innerText = inputToMoleHTML[inputType].b
    document.getElementById("fromMoleTop").innerText = moleToOutputHTML[outputType].t
    document.getElementById("fromMoleBottom").innerText = moleToOutputHTML[outputType].b
    let outSplit = (parseFloat(input)*inputToMole[inputType]*molar_ratio*moleToOutput[outputType]+"").split("")
    if(outSplit[outSplit.length-4] == "e") {
        outEndSlice = []
        outEndSlice.push(outSplit.pop())
        outEndSlice.push(outSplit.pop())
        outEndSlice.push(outSplit.pop())
        outSplit.pop()
        output = calcSigFig(parseFloat(outSplit.join("")), sigFigs)
        output += "e" + outEndSlice[2] + outEndSlice[1] + outEndSlice[0]
    }
    else {
        output = calcSigFig(parseFloat(input)*inputToMole[inputType]*molar_ratio*moleToOutput[outputType], sigFigs)
    }
    console.log(sigFigs)
    document.getElementById("output").innerText = output
    document.getElementById("sigFigs").innerText = sigFigs
}
function findSigFig(j) {
    j = j.split("")
    let out = 0
    let hasDecimals = false
    while (j[0] == "0") {
        j.shift()
    }
    j = j.join("")
    for (let i = 0; i < j.length; i++) {
        const letter = j[i];
        if(letter == ".") hasDecimals = true
    }
    if(hasDecimals){
        return j.length-1
    }
    else {
        for (let i = 0; i < j.length; i++) {
            if(j[i] == 0) break
            out++
        }
        return out
    }
}
function calcSigFig(j, count) {
    return Number(j).toPrecision(count)
}
elements.forEach(ele => {
    let mmHTML = `<option value="${ele.atomic_mass}">${ele.name}</option>`
    document.getElementById("mmSelect").innerHTML += mmHTML
})
document.getElementById("mmSelect").addEventListener("change", () => {
    document.getElementById("mmCalcOutput").innerText = document.getElementById("mmSelect").value
})
document.getElementById("mmText").addEventListener("change", () => {
    let eleList = []
    let eleSymbol = ""
    let eleCount = 1
    let index = 0
    let num = 0
    let wait = false
    let list = document.getElementById("mmText").value.split("")
    document.getElementById("mmText").value.split("").forEach(i => {
        if(isNaN(parseInt(i))) {
            if(isUpperCase(i)) {
                wait = false
                eleList.push({symbol: eleSymbol, count: eleCount})
                eleSymbol = i
                eleCount = 1
            }
            else {
                eleSymbol += i
            }
        }
        else {
            if(wait == false){
                num = i
                j = index
                while(!isNaN(parseInt(list[j+1]))) {
                    j++
                    num += list[j]
                }
                eleCount = parseInt(num)
                wait = true
            }
        }
        index++
    })
    eleList.shift()
    eleList.push({symbol: eleSymbol, count: eleCount})
    let out = 0
    eleList.forEach(i => {
        elements.forEach(j => {
            if(j.symbol == i.symbol) {
                out+=j.atomic_mass*i.count
            }
        })
    })
    out = String(out.toPrecision(10)).split("")
    for (let i = out.length-1; i != -1; i--) {
        if(out[i] == "0") out.pop()
        else break
    }
    document.getElementById("mmCalcTextOutput").innerText = out.join("")
})
function isUpperCase(str) {
    return str == str.toUpperCase() && str != str.toLowerCase();
}