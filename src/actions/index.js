export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const RECEIVE_DATA_DETAILS = 'RECEIVE_DATA_DETAILS';
export const SELECT_COMPANY = 'SELECT_COMPANY';
export const INVALIDATE_DATA = 'INVALIDATE_DATA';

const api_root = 'https://api-g.weedmaps.com/wm/v2/listings/dispensaries/';
const menu_options = 'page=1&page_size=150&limit=200&filter[category_names][]=concentrate&filter[category_names][]=wax';

export const selectCompany = company => ({
  type: SELECT_COMPANY,
  company,
});

export const invalidateData = company => ({
  type: INVALIDATE_DATA,
  company,
});

export const requestData = company => ({
  type: REQUEST_DATA,
  company,
});

export const receiveData = (company, json) => ({
  type: RECEIVE_DATA,
  company,
  data: json,
  receivedAt: Date.now(),
});

export const receiveDetails = (company, json) => ({
  type: RECEIVE_DATA_DETAILS,
  company,
  details: json,
  receivedAt: Date.now(),
});

const fetchDetails = company => (dispatch) => {
  return fetch(`${api_root}/${company}?include[]=todays_deal`)
    .then(response => response.json())
    .then(result => dispatch(receiveDetails(company, result.data.listing)));
};

const fetchData = company => (dispatch) => {
  return fetch(`${api_root}/${company}/menu_items?${menu_options}`)
    .then(response => response.json())
    .then(result => dispatch(receiveData(company, result.data.menu_items)))
    .then(() => {
      dispatch(requestData(company));
      dispatch(fetchDetails(company));
    });
};

const shouldFetchData = (state, company) => {
  const data = state.dataByCompany[company];

  if (!data) {
    return true;
  }
  if (data.isFetching) {
    return false;
  }
  return data.didInvalidate;
};

export const fetchDataIfNeeded = company => (dispatch, getState) => {
  if (shouldFetchData(getState(), company)) {
    return dispatch(fetchData(company));
  }
};
