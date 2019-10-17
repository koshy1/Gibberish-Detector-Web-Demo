// @flow
import window from 'global/window';
import React from 'react';

import {CSVLink} from 'react-csv';

import {useStyletron} from 'baseui';
import {
  StyledTable,
  StyledHead,
  SortableHeadCell,
  StyledBody,
  StyledRow,
  StyledCell,
  SORT_DIRECTION,
} from 'baseui/table';
import {Button} from 'baseui/button';

const NameDataTable = ({data, threshold}) => {
  const [nameSortDirection, setNameSortDirection] = React.useState(null);
  const [validitySortDirection, setValiditySortDirection] = React.useState(
    null
  );
  const [
    gibberishScoreSortDirection,
    setGibberishScoreSortDirection,
  ] = React.useState(null);

  const [useCss, theme] = useStyletron();

  const fields = {
    name: {
      fieldLabel: 'Name',
      sortDirection: nameSortDirection,
      setSortDirection: setNameSortDirection,
      transform: value => value,
      sortFunction: (a, b) => a.name.localeCompare(b.name),
    },
    gibberish: {
      fieldLabel: 'Valid?',
      sortDirection: validitySortDirection,
      setSortDirection: setValiditySortDirection,
      transform: value => (value ? 'No' : 'Yes'),
      sortFunction: (a, b) =>
        // Have valid (non-gibberish) names come before invalid names
        a.gibberish === b.gibberish ? 0 : a.gibberish ? 1 : -1,
    },
    gibberishScore: {
      fieldLabel: `Gibberish Score (threshold = ${threshold.toFixed(5)})`,
      sortDirection: gibberishScoreSortDirection,
      setSortDirection: setGibberishScoreSortDirection,
      transform: value => value.toFixed(5),
      sortFunction: (a, b) => a.gibberishScore - b.gibberishScore,
    },
  };

  const csvHeaders = Object.keys(fields).map(field => {
    return {label: fields[field].fieldLabel, key: field};
  });

  const handleSort = (sortField, prevDirection) => {
    let nextDirection = null;
    if (prevDirection === null) {
      nextDirection = SORT_DIRECTION.ASC;
    }
    if (prevDirection === SORT_DIRECTION.ASC) {
      nextDirection = SORT_DIRECTION.DESC;
    }
    if (prevDirection === SORT_DIRECTION.DESC) {
      nextDirection = null;
    }
    for (let field in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, field)) {
        if (sortField === field) {
          fields[field].setSortDirection(nextDirection);
        } else {
          fields[field].setSortDirection(null);
        }
      }
    }
  };

  const transformData = rawData => {
    return rawData.map(row => {
      const transformedRow = {};
      for (let field in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, field)) {
          transformedRow[field] = fields[field].transform(row[field]);
        }
      }
      return transformedRow;
    });
  };

  const getSortedData = () => {
    for (let field in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, field)) {
        if (fields[field].sortDirection) {
          const sorted = data.slice(0).sort(fields[field].sortFunction);
          return fields[field].sortDirection === SORT_DIRECTION.ASC
            ? sorted
            : sorted.reverse();
        }
      }
    }
    return data;
  };

  const useCssForValidNames = useCss({
    ...theme.typography.font550,
    backgroundColor: theme.colors.positive50,
    color: `${theme.colors.positive} !important`,
  });

  const useCssForInvalidNames = useCss({
    ...theme.typography.font550,
    backgroundColor: theme.colors.negative50,
    color: `${theme.colors.negative} !important`,
  });

  const myRef = React.useRef(null);

  React.useEffect(() => {
    window.scrollTo({
      top: (myRef.current && myRef.current.offsetTop) || 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [data]);

  return (
    <>
      <div
        ref={myRef}
        className={useCss({
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: theme.sizing.scale600,
          paddingBottom: theme.sizing.scale600,
          alignItems: 'center',
        })}
      >
        <div
          className={useCss({
            ...theme.typography.font750,
            color: theme.colors.primary,
          })}
        >
          Gibberish Detection Results
        </div>
        <CSVLink
          data={transformData(getSortedData())}
          headers={csvHeaders}
          className={useCss({textDecoration: 'none'})}
        >
          <Button>Download</Button>
        </CSVLink>
      </div>
      <div
        className={useCss({
          height: 'auto',
          maxHeight: '500px',
          marginBottom: '10px',
        })}
      >
        <StyledTable className={useCss({height: 'auto', maxHeight: '500px'})}>
          <StyledHead>
            {Object.keys(fields).map((field, i) => {
              return (
                <SortableHeadCell
                  key={i}
                  title={fields[field].fieldLabel}
                  direction={fields[field].sortDirection}
                  onSort={() => handleSort(field, fields[field].sortDirection)}
                />
              );
            })}
          </StyledHead>
          <StyledBody>
            {transformData(getSortedData()).map((row, index) => (
              <StyledRow key={index}>
                <StyledCell>{row.name}</StyledCell>
                <StyledCell
                  className={
                    row.gibberish === 'Yes'
                      ? useCssForValidNames
                      : useCssForInvalidNames
                  }
                >
                  {row.gibberish}
                </StyledCell>
                <StyledCell>{row.gibberishScore}</StyledCell>
              </StyledRow>
            ))}
          </StyledBody>
        </StyledTable>
      </div>
    </>
  );
};

export default NameDataTable;
