import React, {useState, useEffect} from 'react';
import './App.css';
import {Drawer} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import axios from 'axios';
import {List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {Button} from '@material-ui/core';

import {DayCollapsible} from './components/dayCollapsible.js';
import AddIcon from '@material-ui/icons/Add';

const drawerWidth = 250;

const API_URL = "http://localhost:3000/winTheDay";

const useStyles = makeStyles(() => ({
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  drawerPaper: {
      width: drawerWidth,
  },
}));

{/*
This component is our main webpage component makes the http requests to the Express server, holds all the tasklists for each day, and loads this data into a list of 
dayCollapsible components that get rendered
*/}
function App() {
  const classes = useStyles();
  // data is an array that contains the tasklist for each day
  const [data, setData] = useState([]);

  // numWins and numLosses are numbers that represent the number of days you completed all the tasks and the number of days you didn't respectively
  const [numWins, setNumWins] = useState(0);
  const [numLosses, setNumLosses] = useState(0);

  useEffect(() => {
    // retrieve win statistics data and each tasklist from the API
    const fetchData = async () => {
      const res = await axios.get(API_URL);
      setData(res.data.reverse());
      console.log('Fetch data called!');
    };

    const fetchWinStats = async () => {
      const res = await axios.get('http://localhost:3000/winStats');
      console.log(res.data);
      setNumWins(res.data[0].numWins);
      setNumLosses(res.data[0].numLosses);
    }

    fetchData();
    fetchWinStats();
  }, []);

  // a day that was originally lost ended up getting won, change win Statistics for that
  const incrementNumWins = () => {
    console.log('incrementNumWins called!');
    setNumWins(numWins+1);
    setNumLosses(numLosses-1);
  }

  // a day that was originally won ended up getting lost, change win Statistics for that
  const incrementNumLosses = () => {
    console.log('incrementNumLosses called!');
    setNumWins(numWins-1);
    setNumLosses(numLosses+1);
  }

  // if we add a new day to the 'data' array, this is what we want the fields to be initialized with
  const newDayState = {name:"", tasks:["", "", "", "", ""], tasksCompleted:[false, false, false, false, false],
    reflection:"", additionalNotes:"", winStatus: false};

  // load the data for the day in the dayCollapsible component
  const _renderDay = (day, i) => {
    return (<DayCollapsible updateWinStats={{incrementNumWins, incrementNumLosses}} initState={day} updateDay={_updateData} deleteDay={_deleteData}/>);
  }

  // add a new day to our 'data' array
  const _addData = () => {
    const createNew = async () => {
      const res = await axios.post(API_URL, newDayState);
      return res.data;
    };

    const newData = [createNew()].concat(data);
    setData(newData);
    // refresh to trigger the correct re-render.
    // if you don't refresh with the current implementation of the code, 
    window.location.reload();
  };

  // update database with modified tasklist using the given id
  const _updateData = (id, newDay) => {
    if (id == null) {
      // setData([newDay].concat(data));
      // axios.post(API_URL, newDay);
    } else {
      data.forEach((eachDay, index) => {
        if (eachDay._id === id) {
          axios.put(API_URL + '/' + id, newDay);
        }
      });

    }
  }

  // delete tasklist from database using given id
  const _deleteData = (id) => {
    if (id == null) {
      // let deleteIndex = 0;

    } else {
      let deleteIndex = 0;
      const newData = [...data];
      data.forEach((eachDay, index) => {
        if (eachDay._id === id) {
          axios.delete(API_URL + '/' + id);
          deleteIndex = index;
        }
      });

      newData.splice(deleteIndex, deleteIndex+1);

      setData(newData);
      window.location.reload();
    }
  }

  // render a dayCollapsible component for each element in the data array
  const _renderData = () => {
    console.log('Rendering data!');
    return data.map((eachDay, index) => {
      if (eachDay.name === "") {
        return (<DayCollapsible updateWinStats={{incrementNumWins, incrementNumLosses}} initState={eachDay} updateDay={_updateData} deleteDay={_deleteData} editMode/>);
      } else {
        return _renderDay(eachDay, index);
      }
    });
  }

  // display win statistics
  const _renderWinStats = () => {
    return (
      <Typography variant="h6">Wins: {numWins}, Losses: {numLosses}</Typography>
    );
  }

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent:"center"}}>
      {/* Drawer is the side bar (on the left of the page) */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <List>
          <ListItem button key={"Home"}>
            <ListItemText primary={"Home"} />
          </ListItem>
        </List>
      </Drawer>
      {/* Main page content, win statistics + all the dayCollapsible components for each element in the 'data' array */}
      <div style={{padding: "20px", display: "flex", flexDirection: "column", alignItems:"center", width:"100%"}}>
        <Typography variant="h2">
          Win The Day
        </Typography>
        {_renderWinStats()}
        <div style={{width:"60%"}}>
          <div style={{padding: "20px 0px"}}>
            <Button
                size="large"
                onClick={_addData}
                style={{width: "100%", height: "70px", backgroundColor: "#f7f7f7"}}
              >
              <AddIcon />
            </Button>
          </div>
          {_renderData()}
        </div>
      </div>
    </div>
  );
}

export default App;