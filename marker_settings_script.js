let tempMarkerSettings = [
    {
        type: "display_name",
        style: "font-family:Arial;text-align:left;margin-top:8px;color:red;font-weight:bold;"
    },
    {
        type: "avatar",
        style: "width:100%;max-height:90px;overflow:hidden;object-fit:cover;",
    },

    {
        type: "rating",
        style: "font-family:Times New Roman;text-align:right;color:goldenrod;font-weight:light;"
    }
];

let defaultStyle = "font-family:Arial;text-align:left;font-weight:normal;color:black;background-color:white;"

let markerSettingsInfo = tempMarkerSettings;//get marker data
let selectMarkerStyleIndex = -1;
let tempStyleArray;
let currentMarkerEdit;
let creatingNewMarkerComponent = false;
let creatingNewStyleComponent = false;

function removeMarkerComponent(i) {
    closePopup();
    markerSettingsInfo.splice(i, 1);
    refreshList();
    saveMarkerSettings();
}

function editStyles(i) {
    closePopup();
    selectMarkerStyleIndex = i;
    refreshList();

    let form = document.querySelector(".styleList");

    form.addEventListener("submit", function (e) {
        e.preventDefault() // This prevents the window from reloading

        let formdata = new FormData(this);
        markerSettingsInfo[selectMarkerStyleIndex].type = formdata.get("componentNameChange")
        let input = [];
        for (let j = 0; j < tempStyleArray.length; j++) {
            input.push(formdata.get("input" + j));
        }
        let result = [];
        for (let i=0;i<tempStyleArray.length;i++)
        {
            result.push(tempStyleArray[i].split(':', 2)[0]+':'+input[i]);
        }
        markerSettingsInfo[selectMarkerStyleIndex].style = styleArraytoString(result);
        refreshList();
        saveMarkerSettings();
        setTimeout(() => {  editStyles(selectMarkerStyleIndex)}, 1);
    });
}

function closeStyleEditor() {
    selectMarkerStyleIndex = -1;
    currentMarkerEdit = -1;
    refreshList();
}

function removeStyleComponent(markerIndex, styleIndex) {
    tempStyleArray.splice(styleIndex, 1);
    markerSettingsInfo[markerIndex].style = styleArraytoString(tempStyleArray);
    refreshList();
    saveMarkerSettings();
    closeStyleEditor();
    refreshList();
    setTimeout(() => {  editStyles(markerSettingsInfo.length-1)}, 1);
}

function styleArraytoString(styleArray) {
    let result = '';
    for (let i = 0; i < styleArray.length; i++) {
        if (styleArray[i].replace(/\s/g, '').length)
            result += styleArray[i] + ';';
    }
    return result;
}

function newMarkerComponent()
{
    closeStyleEditor();
    creatingNewMarkerComponent = true;
    refreshList();

    let form = document.querySelector(".popUpNameEntry");
    form.addEventListener("submit", function (e) {
        e.preventDefault() // This prevents the window from reloading

        let formdata = new FormData(this);
        let input = formdata.get("componentName");
        markerSettingsInfo.push(
            {
                type: input,
                style: defaultStyle,
            }
        )
        closePopup();
        refreshList();
        saveMarkerSettings();
    });
}

function newStyleComponent()
{
    creatingNewStyleComponent = true;
    refreshList();

    let form = document.querySelector(".popUpStyleEntry");
    form.addEventListener("submit", function (e) {
        e.preventDefault() // This prevents the window from reloading

        let formdata = new FormData(this);
        let input = formdata.get("newStyleInput");
        markerSettingsInfo[selectMarkerStyleIndex].style+= input+";";
        closePopup();
        closeStyleEditor();
        refreshList();
        setTimeout(() => {  editStyles(markerSettingsInfo.length-1)}, 1);
    });
}

function closePopup()
{
    creatingNewMarkerComponent = false;
    creatingNewStyleComponent = false;
    refreshList();
}

function resetToDefault()
{
    if (confirm("Reset style settings to default for this component?"))
    {
        markerSettingsInfo[selectMarkerStyleIndex].style = defaultStyle;
    }
    closeStyleEditor();
    refreshList();
    setTimeout(() => {  editStyles(markerSettingsInfo.length-1)}, 1);
    saveMarkerSettings();
}

function saveMarkerSettings()
{
    console.log(markerSettingsInfo);//send data to server
}

