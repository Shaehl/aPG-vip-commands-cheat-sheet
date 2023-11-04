const container = document.body.querySelector("#commandSections")

const tempNodeDisable = (node) => {
    node.disabled = true
    setTimeout(() => 
    node.disabled = false, 666);
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
        str += item.struct.map(e => {
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

const r = (parentNode, optionsList) => {
    optionsList.forEach(v => {
        let node
        if (typeof v == "object") {
            let groupName = v.groupName
            if (groupName) {
                node = document.createElement("optgroup")
                node.label = groupName
                r(node, v.optionsList)
            }
        } else {
            node = document.createElement("option")
            node.value = v
            node.innerText = v
        }
        if (node) parentNode.appendChild(node)
    })
}

const createParameterDiv = (paramItem, sectionItem) => {
    let form = document.createElement("form")

    let label = document.createElement("label")
    label.for = paramItem.name
    label.innerText = paramItem.name
    form.appendChild(label)

    let baseNode
    switch (paramItem.type) {
        case "select":
            baseNode = document.createElement("select")
            baseNode.name = paramItem.name

            let {optionName} = paramItem
            let optionsList = options[optionName]
            if (optionsList) r(baseNode, optionsList)
            break
        default:
            baseNode = document.createElement("input")
            baseNode.type = paramItem.type
            let pp = paramItem.params
            if (pp) Object.keys(pp).forEach(k => baseNode[k] = pp[k])
            break
    }
    if (baseNode) {
        baseNode.addEventListener("input", (e) => onParamInput(e, paramItem, sectionItem))
        onParamInput({
            target: baseNode
        }, paramItem, sectionItem)
        form.appendChild(baseNode)
    }
    return form
}

const addCommandSection = (sectionItem) => {
    let section = document.createElement("section")
    sectionItem.div = section // omg

    let commandTitle = document.createElement("h2")
    commandTitle.id = "command"
    section.appendChild(commandTitle)
    updateCommandSection(sectionItem)

    let itemDesc = sectionItem.desc
    if (itemDesc) {
        let commandDesc = document.createElement("p")
        commandDesc.innerText = itemDesc
        section.appendChild(commandDesc)
    }

    sectionItem.struct.forEach(e => {
        if (!e.type) return

        let node = createParameterDiv(e, sectionItem)
        section.appendChild(node)
    });

    let copyButton = document.createElement("button")
    copyButton.id = "copy-button"
    copyButton.innerText = "Copy the command"
    copyButton.addEventListener("click", copyButtonClick)
    section.appendChild(copyButton)

    container.appendChild(section)
}

const initCommandSections = (arr) => arr.forEach((item) => {
    try {
        addCommandSection(item)
    } catch (err) {
        console.error(item, err)
    }
})

const versionChange = (version) => {
    let code = document.getElementById("version")
    if (!(code && version)) return
    code.innerText = `v${version}`
}