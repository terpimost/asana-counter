var css = '.columnSumCounterPill {background-color: #8da3a6;color: #fff;border-radius: 8px;font-size: 11px;height: 16px;line-height: 16px;padding: 0 8px;margin-left: 8px;}'+
'.smallPill {background-color: #8da3a6;color: #fff;border-radius: 8px;font-size: 11px;height: 18px;line-height: 18px;padding: 1px 5px 2px 5px;}'+
'.columnTaskCounter {padding-left:5px}'+
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

setInterval(function() {
   
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
    var totalTasksCounter=0;
    var totalPointsCounter=0;
    var totalLabelElement;

    if (viewType === 'board') { //we are in the board view
        pSum = 0;
        tSum = 0;
        var boardPSum=0;
        var boardTSum=0;
        var sumCounter;
        var taskCounter;
        totalTasksCounter=0;
        totalPointsCounter=0;
        var boardHeaderRow;

        columns.forEach((column, columnN) => {
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

                boardTSum+=tSum;
                boardPSum+=pSum;
            }
        });

        boardHeaderRow=document.getElementsByClassName("Board-header")[0];
        totalLabelElement=document.getElementById("boardTotalCounter");
        if (totalLabelElement) {
            //
        }
        else{
            totalLabelElement = document.createElement('span');
            totalLabelElement.id = "boardTotalCounter";
            totalLabelElement.className = "totalCounterLabel";
            boardHeaderRow.insertBefore(totalLabelElement, boardHeaderRow.firstChild);
        }
        totalLabelElement.innerHTML = 'There are <b>'+boardTSum+'</b> loaded tasks with <span class="smallPill">'+boardPSum+'</span> points';

    } else if(viewType === 'list'){ //we are in the list view
      
        var listHeaderElement = document.getElementsByClassName("GridHeader")[0];
        totalLabelElement=document.getElementById("listTotalCounter");
        if (totalLabelElement) {
            //
        }
        else{
            totalLabelElement = document.createElement('span');
            totalLabelElement.id = "listTotalCounter";
            totalLabelElement.className = "totalCounterLabel";
            totalLabelElement.style.cssText = "font-size:11;";
            listHeaderElement.insertBefore(totalLabelElement, listHeaderElement.lastChild);
        }
        
        
        try {
            rows = [...document.getElementsByClassName("TaskList")[0].children];
        } catch (error) {
            return;
        }
        pSum=0;
        tSum=0;
        var sectoinSum=0;
        var rowElement;
        var sectoinNameElement;
        rows.forEach((row, rowN) => {
            rowElement=row.getElementsByClassName('TaskRow')[0];
            if(rowElement) //it is a task
            {
                tSum++;
                var rightRowElements=rowElement.getElementsByClassName('ItemRowTwoColumnStructure-right')[0];
                var customProps=[...rightRowElements.getElementsByClassName('CustomPropertyEditablePreviewContainer')];
                customProps.forEach((property, propertyN) => {
                    var tempB=property.children[0].getElementsByClassName("Pill--colorCoolGray Pill Pill--small");
                    if (tempB.length !== 0) {
                        var p = parseInt(tempB[0].textContent);
                        //console.log('points=',p);
                        pSum+=p;
                        sectoinSum+=p;
                    }
                });
                if(sectoinNameElement){//update section sum

                }
            }
            else{//section or milestone but not the task
                //console.log("section sum=",sectoinSum);
                if(sectoinNameElement){
                    console.log(sectoinSum+"-",sectoinNameElement.textContent);
                }

                rowElement=row.getElementsByClassName('SectionRow')[0];
                if(rowElement) //it is a section
                {
                    sectoinNameElement=rowElement.getElementsByClassName('SectionRow-sectionName')[0].children[0];
                }
                
                sectoinSum=0;
            }
            
            if(rowN===rows.length-1){
                if(sectoinNameElement){
                    console.log(sectoinSum+"-",sectoinNameElement.textContent);
                }
            }
        });

        totalLabelElement.innerHTML = 'There are <b>'+tSum+'</b> loaded tasks with <span class="smallPill">'+pSum+'</span> points';
    }


    //List view 
    //number of tasks calculation and point pills sum calculation
    //Go find the div with class = TaskList
    //for each child which is class="dropTargetRow" do this: rmember number of the row as var rowNumber=0;
    //get child which is class="TaskRow" or class="SectionRow"
    //if it is class="SectionRow" rembember that dom element and start calulating regular rows until the next SectionRow, rowNumberUnderSection=-1, tSum=0, pSum = 0
    //if it is class='TaskRow' rowNumberUnderSection++, tSum++, pSum=pSum+ (find the drop and get number of points in it)
    //and update SectionRow dom element

    // layout textarea padding-right: 200px - 
    //new div after that position absolute with top=0, right=0, tune styles

}, 2000);