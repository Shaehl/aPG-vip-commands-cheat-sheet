const container = document.body.querySelector("#commandSections")

const tempNodeDisable = (node) => {
    node.disabled = true
    setTimeout(() => 
    node.disabled = false, 1000);
}

const copyButtonClick = (e) => {
    let {target} = e
    if (!target) return

    let commandTitle = target.parentNode.querySelector("#command")
    if (commandTitle) navigator.clipboard.writeText(commandTitle.innerText)

    tempNodeDisable(target)
    
}

const parseCommand = (item) => {
    let str = "/"
    if (typeof item == "object") {
        str += item.map(e => {
            switch (typeof e) {
                case "object":
                    return e.value
                default:
                    return e.toString()
            }
        }).join(" ")
    } else str += item.toString()
    return str
}

const updateCommandSection = (sectionItem) => {
    let commandTitle = sectionItem.div.querySelector("#command")
    if (commandTitle) commandTitle.innerText = parseCommand(sectionItem)
}

const onParamInput = (e, paramItem, sectionItem) => {
    let {target} = e
    paramItem.value = target.value
    updateCommandSection(sectionItem)
}

const createParameterDiv = (paramItem, sectionItem) => {
    let div = document.createElement("div")

    let label = document.createElement("label")
    label.for = paramItem.name
    label.innerText = paramItem.name + ": "
    div.appendChild(label)

    let baseNode
    switch (paramItem.type) {
        case "select":
            baseNode = document.createElement("select")
            baseNode.name = paramItem.name

            let list = lists[paramItem.list]
            if (list) {
                list.forEach(k => {
                    let optionNode = document.createElement("option")
                    optionNode.value = k
                    optionNode.innerText = k
                    baseNode.appendChild(optionNode)
                })
            }
            break
        default:
            baseNode = document.createElement("input")
            if (paramItem.value) baseNode.value = paramItem.value
            baseNode.type = paramItem.type
            break
    }
    if (baseNode) {
        baseNode.addEventListener("input", (e) => onParamInput(e, paramItem, sectionItem))
        onParamInput({
            target: baseNode
        }, paramItem, sectionItem)
        div.appendChild(baseNode)
    }
    return div
}

const addCommandSection = (sectionItem) => {
    let section = document.createElement("div")
    section.classList.add("section")
    sectionItem.div = section // omg

    let commandTitle = document.createElement("h1")
    commandTitle.id = "command"
    section.appendChild(commandTitle)
    updateCommandSection(sectionItem)

    sectionItem.forEach(e => {
        if (!e.type) return

        let node = createParameterDiv(e, sectionItem)
        section.appendChild(node)
    });

    let copyButton = document.createElement("button")
    copyButton.id = "copy-button"
    copyButton.innerText = "Copy command"
    copyButton.addEventListener("click", copyButtonClick)
    section.appendChild(copyButton)

    container.appendChild(section)
}

const initCommandSections = (arr) => arr.forEach(addCommandSection)