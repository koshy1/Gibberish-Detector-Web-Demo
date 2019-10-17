// @flow
import window from 'global/window';
import React from 'react';

import {compose} from 'redux';
import {connect} from 'react-redux';
import {withRPCRedux} from 'fusion-plugin-rpc-redux-react';

import {csvParseRows} from 'd3-dsv';

import {useStyletron, ThemeProvider, LightTheme, DarkTheme} from 'baseui';
import {Button, KIND as ButtonKind, SIZE} from 'baseui/button';
import {Input} from 'baseui/input';
import {Notification, KIND as NotificationKind} from 'baseui/notification';
import {FileUploader} from 'baseui/file-uploader';
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Textarea} from 'baseui/textarea';

import Navigation from '../components/navigation';
import NameDataTable from '../components/nameDataTable';

const Home = ({getNameValidities, nameValidation}) => {
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [threshold, setThreshold] = React.useState('');
  const [thresholdInputHasError, setthresholdInputHasError] = React.useState(
    false
  );
  const [progressMessage, setProgressMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isThemeOverridden, setIsThemeOverridden] = React.useState(false);

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    !isDarkMode &&
    !isThemeOverridden
  ) {
    setIsDarkMode(true);
  }

  const resetFileUploader = () => {
    setErrorMessage('');
    setProgressMessage('');
  };

  const handleSubmit = () => {
    const names = [].concat(...csvParseRows(textAreaValue));
    if (!threshold.length || (threshold.length && !isNaN(threshold))) {
      if (parseFloat(threshold) <= -1 || parseFloat(threshold) >= 1) {
        setthresholdInputHasError(true);
      } else {
        thresholdInputHasError && setthresholdInputHasError(false);
        getNameValidities({names, threshold: parseFloat(threshold)});
      }
    } else if (threshold.length) {
      setthresholdInputHasError(true);
    }
  };

  const handleFileDrop = (acceptedFiles, rejectedFiles) => {
    const fileReader = new window.FileReader();
    fileReader.onerror = () => setErrorMessage('Error parsing file');
    fileReader.onloadstart = () => setProgressMessage('Parsing file...');
    fileReader.onload = () => {
      setProgressMessage('');
      setErrorMessage('');
      setTextAreaValue(fileReader.result);
    };
    fileReader.readAsText(acceptedFiles[0]);
  };

  const handleThemeSwitch = () => {
    if (!isThemeOverridden) {
      setIsThemeOverridden(true);
    }
    setIsDarkMode(!isDarkMode);
  };

  const [useCss, theme] = useStyletron();
  const useCssLargeCenterFont = useCss({
    ...theme.typography.font650,
    textAlign: 'center',
  });

  const useCssFlexSpaceBetween = useCss({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  return (
    <ThemeProvider theme={isDarkMode ? DarkTheme : LightTheme}>
      <div
        className={useCss({
          height: '100%',
          backgroundColor: isDarkMode ? theme.colors.black : theme.colors.white,
          color: isDarkMode ? theme.colors.white : theme.colors.black,
        })}
      >
        <style>
          {`
          html,body,#root{height:100%;}
          html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);}
          body{margin:0;}
          button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}
          input::-webkit-inner-spin-button,input::-webkit-outer-spin-button,input::-webkit-search-cancel-button,input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none;}
          `}
        </style>
        <Navigation
          isDarkMode={isDarkMode}
          onSwitchThemeClick={handleThemeSwitch}
        />
        <div
          className={useCss({
            backgroundColor: isDarkMode
              ? theme.colors.black
              : theme.colors.white,
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <div className={useCss({width: '600px'})}>
            <FlexGrid flexGridColumnCount={1} flexGridRowGap="20px">
              <FlexGridItem className={useCssLargeCenterFont}>
                Enter a comma-separated list of names to validate
              </FlexGridItem>
              <FlexGridItem>
                <Textarea
                  value={textAreaValue}
                  onChange={e => setTextAreaValue(e.target.value)}
                />
              </FlexGridItem>
              <FlexGridItem className={useCssLargeCenterFont}>or</FlexGridItem>
              <FlexGridItem>
                <FileUploader
                  accept={['text/csv', 'text/plain', '.csv', '.txt']}
                  errorMessage={errorMessage}
                  progressMessage={progressMessage}
                  onRetry={resetFileUploader}
                  onCancel={resetFileUploader}
                  onDrop={handleFileDrop}
                />
              </FlexGridItem>
              <FlexGridItem className={useCssFlexSpaceBetween}>
                <div
                  className={useCss({
                    verticalAlign: 'middle',
                  })}
                >
                  <div
                    className={useCss({
                      ...theme.typography.font550,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      marginRight: '10px',
                    })}
                  >
                    Set threshold:
                  </div>
                  <div
                    className={useCss({
                      ...theme.typography.font200,
                      color: theme.colors.mono600,
                    })}
                  >
                    Optional
                  </div>
                </div>
                <div>
                  <Input
                    value={threshold}
                    size={SIZE.default}
                    error={thresholdInputHasError}
                    onChange={e => setThreshold(e.target.value)}
                  />
                </div>
                <div
                  className={useCss({
                    color: thresholdInputHasError
                      ? theme.colors.negative
                      : theme.colors.mono600,
                    verticalAlign: 'middle',
                    marginLeft: '20px',
                    ...theme.typography.font500,
                  })}
                >
                  Threshold must be a number between -1 and 1
                </div>
              </FlexGridItem>
              <FlexGridItem className={useCssFlexSpaceBetween}>
                <div className={useCss({padding: '8px 0px 8px 0px'})}>
                  <Button
                    kind={ButtonKind.primary}
                    size={SIZE.default}
                    disabled={textAreaValue === ''}
                    isLoading={nameValidation.loading}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
                {nameValidation.error && (
                  <Notification kind={NotificationKind.negative}>
                    {nameValidation.error}
                  </Notification>
                )}
              </FlexGridItem>
              {nameValidation.data.names && (
                <FlexGridItem>
                  <NameDataTable
                    data={nameValidation.data.names}
                    threshold={nameValidation.data.threshold}
                  />
                </FlexGridItem>
              )}
            </FlexGrid>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default compose(
  withRPCRedux('getNameValidities'),
  connect(({nameValidation}) => ({nameValidation}))
)(Home);
