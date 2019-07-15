import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectCompany, fetchDataIfNeeded, invalidateData } from '../actions'
import Picker from '../components/Picker'

// Import React Tables for simplicity
import ReactTable from 'react-table'
import 'react-table/react-table.css'
// Moment For date times, joy...
import moment from 'moment';

class App extends Component {
  static propTypes = {     // eslint-disable-line
    selectedCompany: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    details: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedCompany } = this.props
    dispatch(fetchDataIfNeeded(selectedCompany))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCompany !== this.props.selectedCompany) {
      const { dispatch, selectedCompany } = nextProps
      dispatch(fetchDataIfNeeded(selectedCompany))
    }
  }

  handleChange = nextCompany => {  // eslint-disable-line
    this.props.dispatch(selectCompany(nextCompany))
  }

  handleRefreshClick = e => {  // eslint-disable-line
    e.preventDefault()

    const { dispatch, selectedCompany} = this.props
    dispatch(invalidateData(selectedCompany))
    dispatch(fetchDataIfNeeded(selectedCompany))
  }

  render() {
    const { selectedCompany, data, details, isFetching, lastUpdated } = this.props
    console.warn(data, details);
    
    const isEmpty = data.length === 0;
    
    // lets .map the data so we can mutate the variance with confidence
    data.map((item) => {    
      let price = null;
      let unit = null;
      
      if (item.category.id === 5 && item.prices.gram) {
        if (item.prices.gram.length > 1) {
          const elementFound = item.prices.gram.find(element => element.units === '1');
  
          if (elementFound) {
            unit = 1;
            price = elementFound.price;
          } else {
            unit = 0.5;
            price = item.prices.gram[0].price;
          }
        } else {
          
          price = item.prices.gram[0].price;
  
          if (item.prices.gram[0].unit === '1/2') {
            unit = 0.5;
          } else {
            unit = 1;
          }

        } 
      } else if (item.category.id === 1 && item.prices.ounce){ 
        if (item.prices.ounce.length > 1) {
        price = item.prices.ounce[0].price;
        unit = 1;
        }
      }

      item._totalPrice = (price * unit).toFixed(2);

      return item;
    })

    data.sort((a, b) => {
      return moment(b.created_at) - moment(a.created_at); 
    })

    const filterCaseInsensitive = (filter, row) => {
      const id = filter.pivotId || filter.id;
      if (row[id] !== null && typeof row[id] === 'string'){
          return (
              row[id] !== undefined ?
                  String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
                  :
                  true
          );
      }
  };

    // Manually construct some columns for the React Table component
    const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      width: 380,
      filterMethod: filterCaseInsensitive
    },
    {
      Header: 'Category',
      accessor: 'category.slug',
      width: 100 
    },
    {
      Header: 'Unit',
      accessor: 'prices.gram[0].units',
      width: 60 
    },
    {
      Header: 'Price (g)',
      accessor: 'prices.gram[0].price',
      width: 100
    },
    {
      Header: 'Price (1/8)',
      accessor: 'prices.ounce[0].price',
      width: 100
    },
    {
      Header: 'Overall Price',
      accessor: '_totalPrice',
      width: 100,
      filterMethod: filterCaseInsensitive, 
    },]

    return (
      <div>
        <Picker value={selectedCompany}
                onChange={this.handleChange}
                options={[ 'essence',
                           'mmj-america-las-vegas',
                           'medizin',
                           'inyo-fine-cannabis-dispensary',
                           'jardin-dispensary',
                           'shango-las-vegas',
                           'sahara-wellness',
                           'essence-dispensary-the-strip',
                           'nuleaf-clark-dispensary',
                           'the-grove-2-2',
                           'oasis-medical-cannabis',
                           'acres-cannabis']} />
        <p>{details.name}</p>
        <p>{details.todays_hours_str}</p>
        <p>{details.phone_number}</p>
        <p>{details.address}</p>
        <p>{details.city}, {details.state}</p>
        <p>{details.email}</p>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <small><em>*Shift + Click to multi sort</em></small>
              <ReactTable
                className="-striped -highlight"
                columns={columns}
                data={data}
                filterable
              />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedCompany, dataByCompany } = state
  const {
    isFetching,
    lastUpdated,
    items: data,
    details
  } = dataByCompany[selectedCompany] || {
    isFetching: true,
    items: [],
    details: {}
  }

  return {
    selectedCompany,
    data,
    details,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
