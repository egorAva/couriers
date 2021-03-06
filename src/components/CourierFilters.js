import React, { Fragment } from 'react';
import { Checkbox, Spin } from 'antd';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';

import FilterBar from './FilterBar';
import CustomSelect from './CustomSelect';

import { setCourierFilters } from '../ducks/filters';
import { fetchCountries, fetchOffices } from '../ducks/lists';
import { getCountries, getOffices } from '../selectors/filters';

import AutoSave from '../hocs/AutoSave';

export const CourierFilters = ({
  countries,
  onChangeCountry,
  offices,
  onChangeOffice,
  onChangeActive,
  style,
  onSearchCountries,
  onSearchOffices,
  onSubmit,
  onAutoSave,
  // filters,
}) => (
  <Formik onSubmit={onSubmit} initialValues={{}}>
    {({ handleSubmit, handleReset, setFieldValue, values }) => (
      <Fragment>
        <AutoSave values={values} onSave={onAutoSave} />
        <FilterBar
          isOpen
          style={style}
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <CustomSelect
            allowClear
            showSearch
            data={countries}
            label="Страна"
            size="small"
            data-test="country"
            filterOption={false}
            value={values.countryId}
            onChange={id => {
              setFieldValue('countryId', id);
              if (!id) setFieldValue('officeId', '');
            }}
            onSearch={onSearchCountries}
            onFocus={onSearchCountries}
            notFoundContent={<Spin size="small" />}
          />

          <CustomSelect
            allowClear
            showSearch
            disabled={!values.countryId}
            data={offices}
            label="Офис"
            data-test="office"
            size="small"
            filterOption={false}
            value={values.officeId}
            onChange={id => setFieldValue('officeId', id)}
            onSearch={onSearchOffices}
            onFocus={onSearchOffices}
            notFoundContent={<Spin size="small" />}
          />

          <Checkbox
            checked={values.active}
            onChange={event => setFieldValue('active', event.target.checked)}
          >
            Только активные
          </Checkbox>
        </FilterBar>
      </Fragment>
    )}
  </Formik>
);

const mapStateToProps = state => ({
  countries: getCountries(state),
  offices: getOffices(state),
  // filters: getCountriesFilters(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSearchCountries: fetchCountries,
      onSearchOffices: fetchOffices,
      onAutoSave: setCourierFilters,
    },
    dispatch,
  );

const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onSubmit: props => values => props.onAutoSave(values),
  }),
);

export default enhancer(CourierFilters);
