import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './Main.css'
import axios from 'axios';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import CircularProgress from '@material-ui/core/CircularProgress';

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            handleData: [],
            filteredData: [],
            loading: true,
            rain: true,
        }
        this.handleData();
    }

    handleTime = time => {
        return time.slice(10, 16);
    }

    handleChange = name => event => {
        const status = event.target.checked;
        this.setState({ [name]: status })

    }

    handleData = () => {
        axios.get('https://cors-anywhere.herokuapp.com/https://samples.openweathermap.org/data/2.5/forecast/hourly?q=Berlin,us&appid=b6907d289e10d714a6e88b30761fae22')
            .then(res => {
                const data = res.data.list;
                let rain = data.filter(d => d.weather.find(w => w.main === 'Rain'));
                const handleData = [];
                let dateHelper = '';
                data.map(d => {
                    const day = d.dt_txt.slice(0, 10);
                    if (dateHelper === '') {
                        handleData.push({ day, data: [d] })
                        dateHelper = day;
                    }
                    if (day === dateHelper) {
                        const grabIndexFromObject = handleData.map(d => d.day);
                        const index = grabIndexFromObject.indexOf(day);
                        handleData[index].data.push(d);
                    }

                    if (dateHelper !== '' && dateHelper !== day) {
                        handleData.push({ day, data: [d] })
                        dateHelper = day;
                    }
                })
                this.setState({ handleData: handleData, loading: false, filteredData: handleData });
            })
            .catch(e => console.log(e))
    }

    render() {
        return (
            this.state.loading ?
                <div className='centered'><CircularProgress /></div> :
                <div>
                    <Container>
                        <Grid container spacing={3}>
                            {this.state.filteredData.map(day => {
                                return <Grid item xs={12} sm={2}>
                                    <Card>
                                        <CardContent>
                                            <h3>{day.day}</h3>
                                            {day.data.map(data => {
                                                return (
                                                    <div className='spaced'>
                                                        <div className='card'>
                                                            <h5>{data.weather[0].main}</h5>
                                                            <span>{data.weather[0].main === 'Rain' ? <BeachAccessIcon /> : data.weather[0].main === 'Clear' ? <WbSunnyIcon /> : data.weather[0].main === 'Clouds' ? <FilterDramaIcon /> : null}</span>
                                                        </div>
                                                        <div>Hour: {this.handleTime(data.dt_txt)}</div>

                                                        <p>{data.weather[0].description}</p>
                                                        <div>Temperature: {data.main.temp}</div>
                                                        <hr />
                                                    </div>
                                                )
                                            })}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            })}
                        </Grid>
                    </Container>
                </div>
        )
    }
}

export default Main;