var css = '.columnSumCounterPill {background-color: #8da3a6;color: #fff;border-radius: 8px;font-size: 11px;height: 16px;line-height: 16px;padding: 0 8px;margin-left: 8px;}' +
    '.smallPill {background-color: #8da3a6;color: #fff;border-radius: 8px;font-size: 11px;height: 18px;line-height: 18px;padding: 1px 6px 2px 6px;}' +
    '.columnTaskCounter {padding-left:5px}' +
    '.totalCounterLabel {line-height:24px; padding-right:10px; font-size:12px; color:#848f99; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

head.appendChild(style);

setInterval(function () {

    //Board/Kanban view 
    //number of tasks calculation and point pills sum calculation
    var viewType;
    var columns;
    var rows;

    try {
        columns = Array.from(document.getElementsByClassName("SortableList-itemContainer SortableList-itemContainer SortableList-itemContainer--row")[0].children);
        viewType = 'board'
    } catch (error) {
        viewType = 'list';
    }

    var pSum = 0;
    var tSum = 0;
    var totalTasksCounter = 0;
    var totalPointsCounter = 0;
    var totalLabelElement;
    var sumCounter;
    var taskCounter;

    if (viewType === 'board') { //we are in the board view

        var boardPSum = 0;
        var boardTSum = 0;

        totalTasksCounter = 0;
        totalPointsCounter = 0;
        var boardHeaderRow;

        columns.forEach((column, columnN) => {
            pSum = 0;
            tSum = 0;
            const colName = column.getElementsByClassName("BoardColumnHeaderTitle BoardColumnHeader-name")[0];
            if (colName) {

                var arr = Array.from(column.getElementsByClassName("BoardCardWithCustomProperties"));
                arr.forEach((element, i) => {
                    tSum++;
                    const pointElems = element.getElementsByClassName("Pill--colorCoolGray Pill Pill--small");
                    if (pointElems.length !== 0) {
                        var v = parseInt(pointElems[0].textContent);
                    }
                    if (!isNaN(v)) pSum = pSum + v;
                });

                const sumCounterParent = colName.parentNode;

                if (isNaN(tSum) || tSum == 0) {
                    taskCounter = document.getElementById("columnTaskCounter" + columnN);
                    if (taskCounter) {
                        sumCounterParent.removeChild(taskCounter);
                    }

                } else {
                    taskCounter = document.getElementById("columnTaskCounter" + columnN);
                    if (taskCounter) {
                        if (parseInt(taskCounter.innerHTML) !== tSum) {
                            if (tSum === 1) {
                                taskCounter.innerHTML = tSum + ' task';
                            } else {
                                taskCounter.innerHTML = tSum + ' tasks';
                            }

                        }
                    } else {
                        taskCounter = document.createElement('span');
                        taskCounter.id = "columnTaskCounter" + columnN;
                        taskCounter.className = "columnTaskCounter";
                        sumCounterParent.appendChild(taskCounter);
                        if (tSum === 1) {
                            taskCounter.innerHTML = tSum + ' task';
                        } else {
                            taskCounter.innerHTML = tSum + ' tasks';
                        }
                    }
                }

                if (isNaN(pSum) || pSum == 0) {
                    sumCounter = document.getElementById("columnSumCounter" + columnN);
                    if (sumCounter) {
                        sumCounterParent.removeChild(sumCounter);
                    }
                } else {
                    sumCounter = document.getElementById("columnSumCounter" + columnN);

                    if (sumCounter) {
                        if (parseInt(sumCounter.innerHTML) !== pSum) {
                            sumCounter.innerHTML = pSum;
                        }
                    } else {
                        sumCounter = document.createElement('span');
                        sumCounter.id = "columnSumCounter" + columnN;
                        sumCounter.className = "columnSumCounterPill";
                        sumCounterParent.appendChild(sumCounter);
                        sumCounter.innerHTML = pSum;
                    }
                }
                boardTSum += tSum;
                boardPSum += pSum;
            }
        });

        boardHeaderRow = document.getElementsByClassName("Board-header")[0];
        totalLabelElement = document.getElementById("boardTotalCounter");
        if (totalLabelElement) {
            //
        } else {
            totalLabelElement = document.createElement('span');
            totalLabelElement.id = "boardTotalCounter";
            totalLabelElement.className = "totalCounterLabel";
            boardHeaderRow.insertBefore(totalLabelElement, boardHeaderRow.firstChild);
        }
        totalLabelElement.innerHTML = '<b>' + boardTSum + '</b> loaded tasks with <span class="smallPill">' + boardPSum + '</span> points';

    } else if (viewType === 'list') { //we are in the list view
        var listHeaderElement = document.getElementsByClassName("GridHeaderStructure-right")[0];
        if (listHeaderElement === 'undefined') {
            return;
        }
        totalLabelElement = document.getElementById("listTotalCounter");
        if (totalLabelElement) {
            //
        } else {
            totalLabelElement = document.createElement('span');
            totalLabelElement.id = "listTotalCounter";
            totalLabelElement.className = "totalCounterLabel";
            totalLabelElement.style.cssText = "font-size:11; padding-right:0;line-height: 12px;";
            try {
                listHeaderElement.insertBefore(totalLabelElement, listHeaderElement.firstChild);
            } catch (e) {}
        }


        try {
            rows = [...document.getElementsByClassName("TaskList")[0].children];
        } catch (error) {
            return;
        }
        pSum = 0;
        tSum = 0;
        var sectoinSum = 0;
        var sectionTasks = 0;
        var rowElement;
        var sectoinNameElement;
        rows.forEach((row, rowN) => {
            rowElement = row.getElementsByClassName('TaskRow')[0];
            if (rowElement) //it is a task
            {
                tSum++;
                var rightRowElements = rowElement.getElementsByClassName('ItemRowTwoColumnStructure-right')[0];
                var customProps = [...rightRowElements.getElementsByClassName('CustomPropertyEditablePreviewContainer')];
                customProps.forEach((property, propertyN) => {
                    var tempB = property.children[0].getElementsByClassName("Pill--colorCoolGray Pill Pill--small");
                    if (tempB.length !== 0) {
                        var p = parseInt(tempB[0].textContent);
                        pSum += p;
                        sectoinSum += p;
                        sectionTasks++;
                    }
                });
            } else { //section or milestone but not the task
                if (taskCounter && sectoinSum > 0) taskCounter.innerHTML = sectionTasks + ' tasks <span class="smallPill"><b>' + sectoinSum + '</b></span>';

                rowElement = row.getElementsByClassName('SectionRow')[0];
                if (rowElement) //it is a section
                {
                    sectoinNameElement = rowElement.getElementsByClassName('SectionRow-sectionName')[0].children[0];
                    //taskCounter = document.getElementById("rowTaskCounter" + rowN);
                    taskCounter = rowElement.getElementsByClassName('rowTaskCounter')[0];
                    if (taskCounter) {
                        //there is already an element
                    } else {
                        taskCounter = document.createElement('div');
                        // taskCounter.className = "totalCounterLabel";
                        taskCounter.style.cssText = "font-size:11; padding-right:0; margin-right: -13px; border-bottom:solid 1px; margin-bottom:-2px; padding-bottom: 1px;";
                        taskCounter.id = "rowTaskCounter" + rowN;
                        taskCounter.className = "rowTaskCounter";
                        rowElement.appendChild(taskCounter);
                    }
                }
                sectoinSum = 0;
                sectionTasks = 0;
            }

            if (rowN === rows.length - 1) { //if its a last item of the list lets update section sum
                if (taskCounter && sectoinSum > 0) taskCounter.innerHTML = sectionTasks + ' tasks <span class="smallPill"><b>' + sectoinSum + '</b></span>';
            }
        });

        totalLabelElement.innerHTML = '<b>' + tSum + '</b> loaded tasks with <span class="smallPill">' + pSum + '</span> points';
    }

}, 2000);