import React, {useState, useEffect} from 'react';
import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import {TextField, Typography} from '@material-ui/core';
import {IconButton, Box } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

{/*
This React component is a MaterialUI Accordionshows the tasklist and additional data associated with the day.
It has a 'display mode' which just displays the data, and an 'edit mode', which turns all the text into input fields that 
the user can type into
*/}
export function DayCollapsible(props) {
    // name is just a text field
    const [name, setName] = useState(props.initState.name);

    // tasks is an array of strings, tasksCompleted is an array of booleans
    const [tasks, setTasks] = useState(props.initState.tasks);
    const [tasksCompleted, setTasksCompleted] = useState(props.initState.tasksCompleted);

    // reflection and additionalNotes are just regular text fields
    const [reflection, setReflection] = useState(props.initState.reflection);
    const [additionalNotes, setAdditionalNotes] = useState(props.initState.additionalNotes);

    // winStatus represents whether user 'won' the day or not: checks list of tasks and returns true/false 
    // winStatus is responsible for the background color ('green' if all tasks completed, 'red' if not)
    const [winStatus, setWinStatus] = useState(props.initState.winStatus);

    // editMode sets whether the component allows the user to modify the data
    const [editMode, setEditMode] = useState(props.editMode ? true: false);

    // expanded sets whether Accordion should be expanded or not. (Always set to true in 'edit mode')
    const [expanded, setExpanded] = useState(props.editMode ? true: false);

    const textFieldWidth = "97%";

    // modifyTasks changes the string of an element in the tasks array
    const modifyTasks = (newTask, index) => {
      // we create a copy of the array to force a re-render on web page
      // if we do not change the reference pointer of tasks, then there will not be re-render 
      const newTasks = [...tasks];
      newTasks[index] = newTask;
      setTasks(newTasks);
    }

    // modifyTasksCompleted changes the boolean of an element in the tasksCompleted array and updates the winStatus accordingly
    const modifyTasksCompleted = (index) => {
      // we create a copy of the array to force a re-render on web page
      // if we do not change the reference pointer of tasks, then there will not be re-render
      const newTasksCompleted = [...tasksCompleted];
      newTasksCompleted[index] = !tasksCompleted[index];
      setTasksCompleted(newTasksCompleted);
      const newWinStatus = getCurrentWinStatus(newTasksCompleted);
      if (winStatus != newWinStatus) {
        console.log('change winStatus!');
        setWinStatus(newWinStatus);
        if (newWinStatus) {
          props.updateWinStats.incrementNumWins();
        } else {
          props.updateWinStats.incrementNumLosses();
        }
      }
    }

    // getCurrentWinStatus checks each element of tasksCompleted to see whether all are true and returns winStatus
    const getCurrentWinStatus = (tasksCompletedArr) => {
      let currWinStatus = true;
      for (let i = 0; i < tasksCompletedArr.length; i++) {
        if (!tasksCompletedArr[i]) {
          currWinStatus = false;
          break;
        }
      }
      return currWinStatus;
    }

    // switchMode sets expanded, which represents whether the accordion is fully expanded
    const switchMode = () => {
      if (!editMode) {
        // if it's going from 'display mode' to 'edit mode', set expanded to true
        setExpanded(true);
      }
      else {
        // if it's going from 'edit mode' to 'display mode', then that means the data needs to be saved
        const newDay = { name, tasks, tasksCompleted, reflection, 
          additionalNotes, winStatus};
        // the updateDay function is a prop passed in that lets the parent of this component update the database with the modified day 
        props.updateDay(props.initState._id, newDay);
      }
      setEditMode(!editMode);
    }

    // _renderTask displays a task as a checkbox followed with some text. Whether the text is simply displayed or is inside an input field depends on current mode
    const _renderTask = (task, index) => {
      if (editMode) {
        return (<div style={{display:"flex", flexDirection: "row", alignItems:"center", marginBottom:"9px", width: textFieldWidth}}>
          <Checkbox checked={tasksCompleted[index]} onChange={(e) => modifyTasksCompleted(index)} icon={<CircleUnchecked />} checkedIcon={<CircleChecked style={{color: "green"}}/>} />
          <TextField fullWidth value={task} onChange={(e) => modifyTasks(e.target.value, index)} variant="outlined"/>
        </div>)
      } else {
        return (<div style={{display: "flex", flexDirection: "row", alignItems:"center", width: textFieldWidth}}>
          <Checkbox disabled checked={tasksCompleted[index]} icon={<CircleUnchecked />} checkedIcon={<CircleChecked style={{color: "green"}}/>} />
          <Typography> {task} </Typography>
        </div>)
      }
    };

    // _renderTasks will go through the tasks array and get the corresponding rendered components for the data
    const _renderTasks = () => {
      return tasks.map((task, index) => {
        return _renderTask(task, index);
      });
    }

    // set background color of accordion to light green if winStatus is true, light red if not
    const accordionColor = {backgroundColor: winStatus ? "#66ff33" : "LightSalmon" };

    // rendered component if component is on 'edit mode'
    const _renderEditMode = () => {
      return (<div style={{display: "flex", flexDirection: "row", alignItems:"center", margin:"15px 0px"}}>
            <div style={{width:"100%"}}>
            <Accordion style={accordionColor} expanded={expanded}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <TextField value={name} onChange={(e) => setName(e.target.value)} variant="outlined" style={{width: "100%"}}/>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{display: "flex", flexDirection: "column", alignItems:"left", width:"100%"}}>
                    {_renderTasks()}
                    <TextField value={reflection} onChange={(e) => setReflection(e.target.value)} variant="outlined" label="Reflection" style={{margin: "8px", width: "100%"}} multiline rows={3} rowsMax={5}/>
                    <TextField value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} variant="outlined" label="Additional Notes" style={{margin: "8px", width: "100%"}} multiline rows={3} rowsMax={5}/>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <IconButton onClick={switchMode} style={{alignSelf:"start"}}>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={() => props.deleteDay(props.initState._id)} style={{alignSelf:"start"}}>
              <DeleteIcon />
            </IconButton>
          </div>)
    }

    // rednered component if component is on 'display mode'
    const _renderDisplayMode = () => {
      return (<div style={{display: "flex", flexDirection: "row", alignItems:"start", margin:"15px 0px"}}>
            <div style={{width:"100%"}}>
              <Accordion style={accordionColor} expanded={expanded} onChange={(e, newExpanded) => setExpanded(newExpanded)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography> {name} </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{display: "flex", flexDirection: "column", alignItems:"start", width:"100%"}}>
                    {_renderTasks()}
                    <div style={{margin:"8px"}}>
                      <Typography variant="h5" style={{marginBottom: "3px"}}> 
                      <Box fontWeight="fontWeightBold">
                        Reflection:
                      </Box>
                      </Typography>
                      <Typography> {reflection} </Typography>
                    </div>
                    <div style={{margin:"8px"}}>
                      <Typography variant="h5" style={{marginBottom: "3px"}}> 
                      <Box fontWeight="fontWeightBold">
                        Additional Notes:
                      </Box>
                      </Typography>
                      <Typography>{additionalNotes}</Typography>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <IconButton onClick={switchMode}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => props.deleteDay(props.initState._id)}>
              <DeleteIcon />
            </IconButton>
          </div>)
    }

    // render the correct version of the component based on current mode
    if (editMode) {
      return _renderEditMode();
    } else {
      return _renderDisplayMode();
    }
}