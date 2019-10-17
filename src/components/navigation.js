// @flow
import React from 'react';

import {useStyletron} from 'baseui';

import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import {StyledLink} from 'baseui/link';
import {Button, KIND, SIZE} from 'baseui/button';

const Navigation = ({isDarkMode, onSwitchThemeClick}) => {
  const [useCss, theme] = useStyletron();
  const titleCss = useCss({
    ...theme.typography.font550,
    color: theme.colors.primary,
  });

  return (
    <HeaderNavigation className={useCss({padding: '0px 10px 0px 10px'})}>
      <NavigationList $align={ALIGN.left}>
        <NavigationItem className={titleCss}>
          Gibberish Detector Demo
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.center}></NavigationList>
      <NavigationList $align={ALIGN.right}>
        <NavigationItem>
          <StyledLink
            target={'_blank'}
            href={'https://github.com/koshy1/Gibberish-Detector-Web-Demo'}
          >
            View Source Code
          </StyledLink>
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.right}>
        <NavigationItem>
          <Button
            kind={KIND.primary}
            size={SIZE.compact}
            onClick={onSwitchThemeClick}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
};

export default Navigation;