function refreshList() {
    const listElement = document.getElementById("markerComponentEdit");
    listElement.innerHTML = ""; // Clear the existing list
    let index = 0;
    markerSettingsInfo.forEach(function (item) {
        const listItem = document.createElement("div");
        //MarkerComponents list
        let innerHTMLContent =
            '<div class="markerComponent">' +
                '<div class="markerTypeText">' + item.type + '</div>' +
                '<div class="markerComponentMinus clickable" onClick="removeMarkerComponent(' + index + ')">' +
                    '<div class="bigMinusCircle circle"></div>' +
                    '<div class="bigMinusRect1"></div>' +
                    '</div>' +
                '<div class="tripleDotEdit clickable noselect" onClick="editStyles(' + index + ')">⠇</div>' +
                // '<div class="tripleLineEdit clickable noselect">≡</div>' + //add in a draggable interface later
            '</div>';
        //marker component style editor
        if (selectMarkerStyleIndex === index) {
            let styleArray = markerSettingsInfo[index].style.split(";");
            if (!styleArray[styleArray.length - 1].replace(/\s/g, '').length) {
                styleArray.splice(-1)
            }
            if (index != currentMarkerEdit) {
                $(document).ready(function () {
                    var $styleEditors = $('.styleEditor');
                    $styleEditors.animate({ maxHeight: '1000px' }, 1000);
                });
                currentMarkerEdit = index;
            }
            innerHTMLContent +=
                '<div class="styleEditor">' +
                    '<div class="styleEditorContent">' +
                        '<div class="smallPlusContainer clickable" onClick="newStyleComponent()">' +
                            '<div class="smallPlusCircle"></div>' +
                            '<div class="smallPlusRect1"></div>' +
                            '<div class="smallPlusRect2"></div>' +
                        '</div>' +
                        '<div class="clickable closeButton noselect" onClick="closeStyleEditor()"> X </div>' +
                        '<form class="styleList">'+
                        '<div class="styleComponent">' +
                                '<div class="styleComponentBody">Name</div>' +
                                '<input class="styleInput" list="styles" type="text" value="'+markerSettingsInfo[selectMarkerStyleIndex].type+'" name="componentNameChange"></input>' +
                        '</div>';
            for (let i = 0; i < styleArray.length; i++) {
                const styleName = styleArray[i].split(':', 2)[0];
                const styleValue = styleArray[i].split(':', 2)[1];
                tempStyleArray = styleArray;
                innerHTMLContent +=
                            '<div class="styleComponent">' +
                                '<div class="styleComponentBody">' +
                                    styleName +
                                '</div>' +
                                '<input class="styleInput" type="text" name=input' + i + ' value="' + styleValue + '"></input>' +
                                '<div class="styleEditorMinus clickable" onClick="removeStyleComponent(' + index + ',' + i + ')">' +
                                    '<div class="smallMinusCircle circle"></div>' +
                                    '<div class="smallMinusRect"></div>' +
                                '</div>' +
                            '</div>';
            }
            innerHTMLContent +=
                            '<button class="styleEditorButton">Save</button>'+
                            '<button class="link resetToDefault" onClick="resetToDefault()">Reset Styles to Default</button>'+
                        '</form>' +
                    '</div>' +
                '</div>';
        }
        listItem.innerHTML = innerHTMLContent;
        listElement.appendChild(listItem);
        index++;
    });
    if (creatingNewMarkerComponent)
    {
        const windowItem = document.createElement("div");
        let newMarkerComponentHTML =
            '<div class="">'+
                '<div class="clickable closeButton popUp noselect" onClick="closePopup()"> X </div>' +
                '<div class="popUpTitle">Create new marker component:</div>'+
                '<form class="popUpNameEntry" id="newComponentName">'+
                    '<div class="nameLabel">Component name:</div>'+
                    '<input class="componentInput" type="text" name="componentName"></input>' +
                    '<button class="componentEditorButton">Save</button>'
                '</form>'+
            '</div>';
        windowItem.innerHTML = newMarkerComponentHTML;
        windowItem.className = "newPopup";
        listElement.appendChild(windowItem);
    }
    if (creatingNewStyleComponent)
    {
        const windowItem = document.createElement("div");
        let newMarkerComponentHTML =
            '<div class="">'+
                '<div class="clickable closeButton popUp noselect" onClick="closePopup()"> X </div>' +
                '<div class="popUpTitle">Create new style option:</div>'+
                '<form class="popUpStyleEntry" id="newStyleName">'+
                    '<div class="nameLabel">CSS Style:</div>'+
                    '<input class="newStyleInput" type="text" name="newStyleInput"></input>' +
                    '<button class="componentEditorButton">Save</button>'+
                '</form>'+
            '</div>';
        windowItem.innerHTML = newMarkerComponentHTML;
        windowItem.className = "newPopup";
        listElement.appendChild(windowItem);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    refreshList();
});